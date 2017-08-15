import React from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import globalStore from '../../stores/GlobalStore';
import StdStore from '../../stores/StandardReimburse/StdStore';
import StdAddorEdit from '../../components/StandardReimburse/StdAddorEdit';
import Constant from './Constant';

@observer
class StandardReimburse extends React.Component {

    constructor (props){
        super(props);
        this.stdStore  = new StdStore();
        this.state = {
            mockColumnsData:[
                {type: 'string', id: 'id', 'label': 'id',hidden:true},
                {type: 'string', id: 'code', 'label': 'code',hidden:true},
                {type: 'string', id: 'name', 'label': '标准名称'},
                {type: 'string', id: 'controlrule', 'label': '控制规则',formatter:{
                    type: 'custom',
                    callback:value => this.getControlruleName(value)
                }},
                {type: 'string', id: 'controlpower', 'label': '控制力度',formatter:{
                    type: 'custom',
                    callback:value => this.getControlpowerName(value)
                }},
                {type: 'string', id: 'citylevel0', 'label': '标准金额'},
                {type: 'string', id: 'posts', 'label': '职务',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }},
                {type: 'string', id: 'ranks', 'label': '职级',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }},
                {type: 'string', id: 'users', 'label': '用户',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }},
                {type: 'string', id: 'reimbursebills', 'label': '关联单据',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }}
            ],
            policyexpensetypeValue: "",
            tabPage:1,
            totalPage:1,
            pageData:[]
        }
    }

    getControlruleName = ( value )=>{
        var map = Constant.controlruleList;
        for (var i = 0; i < map.length; i++) {
            if (value == map[i].code) {
                return map[i].name;
            }
        }
        return value;
    }

    getControlpowerName = ( value )=>{
        var map = Constant.controlpowerList;
        for (var i = 0; i < map.length; i++) {
            if (value == map[i].code) {
                return map[i].name;
            }
        }
        return value;
    }

    JsonToList = ( value )=>{
        let result = [] ;
        if(!value || value.length == 0){
            return "";
        }
        value.map((v , i )=>{
            result.push(v.name);
        })
        return result ;
    }

    componentWillMount () {
        this.stdStore.queryStd();
    }

    handlePagination =( page ) =>{
        this.stdStore.queryStandardDataParam.page = page;
        this.stdStore.queryStd();
    }

    updateAndAdd = () =>{
        this.setState({
            tabPage:1
        },()=>{
            this.stdStore.queryStd();
            this.initGrid();
        })
    }

    addStd = () =>{
        if (!this.state.policyexpensetypeValue || this.state.policyexpensetypeValue.length == 0) {
            var msg = [];
            msg.push(<li>请选择标准类型！</li>)
            globalStore.showModel(msg)
            return;
        }
        this.setState({
            tabPage:2,
            pageData:{policyexpensetype:this.state.policyexpensetypeValue}
        })
    }

    initGrid = () =>{
        let _this = this ;
        let tableData = this.stdStore.queryStandardDataList ;
        let num =1 ;
        let pageNum = this.stdStore.getStdPageNum;
        if(tableData && tableData.length != 0 ){
            num =  Math.ceil(pageNum / this.stdStore.queryStandardDataParam.pagenum ) ;
        }
        const CustomComponent  = React.createClass({
            editStd ()  {
                _this.setState({
                    pageData:this.props.rowObj,
                    tabPage:2
                })
            },

            deleteStd (){
                globalStore.showCancelModel("您确认要删除吗？",()=>{
                    // 取消
                },()=>{
                    // 确定
                    let param = [];
                    param.push(this.props.rowObj.id)
                    _this.stdStore.deleteStd({"standardids" :param} , ()=>{
                        _this.stdStore.queryStd();
                        _this.initGrid()
                    });
                });
            },

            render(){
                return (
                    <td>
                        <span className="mr15" onClick={this.editStd}>编辑</span>
                        <span className="" onClick={this.deleteStd}>删除</span>
                    </td>
                )
            }
        })

        return (
            <Grid
                tableData={tableData} columnsModel={this.state.mockColumnsData}
                operationColumn={{
                      className: 'operation',
                      text: ' '
                    }}
                operationColumnClass={CustomComponent}
                paging
                totalPage={num}
                activePage={this.stdStore.queryStandardDataParam.page}
                className="standard-grid"
                onPagination={this.handlePagination}
            />
        )
    }

    getPolicyexpensetypeList =(e)=> {
        var name = "policyexpensetype";
        var value = "";
        var urlstr = "" + e.currentTarget;
        if (urlstr.indexOf("?") != -1) {
            var paramsstr = urlstr.split("?")[1];
            var params = paramsstr.split("&");
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split("=");
                if (param[0] == name) {
                    value = param[1];
                    break;
                }
            }
        }

        this.setState({
            policyexpensetypeValue:value
        })
        this.stdStore.queryStandardDataParam.paras.policyexpensetype = [value];
        this.stdStore.queryStd();
    }

    policyexpensetypeSet = ()=> {
        return (
            Constant.policyexpensetypeList.map((value, index) => {
                if (value.code == this.state.policyexpensetypeValue) {
                    return (
                        <li className="active"><Link to={"/StandardReimburse?policyexpensetype="+value.code} onClick={this.getPolicyexpensetypeList}>{value.name}</Link></li>
                    )
                } else {
                    return (
                        <li><Link to={"/StandardReimburse?policyexpensetype="+value.code} onClick={this.getPolicyexpensetypeList}>{value.name}</Link></li>
                    )
                }
            })
        )
    }

    render(){
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className={this.state.tabPage==1 ? "nav nav-tabs flights-nav" : "nav nav-tabs flights-nav hide"}>
                        <ul>
                            {this.policyexpensetypeSet()}
                        </ul>
                    </div>
                    <div className={this.state.tabPage==1 ? "flights-body" : "flights-body hide"}>
                        <div className="row">
                            <div className="col-md-12">
                                <a  className="btn btn-primary flights-btnadd" href="javascript:;"  onClick={this.addStd}>新增</a>
                            </div>
                        </div>
                        {this.initGrid()}
                    </div>
                    <div className={this.state.tabPage==2 ? "" : "hide"}>
                        <StdAddorEdit pageData = {this.state.pageData} updateAndAdd = {this.updateAndAdd} tabPage = {this.state.tabPage}/>
                    </div>
                </div>
            </div>)
    }
}

export default StandardReimburse;