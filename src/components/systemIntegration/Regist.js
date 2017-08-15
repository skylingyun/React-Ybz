/**
 * 第一步 注册
 */
import React from 'react';
import {observer} from 'mobx-react';
import {ValidateInput} from 'ssc-grid';
import {FormGroup,FormControl,HelpBlock, Button,Alert} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import leadStore from '../../stores/systemIntegration/LeadStore';

class Regist extends React.Component{

    constructor(props){
        super(props);
        this.leadStore =  new leadStore();
        this.state= {
            formContentShow:true ,
            formTipsShow:false,
            osTypeInfo:[],
            commonSite:{
                validation:"success",
                tips:"",
                val:''
            },
            ncVersion:{
                validation:"success",
                tips:"",
                val:''
            },
            nameItem:{
                "ncName":"MA地址",
                "ncVersion":"NC版本号",
                "U8":"企业标识",
                "U9":"企业编码"
            },
            saveResult:"",
            saveResultShow:false
        }
    }

    getIsRegister (){
        return this.leadStore.osTypeInfo.osType;
    }

    componentWillMount(){
        this.leadStore.getOsType(()=>{
            let osTypeInfo =  this.leadStore.osTypeInfo;
            this.setState({
                osTypeInfo : osTypeInfo
            })
        }) ;
    }

    componentWillReceiveProps(nextProps){
    }

    getSite =(param ,e) =>{
        e.stopPropagation();
        let el = $(e.currentTarget);
        this.setState({
            commonSite:{
                val:el.val()
            }
        });
    }

    getNcVersion = (e) =>{
        e.stopPropagation();
        let el = $(e.currentTarget);
         /* if( !this.validatePhone(el.val())){
            this.setState({
                ncVersion:{
                    val: $.trim( el.val() ),
                    validation:'error',
                    tips:'请输入正确的手机号码！'
                }
            })
            return ;
        }*/
        this.setState({
            ncVersion:{
                val: $.trim( el.val() )
            }
        });
    }


    formContent = () =>{
        let tips =(<Alert bsStyle="danger" className={this.state.saveResultShow ?　"" :"hide"}>{this.state.saveResult}</Alert>)
        return (
            <div className={this.state.formContentShow ? "register-box":"hide"} >
                <p>您现在使用的系统是{this.state.osTypeInfo.osType}</p>
                {tips}
                {this.inputContent()}
            </div>
        )
    }

    inputContent =()=>{
        let osType = this.state.osTypeInfo.osType ;
        let osTypeUpper ="" ;
        if(osType){
            osTypeUpper = osType.toUpperCase() ;
        }
        let submit =( <button className="btn btn-primary center-block" onClick={this.formSubmit}>确定</button> );
        if(osTypeUpper == "NC"){
            return (
                <div>
                    <p><span>*</span>{this.state.nameItem.ncName}</p>
                    <FormGroup validationState={this.state.commonSite.validation}>
                        <FormControl type="text" onChange={this.getSite.bind(this,"NC")}/>
                        <HelpBlock>{this.state.commonSite.tips}</HelpBlock>
                    </FormGroup>

                    <p><span>*</span>{this.state.nameItem.ncVersion}</p>
                    <FormGroup validationState={this.state.ncVersion.validation}>
                        <FormControl type="text" onChange={this.getNcVersion}/>
                        <HelpBlock>{this.state.ncVersion.tips}</HelpBlock>
                    </FormGroup>
                    {submit}
                </div>
            )
        }else if(osTypeUpper == "U8"){
            return (
                <div>
                    <p><span>*</span>{this.state.nameItem.U8}</p>
                    <FormGroup validationState={this.state.commonSite.validation}>
                        <FormControl type="text" onChange={this.getSite.bind(this,"U8")}/>
                        <HelpBlock>{this.state.commonSite.tips}</HelpBlock>
                    </FormGroup>
                    {submit}
                </div>
            )

        }else if(osTypeUpper=="U9"){
            return (
                <div>
                    <p><span>*</span>{this.state.nameItem.U9}</p>
                    <FormGroup validationState={this.state.commonSite.validation}>
                        <FormControl type="text" onChange={this.getSite.bind(this,"U9")}/>
                        <HelpBlock>{this.state.commonSite.tips}</HelpBlock>
                    </FormGroup>
                    {submit}
                </div>
            )
        }else if(osTypeUpper == "SAAS"){
            return(
                <Alert bsStyle="danger">
                    您的企业没有集成ERP系统的权限或授权已过期
                </Alert>
            )
        }
    }


    /**
     * @表单提交
     * NC只传 maurl和version; u8只传 u8usercode; u9只传 u9companyId; tenantId 和 手机号都传
     */
    formSubmit = () => {
        let commonSiteValue = this.state.commonSite.val  , ncVersionValue = this.state.ncVersion.val ,
            osType = this.state.osTypeInfo.osType,osTypeUpper = osType.toUpperCase() ;
        this.setState({
            saveResult:""
        })

        if(!commonSiteValue||commonSiteValue.length<0){
            this.setState({
                commonSite:{
                    validation:"error",
                    tips:"字段不能为空！"
                }
            })
            return ;
        }

        var param = {
            "tenantId": this.state.osTypeInfo.tenantId,
            "phone":this.state.osTypeInfo.phone
        };

        if(osTypeUpper == "NC"){
            if(!ncVersionValue||ncVersionValue.length<0){
                this.setState({
                    ncVersion:{
                        validation:"error",
                        tips:"字段不能为空！"
                    }
                })
                return ;
            }
            param.maurl =  commonSiteValue;
            param.version= ncVersionValue;
        }else if(osTypeUpper == "U8"){
            param.u8usercode = commonSiteValue;
        }else if(osTypeUpper=="U9"){
            param.u9companyId = commonSiteValue;
        }


        this.leadStore.saveErpRegister(param , ()=>{
            let json = this.leadStore.saveErpRegisterResult;
            if(json.code != 0 ){
                this.setState({
                    saveResult:json.information || "保存失败",
                    saveResultShow:true
                })
            }else{
                this.setState({
                    formContentShow:false,
                    formTipsShow:true
                },()=>{
                    window.top.document.location.hash ="#";
                    setTimeout(()=>{
                        window.top.document.getElementById("logout").click();
                    },1000)

                })

            }

        })

    }

    formTips = () =>{
        return (
            <div className={this.state.formTipsShow ? "":"hide"}>
                <p className="register-page"><span className="erp-success"></span>恭喜！您的ERP系统和友报账产品已经连接成功！</p>
                {this.formTipsContent()}
                {/*
                <div>
                    <p className="register-next">下一步，请您将ERP的档案同步到友报账中吧。</p>
                    <div className="lead-title-btn">
                        <button className="btn btn-primary" onClick={this.nextPage}>去同步</button>
                    </div>
                </div>
                 */}
            </div>

        )
    }

    formTipsContent = () =>{
        let osType = this.state.osTypeInfo.osType ;
        if(!osType) return ;
        let upperCase =  osType.toUpperCase() ;
        if(upperCase=="NC"){
            return (
                <div className="register-content">
                    <p><lable>{this.state.nameItem.ncName}：</lable><span>{this.state.commonSite.val || ""}</span></p>
                    <p><lable>{this.state.nameItem.ncVersion}：</lable><span>{this.state.ncVersion.val||""}</span></p>
                </div>
            )
        }else if (upperCase=="U8"){
            return (
                <div className="register-content">
                    <p><lable>{this.state.nameItem.U8}：</lable><span>{this.state.commonSite.val || ""}</span></p>
                </div>
            )
        }else if(upperCase == "U9"){
            return (
                <div className="register-content">
                    <p><lable>{this.state.nameItem.U9}：</lable><span>{this.state.commonSite.val || ""}</span></p>
                </div>
            )
        }

    }

    nextPage= ()=> {
        this.props.changeShow(2)
    }

    render(){
        return(
            <div className={this.props.show? "":"hide"}>
                {this.formContent()}
                {this.formTips()}
            </div>
        )
    }

    validatePhone = (param ) =>{
        let result =  false ;
        if( (/^1[34578]\d{9}$/.test(param))){
            result = true ;
        }
        return result ;

    }
}
export default Regist;