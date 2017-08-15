
import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

import {DatePicker2} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';
import {Refers} from 'ssc-refer';
import  Upload  from '../../components/webreimburse/Upload';
import  NavTab  from '../../components/webreimburse/NavTab';
import  Footer  from '../../components/webreimburse/Footer';
import  Util from '../../common/utils';
const webStore = new WebreImburseStore();
@observer
class Communication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            money:"",
            moneyList:[{name:"30",id:""},{name:"50",id:""},{name:"100",id:""},{name:"200",id:""},{name:"300",id:""},{name:"其他金额",id:"-1"}],
            communicateList:[{name:"移动电话",id:"0"},{name:"移动上网",id:"0"}],
            phone:"",
            communicateType:"",
            note:"",
            communicateDate:"",
            communicateStart:"",
            communicateEnd:"",
            otherMoney:"",
            otherMoneyShow:false,
            errorTip:{ phone:"",money:"" },
        }
    }

    componentWillMount(){
        this.getDefaultPhone();
    }

    getDefaultPhone = ()=>{
        webStore.getPhone((data)=>{
            console.log("用户的电话号码是："+data.information)
            this.setState({
                phone:data.information
            })
        })
    }

    getTime = (index,value,formattedValue)=> {
        if(index==0 ){
            this.setState({
                communicateDate:formattedValue
            })
        }else if(index ==1 ){
            this.setState({
                communicateStart:formattedValue
            })
        }else{
            this.setState({
                communicateEnd:formattedValue
            })
        }

    }

    getPhone= (e)=>{
        let val = $(e.currentTarget).val() ;
        this.setState({
            errorTip:{phone: webStore.validatePhone(val)},
            phone:$(e.currentTarget).val()
        })
    }

    getCommunicateType = (e)=>{
        this.setState({
            communicateType:$(e.currentTarget).val()
        })
    }

    getNote = (e)=>{
        this.setState({
            note:$(e.currentTarget).val()
        })
    }

    getMoney = (val , id )=>{
        let otherMoneyShow = false ;
        if(id== -1 ){  //其他金额  可输入
            otherMoneyShow =true ;
            val ="";
        }
        this.setState({
            otherMoneyShow:otherMoneyShow ,
            money:val
        })
    }

    getOtherMoney =(e)=>{
        this.setState({
            money : $(e.currentTarget).val()
        })

    }

    validateMoney = (e)=> {
        let val = $(e.currentTarget).val();
        this.setState({
            errorTip: {
                money: webStore.validateMoney(val)
            }
        })

    }
    blurMoney =()=>{
        let money = this.state.money;
        if(!money||money==""||this.state.errorTip.money){return};
        this.setState({
            money:Util.formatCurrency( money)
        })
    }

    submitClick =()=>{
        /*money String 金额
         phoneNumber String 电话号码
         费用发生的号码
         communicateType String 通讯费用类型
         移动电话
         移动上网
         communicateDate String 记事日期
         communicateStart String 费用期间起始日期
         communicateEnd String 费用期间截止日期*/
        let state= this.state ;
        let errorList = [] , tips = webStore.validateTips;
        state.money = Util.unmakeFormatCurrecy(state.money);
        errorList.push(webStore.setErrorMessage(state.money,tips.moeny , state.errorTip.money));
        errorList.push(webStore.setErrorMessage(state.phone, tips.phone, state.errorTip.phone));
        errorList.push(webStore.setErrorMessage(state.communicateType, tips.communicateType));
        errorList.push(webStore.setErrorMessage(state.communicateDate, tips.communicateDate));
        errorList.push(webStore.setErrorMessage(state.communicateStart,tips.communicateStart));
        errorList.push(webStore.setErrorMessage( state.communicateEnd, tips.communicateEnd));

        errorList = webStore.grepArray(errorList);

        if (errorList && errorList.length > 0) {
            let errorTips = (<div>
                {errorList.map((value, index)=> {
                    return (<p key={"errorMessage"+index}>{value}</p>);
                })} </div>)

            globalStore.showModel(errorTips)
            return;
        }

        let param= {
            money:state.money,
            phoneNumber:state.phone,
            communicateType:state.communicateType,
            communicateDate:state.communicateDate,
            communicateStart:state.communicateStart,
            communicateEnd:state.communicateEnd,
            note:state.note,
            imageSystemType:"oss"
        }

        webStore.saveCommunicateNode(param,(data)=>{
            data.result.communicate.type = "communicate";
            globalStore.setCache("cacheData", [data.result.communicate]) ;
            this.refs.fileUploadRef.continueUpload();
            this.props.router.replace('/billedit/' + this.props.params.pk)
        })
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <NavTab  pk={this.props.params.pk} tab="communicate"/>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="stdreimburse-box">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="standard-content">基本信息</span>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="web-p">手机号</p>
                                                <input className="standard-name-input" type="text"
                                                       value={this.state.phone}  onChange={this.getPhone} disabled="disabled"/>
                                                <span className="error">{this.state.errorTip.phone}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="web-p">日期</p>
                                                <DatePicker2  dateFormat="YYYY-MM-DD" value={this.state.communicateDate}
                                                            onChange={this.getTime.bind(this,0)}  className="standard-name-input "/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="web-p">费用期间</p>
                                                <DatePicker2  dateFormat="YYYY-MM-DD" value={this.state.communicateStart}
                                                            onChange={this.getTime.bind(this,1)}  className="standard-name-input web-name-input"/>
                                                <span style={{"margin":"0 10px"}}>至</span>
                                                <DatePicker2  dateFormat="YYYY-MM-DD" value={this.state.communicateEnd}
                                                              onChange={this.getTime.bind(this,2) } className="standard-name-input web-name-input"/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="stdreimburse-box">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="standard-content">金额</span>
                                        <form className="horizontal">
                                            <div className="form-group standard-formgroup">
                                                {this.state.moneyList.map((value ,index )=>{
                                                    return (
                                                        <div className="checkbox mr20 standard-checkbox" key={"invoiceType"+index}>
                                                            <label>
                                                                <input className="web-radio" type="radio" name="moneyList" onClick={this.getMoney.bind(this,value.name,value.id)}
                                                                       value={ value.name}/>
                                                                {value.name}
                                                            </label>
                                                        </div>
                                                    )
                                                } )}
                                                <div className = { this.state.otherMoneyShow ? "checkbox mr20 standard-checkbox" : "hide"} id={this.state.otherMoneyShow}>
                                                    <input className="standard-name-input " type="text" value={this.state.money} onChange={this.getOtherMoney}
                                                           onKeyUp ={this.validateMoney} onBlur={this.blurMoney}/>
                                                    <span className="error">{this.state.errorTip.money}</span>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="stdreimburse-box">
                                <div className="row">
                                    <div className="col-md-12">
                                        <span className="standard-content">通讯类型</span>
                                        <form className="horizontal">
                                            <div className="form-group standard-formgroup">
                                                {this.state.communicateList.map((value ,index )=>{
                                                    return (
                                                        <div className="checkbox mr20 standard-checkbox" key={"invoiceType"+index}>
                                                            <label>
                                                                <input className="web-radio" type="radio" name="communicateList" value={value.name}
                                                                       onClick={this.getCommunicateType}/>
                                                                {value.name}
                                                            </label>
                                                        </div>
                                                    )
                                                } )}
                                            </div>
                                        </form>
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

                        <Upload ref="fileUploadRef" uploadOptions={webStore.uploadOptions} />
                    </div>

                </div>

                <Footer submitClick={this.submitClick} pk={this.props.params.pk} router={this.props.router}/>
            </div>

        )
    }
}
export default Communication;