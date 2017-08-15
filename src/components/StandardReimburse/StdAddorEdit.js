import React from 'react';
import {observer} from 'mobx-react';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import StdStore  from '../../stores/StandardReimburse/StdStore';
import Config from '../../config';
import {Refers} from 'ssc-refer';
import Constant from '../../containers/StandardReimburse/Constant';

@observer
class StdAddorEdit extends React.Component {

    constructor(props) {
        super(props);
        this.stdStore = new StdStore();
        this.state = {
            standardName: "", // 标准名称
            controlruleValue: "", // 控制规则
            controlpowerValue: "", // 控制力度
            stdtypeValue: "by_all", // 金额标准，目前固定为：统一标准
            citylevel0: "", // 统一标准金额
            citys: [],
            roletypeValue: "", // 权限类型
            posts: [], //职位
            ranks: [], //职级
            users: [], // 用户
            referposts: [], //职位
            referranks: [], //职级
            referusers: [], // 用户
            reimbursebills: [], // 报销单
            referreimbursebills: [], // 报销单
            pageData: [],
            isVisible: false, // “按职务、职级设置”面板是否显示
            isVisible2: false, // “按用户设置”面板是否显示
            isVisible3: false, // “关联单据”面板是否显示
            hideRoletype_by_duty: '', // “职务、职级”信息显示状态参数
            hideRoletype_by_user: 'none' // “用户”信息显示状态参数
        }
    }

    getControlruleList =(e)=>{
        this.setState({
            controlruleValue:$(e.currentTarget).val()
        })
    }

    getControlpowerList =(e)=>{
        this.setState({
            controlpowerValue:$(e.currentTarget).val()
        })
    }

    getRoletypeList =(e)=>{
        this.setState({
            roletypeValue:$(e.currentTarget).val()
        })
        if ($(e.currentTarget).val() == "by_duty") {
            this.state.hideRoletype_by_duty = '';
            this.state.hideRoletype_by_user = 'none';
        } else if ($(e.currentTarget).val() == "by_user") {
            this.state.hideRoletype_by_duty = 'none';
            this.state.hideRoletype_by_user = '';
        } else {
            this.state.hideRoletype_by_duty = 'none';
            this.state.hideRoletype_by_user = 'none';
        }
    }

    componentWillMount() {
        globalStore.hideAlert();
    }

    componentWillReceiveProps(nextProps) {
        var data = nextProps.pageData || [];
        var _this = this;
        this.setState({
            pageData: data
        }, function () {
            _this.init();
        });
    }

    // 获得编辑的数据，通过Store来调用
    init = ()=> {
        var data = this.state.pageData;
        this.setState({
                standardName: data.name || "",
                controlruleValue: data.controlrule || "",
                controlpowerValue: data.controlpower || "",
                stdtypeValue: "by_all", // 金额标准，目前固定为：统一标准
                citylevel0: data.citylevel0 || "",
                roletypeValue: data.roletype || "",
                ranks: data.ranks && data.ranks.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                posts: data.posts&&data.posts.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                users: data.users&&data.users.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                referranks:data.ranks&&data.ranks.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                referposts:data.posts&& data.posts.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                referusers:data.users&& data.users.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                reimbursebills: data.reimbursebills && data.reimbursebills.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
                referreimbursebills:data.reimbursebills&& data.reimbursebills.map((item)=> {
                    let dItem = {}
                    dItem.id=item.pk;
                    dItem.name=item.name?item.name:"";
                    return dItem
                })||[],
            },
            () => {
                // input输入框
                if (this.state.standardName) {
                    this.titleName.style.top = '-10px';
                } else {
                    this.titleName.style.top = '5px';
                }
                if (this.state.citylevel0) {
                    this.titleNameCity0.style.top = '-10px'
                } else {
                    this.titleNameCity0.style.top = '5px'
                }
            })
    }

    //取消提交
    cancelSubmit = () => {
        globalStore.showCancelModel("您确认要取消吗？", ()=> {
            // 取消
        }, ()=> {
            // 确定
            this.props.updateAndAdd();
        });
    }

    //确认提交
    submit = () => {
        var msg = [];
        if (!this.state.standardName) {
            msg.push(<li>标准名称不能为空！</li>)
        }
        if (!this.state.controlruleValue) {
            msg.push(<li>请选择控制规则！</li>)
        }
        if (!this.state.controlpowerValue) {
            msg.push(<li>请选择控制力度！</li>)
        }
        var citys = [];
        if(this.state.citylevel0){
            citys.push({"citylevel":"0", "citymny": this.state.citylevel0+""});
        }else{
            msg.push(<li>请设置标准金额！</li>)
        }
        this.state.citys = citys;
        if (this.state.roletypeValue == "by_duty") {
            if ((!this.state.posts || this.state.posts.length == 0) &&
                (!this.state.ranks || this.state.ranks.length == 0)) {
                msg.push(<li>请选择需要关联的职务、职级！</li>)
            }
        } else if (this.state.roletypeValue == "by_user") {
            if (!this.state.users || this.state.users.length == 0) {
                msg.push(<li>请选择需要关联的用户！</li>)
            }
        }
        if (!this.state.reimbursebills || this.state.reimbursebills.length == 0) {
            msg.push(<li>请选择需要关联的报销单！</li>)
        }
        if (msg.length > 0) {
            globalStore.showModel(msg)
            return;
        }

        var data = {
            "id": this.state.pageData.id,
            "code": "",
            "name": this.state.standardName,
            "policyexpensetype": this.state.pageData.policyexpensetype,     //政策性标准类型
            "controlrule": this.state.controlruleValue,       // 控制规则
            "controlpower": this.state.controlpowerValue, // 控制力度
            "stdtype": this.state.stdtypeValue, // 金额标准
            "citys": this.state.citys,
            "roletype": this.state.roletypeValue, // 权限类型
            "posts": this.state.posts.map((item)=>item.id),    //职务
            "ranks": this.state.ranks.map((item)=>item.id),    //职级
            "users": this.state.users.map((item)=>item.id), // 用户
            "reimbursebills": this.state.reimbursebills.map((item)=>item.id) // 报销单
        };

        if (globalStore.stdEditData && globalStore.stdEditData.length != 0) {
            this.stdStore.updateStd(data, ()=> {
                this.props.updateAndAdd()
            })
        } else {
            this.stdStore.saveStd(data, ()=> {
                this.props.updateAndAdd()
            })
        }
    }

    getStandardName = (e) => {
        this.setState({
            standardName: $.trim($(e.currentTarget).val())
        })
    }

    getCityLevel0 = (e) => {
        this.setState({
            citylevel0: $.trim($(e.currentTarget).val())
        })
    }

    referHandleChange(type, selected) {
        let that = this;
        if (type == 'ranks') {
            let referranks = selected.map((item)=> {
                return {
                    id:item.id,
                    name:item.name?item.name:""
                }
            })
            that.setState({
                referranks: referranks
            })
        }
        if (type == 'posts') {
            let referposts = selected.map((item)=> {
                return {
                    id:item.id,
                    name:item.name?item.name:""
                }
            })
            that.setState({
                referposts: referposts
            })
        }
        if (type == 'users') {
            let referusers = selected.map((item)=> {
                return {
                    id:item.id,
                    name:item.name?item.name:""
                }
            })
            that.setState({
                referusers: referusers
            })
        }
        if (type == 'reimbursebills') {
            let referreimbursebills = selected.map((item)=> {
                return {
                    id:item.id,
                    name:item.name?item.name:""
                }
            })
            that.setState({
                referreimbursebills: referreimbursebills
            })
        }
    }

    sureFn() {
        let that = this;
        let referposts = that.state.referposts;
        let referranks = that.state.referranks;
        let referusers = that.state.referusers;
        let referreimbursebills = that.state.referreimbursebills;
        that.setState({
            isVisible: false,
            isVisible2: false,
            isVisible3: false,
            posts: referposts,
            ranks: referranks,
            users: referusers,
            reimbursebills: referreimbursebills
        })
    }

    cancelFn() {
        let that = this;
        let posts = that.state.posts;
        let ranks = that.state.ranks;
        let users = that.state.users;
        let reimbursebills = that.state.reimbursebills;
        that.setState({
            isVisible: false,
            isVisible2: false,
            isVisible3: false,
            referposts: posts,
            referranks: ranks,
            referusers: users,
            referreimbursebills: reimbursebills
        })
    }

    addRoleList = (e)=> {
        if (this.state.roletypeValue == "by_duty") {
            e.stopPropagation();
            this.setState({
                isVisible: true
            })
        } else if (this.state.roletypeValue == "by_user") {
            e.stopPropagation();
            this.setState({
                isVisible2: true
            })
        } else {
            var msg = [];
            msg.push(<li>请选择权限类型！</li>)
            globalStore.showModel(msg)
            return;
        }
    }

    addBillList = (e)=> {
        e.stopPropagation();
        this.setState({
            isVisible3: true
        })
    }

    controlruleSet = ()=> {
        return (
            Constant.controlruleList.map((value, index) => {
                if (value.code == this.state.controlruleValue) {
                    return (
                        <option value={value.code} selected='true'>{value.name}</option>
                    )
                } else {
                    return (
                        <option value={value.code}>{value.name}</option>
                    )
                }
            })
        )
    }

    controlpowerSet = ()=> {
        return (
            Constant.controlpowerList.map((value, index) => {
                if (value.code == this.state.controlpowerValue) {
                    return (
                        <div className="checkbox mr20 standard-checkbox" key={"controlpowerList"+index}>
                            <label>
                                <input type="radio" name="controlpowerList" value={value.code} checked="true" onClick={this.getControlpowerList}/>
                                {value.name}
                            </label>
                        </div>
                    )
                } else {
                    return (
                        <div className="checkbox mr20 standard-checkbox" key={"controlpowerList"+index}>
                            <label>
                                <input type="radio" name="controlpowerList" value={value.code} onClick={this.getControlpowerList}/>
                                {value.name}
                            </label>
                        </div>
                    )
                }
            })
        )
    }

    roletypeSet = ()=> {
        if (this.state.roletypeValue == "by_duty") {
            this.state.hideRoletype_by_duty = '';
            this.state.hideRoletype_by_user = 'none';
        } else if (this.state.roletypeValue == "by_user") {
            this.state.hideRoletype_by_duty = 'none';
            this.state.hideRoletype_by_user = '';
        } else {
            this.state.hideRoletype_by_duty = 'none';
            this.state.hideRoletype_by_user = 'none';
        }

        return (
            Constant.roletypeList.map((value, index) => {
                if (value.code == this.state.roletypeValue) {
                    return (
                        <option value={value.code} selected='true'>{value.name}</option>
                    )
                } else {
                    return (
                        <option value={value.code}>{value.name}</option>
                    )
                }
            })
        )
    }

    ranksSet = ()=> {
        let ranks = this.state.ranks;
        let that = this;
        if (!ranks || ranks.length == 0) {
            return ( <div className="standard-detail-name"></div>)
        }
        return (
            that.state.ranks.map((item, index)=> {
                if (index === 0) {
                    return (
                        <div key={index+'ranks'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={index+'ranks'} style={{display:"inline-block"}}>
                            、
                            <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    postsSet = () => {
        let posts = this.state.posts;
        let that = this;
        if (!posts || posts.length == 0) {
            return ( <div className="standard-detail-name"></div>)
        }
        return (
            that.state.posts.map((item, index)=> {
                if (index === 0) {
                    return (
                        <div key={index+'posts'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={index+'posts'} style={{display:"inline-block"}}>
                            、
                            <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    usersSet = ()=> {
        let users = this.state.users;
        let that = this;
        if (!users || users.length == 0) {
            return ( <div className="standard-detail-name"></div>)
        }
        return (
            that.state.users.map((item, index)=> {
                if (index === 0) {
                    return (
                        <div key={index+'users'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'users',item)}>x</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={index+'users'} style={{display:"inline-block"}}>
                            、
                            <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'users',item)}>x</span>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    reimburseSet = ()=> {
        let reimbursebills = this.state.reimbursebills;
        let that = this;
        if (!reimbursebills || reimbursebills.length == 0) {
            return ( <div className="standard-detail-name"></div>)
        }
        return (
            that.state.reimbursebills.map((item, index)=> {
                if (index === 0) {
                    return (
                        <div key={index+'reimbursebills'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'reimbursebills',item)}>x</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={index+'reimbursebills'} style={{display:"inline-block"}}>
                            、
                            <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'reimbursebills',item)}>x</span>
                            </div>
                        </div>
                    )
                }
            })
        )
    }

    handleDelete(type, data, event) {
        let that = this;
        let msg = [];
        msg.push('您是否要将')
        msg.push(data.name)
        msg.push('移除')
        if (type == 'ranks') {
            msg.push('职级')
        } else if (type == 'posts') {
            msg.push('职务')
        } else if (type == 'users') {
            msg.push('用户')
        } else if (type == 'reimbursebills') {
            msg.push('报销单')
        }
        msg.push('外?')
        globalStore.showCancelModel(msg.join(''), ()=> {
        }, ()=> {
            if (type === 'ranks') {
                let ranks = that.state.ranks;
                let referranks = that.state.referranks;
                ranks.forEach((item, index)=> {
                    if (data.id == item.id) {
                        ranks.splice(index, 1);
                        referranks.splice(index, 1);
                    }
                })
                that.setState({
                    ranks: ranks,
                    referranks: referranks
                })
            }
            if (type === 'posts') {
                let posts = that.state.posts;
                let referposts = that.state.referposts;
                posts.forEach((item, index)=> {
                    if (data.id == item.id) {
                        posts.splice(index, 1);
                        referposts.splice(index, 1);
                    }
                })
                that.setState({
                    posts: posts,
                    referposts: referposts
                })
            }
            if (type === 'users') {
                let users = that.state.users;
                let referusers = that.state.referusers;
                users.forEach((item, index)=> {
                    if (data.id == item.id) {
                        users.splice(index, 1);
                        referusers.splice(index, 1);
                    }
                })
                that.setState({
                    users: users,
                    referusers: referusers
                })
            }
            if (type === 'reimbursebills') {
                let reimbursebills = that.state.reimbursebills;
                let referreimbursebills = that.state.referreimbursebills;
                reimbursebills.forEach((item, index)=> {
                    if (data.id == item.id) {
                        reimbursebills.splice(index, 1);
                        referreimbursebills.splice(index, 1);
                    }
                })
                that.setState({
                    reimbursebills: reimbursebills,
                    referreimbursebills: referreimbursebills
                })
            }
        });
    }

    //input 获取焦点
    inputOnFocus(type) {
        switch (type) {
            case 0:
                this.titleName.style.top = '-10px';
                break;
            case 100:
                this.titleNameCity0.style.top = '-10px';
                break;
            default:
                break;
        }
    }

    //input 失去焦点
    inputOnBlur(type, event) {
        let val = event.target.value;
        if (val == '') {
            switch (type) {
                case 0:
                    this.titleName.style.top = '5px';
                    break;
                case 100:
                    this.titleNameCity0.style.top = '5px';
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        var that = this;
        return (
            <div className="container-fluid">
                <div className="stdreimburse-box">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="standard-content">标准名称</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="pr">
                                <div ref={(input) => { this.titleName = input; }} className="standard-name-label">标准名称</div>
                                <input type="text" value={this.state.standardName} className="standard-name-input"
                                       onChange={this.getStandardName}
                                       onBlur={ ::this.inputOnBlur.bind(this, 0) }
                                       onFocus={ ::this.inputOnFocus.bind(this, 0) }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stdreimburse-box">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="standard-content">控制规则</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group standard-formgroup">
                                <select name="controlruleList" onChange={this.getControlruleList}>
                                    <option value="">请选择...</option>
                                    {this.controlruleSet()}
                                </select>
                            </div>
                            <div className="form-group standard-formgroup">
                                {this.controlpowerSet()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stdreimburse-box">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="standard-content">标准金额</span>
                        </div>
                    </div>
                    <div className="row mb10">
                        <div className="col-md-3 col-sm-6">
                            <div className="standard-name">
                                <div ref={(input) => { this.titleNameCity0 = input; }} className="standard-name-label">标准金额
                                </div>
                                <input className="standard-name-input" type="number" value={that.state.citylevel0}
                                       onChange={that.getCityLevel0.bind(this)}
                                       onBlur={ this.inputOnBlur.bind(this, 100) }
                                       onFocus={ this.inputOnFocus.bind(this, 100) }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stdreimburse-box">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="standard-content">关联权限</span>
                            <a className="btn btn-primary fr" onClick={that.addRoleList} href="javascript:;">添加</a>
                        </div>
                    </div>
                    <div className="row mb10">
                        <div className="col-md-12">
                            <div className="form-group standard-formgroup">
                                <select name="roletypeList" onChange={this.getRoletypeList}>
                                    <option value="">请选择...</option>
                                    {this.roletypeSet()}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row mb10" style={{display:this.state.hideRoletype_by_duty}}>
                        <div className="col-md-12">
                            <span className="standard-detail">职务： </span>
                            {this.postsSet()}
                        </div>
                        <div className="col-md-12">
                            <span className="standard-detail">职级： </span>
                            {this.ranksSet()}
                        </div>
                    </div>
                    <div className="row mb10" style={{display:this.state.hideRoletype_by_user}}>
                        <div className="col-md-12">
                            <span className="standard-detail">用户： </span>
                            {this.usersSet()}
                        </div>
                    </div>
                </div>

                <div className="stdreimburse-box">
                    <div className="row">
                        <div className="col-md-12">
                            <span className="standard-content">关联单据</span>
                            <a className="btn btn-primary fr" onClick={that.addBillList} href="javascript:;">添加</a>
                        </div>
                    </div>
                    <div className="row mb10">
                        <div className="col-md-12">
                            <span className="standard-detail">报销单： </span>
                            {this.reimburseSet()}
                        </div>
                    </div>
                </div>

                <div className="btn-bottom-fixed">
                    <div className="row btn-bottom">
                        <div className="col-sm-12">
                            <button type="button" onClick={that.submit} className='btn btn-primary fr'>保存</button>
                            <button type="button" onClick={that.cancelSubmit} className='btn btn-default fr'>取消</button>
                        </div>
                    </div>
                </div>

                <Modal show={that.state.isVisible} onHide={that.cancelFn.bind(this)} className="static-modal">
                    <Modal.Header>
                        <Modal.Title>按职务、职级设置</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="stdreimburse-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="screen-condition-label">职务</div>
                                    <div>
                                        <Refers
                                            key={Math.random()}
                                            labelKey="name"
                                            onChange={this.referHandleChange.bind(this,'posts')}
                                            placeholder="请选择..."
                                            emptyLabel='暂无数据'
                                            referConditions={{"refType":"table","rootName":"职级","displayFields":["id","name"]}}
                                            referDataUrl={Config.stdreimburse.referpostsUrl}
                                            referType="list"
                                            selected={that.state.referposts}
                                            ref={ref => this._myrefers = ref}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="screen-condition-label">职级</div>
                                    <div>
                                        <Refers
                                            key={Math.random()}
                                            labelKey="name"
                                            onChange={this.referHandleChange.bind(this,'ranks')}
                                            placeholder="请选择..."
                                            emptyLabel='暂无数据'
                                            referConditions={{"refType":"table","rootName":"职级","displayFields":["id","name"]}}
                                            referDataUrl={Config.stdreimburse.referranksUrl}
                                            referType="list"
                                            selected={that.state.referranks}
                                            ref={ref => this._myrefers = ref}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={that.cancelFn.bind(this)}>取消</Button>
                        <Button bsStyle="primary" onClick={that.sureFn.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={that.state.isVisible2} onHide={that.cancelFn.bind(this)} className="static-modal">
                    <Modal.Header>
                        <Modal.Title>按用户设置</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="stdreimburse-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="screen-condition-label">用户</div>
                                    <div>
                                        <Refers
                                            key={Math.random()}
                                            labelKey="name"
                                            onChange={this.referHandleChange.bind(this,'users')}
                                            placeholder="请选择..."
                                            emptyLabel='暂无数据'
                                            referConditions={{"refType":"table","rootName":"用户","displayFields":["id","name"]}}
                                            referDataUrl={Config.stdreimburse2.referusersUrl}
                                            referType="list"
                                            selected={that.state.referusers}
                                            ref={ref => this._myrefers = ref}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={that.cancelFn.bind(this)}>取消</Button>
                        <Button bsStyle="primary" onClick={that.sureFn.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={that.state.isVisible3} onHide={that.cancelFn.bind(this)} className="static-modal">
                    <Modal.Header>
                        <Modal.Title>关联单据</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="stdreimburse-box">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="screen-condition-label">报销单</div>
                                    <div>
                                        <Refers
                                            key={Math.random()}
                                            labelKey="name"
                                            onChange={this.referHandleChange.bind(this,'reimbursebills')}
                                            placeholder="请选择..."
                                            emptyLabel='暂无数据'
                                            referConditions={{"refType":"table","rootName":"报销单","displayFields":["id","name"]}}
                                            referDataUrl={Config.stdreimburse2.referreimbursebillsUrl}
                                            referType="list"
                                            selected={that.state.referreimbursebills}
                                            ref={ref => this._myrefers = ref}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={that.cancelFn.bind(this)}>取消</Button>
                        <Button bsStyle="primary" onClick={that.sureFn.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default StdAddorEdit;