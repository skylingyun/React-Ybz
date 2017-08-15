
import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';


import {DatePicker2} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';
import mobx from 'mobx';
import Config from '../../config';
import {Refers} from 'ssc-refer';
import Checkbox from 'rc-checkbox';
import  Upload  from '../../components/webreimburse/Upload';
import  NavTab  from '../../components/webreimburse/NavTab';
import  Footer  from '../../components/webreimburse/Footer';
import  Utils from '../../common/utils';

const webStore = new WebreImburseStore();

@observer
class Restaurant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeValue: "",
            money:"",
            company:"",
            personNum:"" ,//要求传String
            note:"",
            errorTip:{
                money:"",
                person:""
            }
        }
    }

    getMoney =(e)=>{
        this.setState({
            money:$(e.currentTarget).val()
        })
    }
    getTime = (value,formatValue)=> {
        this.setState({
            timeValue:formatValue
        })
    }
    getCompany =(e)=>{
        this.setState({
            company:$(e.currentTarget).val()
        })
    }
    getPersonNum=(e)=>{
        let val = $(e.currentTarget).val()
        this.setState({
            personNum:val
        })
    }
    getNote=(e)=>{
        this.setState({
            note:$(e.currentTarget).val()
        })
    }

    validateMoney =()=>{
        let money = this.state.money;
        money = money.replace(/[^\-?\d.]/g,'') ;
        let validateResult = webStore.validateMoney(money)  ;
        this.setState({
            money:money,
            errorTip:{
                money:validateResult
            }
        })
    }
    //失去焦点自动补全数据
    blurMoney = ()=>{
        let money = this.state.money;
        if(!money||money==""||this.state.errorTip.money){return};
        this.setState({
            money:Utils.formatCurrency( money)
        })
    }

    validatePerson = () =>{
        this.setState({
            errorTip:{person:webStore.validatePerson(this.state.personNum)}
        })
    }


    submitClick =()=>{
        let state = this.state;
        let param = {
            money:state.money,
            company:state.company,
            personNum:state.personNum,
            eatingDate:state.timeValue,
            note:state.note,
            imageSystemType:"oss"
        };

        let errorList = [] , tips = webStore.validateTips;
        errorList.push(webStore.setErrorMessage(state.money,  tips.moeny, state.errorTip.money));
        errorList.push(webStore.setErrorMessage(state.company, tips.company));
        errorList.push(webStore.setErrorMessage(state.personNum, tips.personNum,state.errorTip.person));
        errorList.push(webStore.setErrorMessage(state.timeValue, tips.timeValue));
        errorList = webStore.grepArray(errorList);

        if (errorList && errorList.length > 0) {
            let errorTips = (<div>
                {errorList.map((value, index)=> {
                    return (<p key={"errorMessage"+index}>{value}</p>);
                })} </div>)

            globalStore.showModel(errorTips)
            return;
        }

        webStore.saveEatingNode(param,(data)=>{
            data.result.eating.type = "eating" ;
            globalStore.setCache("cacheData", [data.result.eating]) ;
            this.refs.fileUploadRef.continueUpload();
            this.props.router.replace('/billedit/' + this.props.params.pk)
        })

    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <NavTab pk={this.props.params.pk} tab="eating"/>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="stdreimburse-box">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="standard-content">基本信息</span>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="web-p">金额</p>
                                                <input className="standard-name-input" type="text"
                                                       value={this.state.money} onChange={this.getMoney} placeholder="0.00" onKeyUp={this.validateMoney} onBlur={this.blurMoney}/>
                                                <span className="error">{this.state.errorTip.money}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="web-p">日期</p>
                                                <DatePicker2 id="example-datepicker" dateFormat="YYYY-MM-DD" value={this.state.timeValue}
                                                             onChange={this.getTime}  className="standard-name-input"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="web-p">餐饮公司</p>
                                                <input className="standard-name-input" type="text"
                                                       value={this.state.company} placeholder="餐饮公司" onChange={this.getCompany}/>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="web-p">人数</p>
                                                <input className="standard-name-input" type="text"
                                                       value={this.state.personNum}  placeholder="请输入人数" onChange={this.getPersonNum} onKeyUp={this.validatePerson}/>
                                                <span className="error">{this.state.errorTip.person}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="stdreimburse-box">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="standard-content">备注</span>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <input className="standard-name-input web-remarks" type="text"
                                                       value={this.state.note} onChange={this.getNote}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Upload  uploadOptions={webStore.uploadOptions}  ref="fileUploadRef" />
                    </div>
                </div>

                <Footer submitClick={this.submitClick} pk={this.props.params.pk} router={this.props.router}/>
            </div>

        )
    }
}
export default Restaurant;