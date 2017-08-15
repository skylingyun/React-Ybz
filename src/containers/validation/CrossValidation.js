/*
 * 交叉校验规则标准组件
 * */
import React from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import globalStore from '../../stores/GlobalStore';
import CrossValidationStore from '../../stores/validation/CrossValidationStore';
import {Modal, Button} from 'react-bootstrap';
import Config from '../../config';
import {Refers} from 'ssc-refer';
@observer
class CrossValidation extends React.Component {

    constructor(props) {
        super(props);
        this.validaStore = new CrossValidationStore();
        this.state = {
            mockColumnsData: [
                {type: 'string', id: 'id', 'label': 'id', hidden: true},
                {type: 'string', id: 'pk', 'label': 'id', hidden: true},
                {type: 'string', id: 'code', 'label': '编码', hidden: false},
                {type: 'string', id: 'name', 'label': '名称'},
                {type: 'string', id: 'bills', 'label': '单据类型',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }
                },
                {type: 'string', id: 'types', 'label': '类型',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }
                },

            ],
            isVisible: false,
            isMultiple:false,//是否多选
            tabPage: 1,
            totalPage: 1,
            bills: [], //职位
            codes: [], //职级
            types:[],
            pageData: [],
            referbills: [], //职位
            refercodes: [], //职级
            refertypes: [], //职级
        }

    }

    JsonToList = (value)=> {
        let result = [];
        if (!value || value.length == 0) {
            return "";
        }
        value.map((v, i)=> {
            result.push(v.name);
        })
        return result;
    }

    componentWillMount() {
        this.validaStore.queryValidata();
    }


    handlePagination = (page) => {
        this.validaStore.queryValidationDataParam.page = page;
        this.validaStore.queryValidata();

    }


    updateAndAdd = () => {
        this.setState({
            isVisible:false,
        }, ()=> {
            this.validaStore.queryValidata();
            this.initGrid();
        })
    }

    addValidata = () => {
        this.setState({
            isMultiple:true,
            isVisible: true,
            pageData: [],
            referbills:[],
            refertypes:[],
            refercodes:[],
        })

    }

    sureFn() {
        var msg = [];
        var _this = this;
        if (msg.length > 0) {
            globalStore.showModel(msg)
            return;
        }
        var data = {
            "code": this.state.pageData.code,
            "pk": "",
            "id": this.state.pageData.id,
            "name": this.state.pageData.name,
            "policyexpensetype": "validation",
            "bills":this.state.referbills.map((item)=>item.id),   //单据类型
            "types": this.state.refertypes.map((item)=>item.id),    //类型
            "codes": this.state.refercodes.map((item)=>item.id),

        };
        if (globalStore.trainEditData && globalStore.trainEditData.length != 0) {
            this.validaStore.updateValidata(data, ()=> {
                // this.props.updateAndAdd()
                this.validaStore.queryValidata();
            })
        } else {
            this.validaStore.saveValidata(data, ()=> {
                // this.props.updateAndAdd()
                this.validaStore.queryValidata();
            })
        }
        this.setState({
            isVisible:false
        })
    }

    cancelFn() {
        let that = this;
        let bills = that.state.bills;
        let types = that.state.types;
        let codes = that.state.codes;
        that.setState({
            isVisible: false,
            referbills: bills,
            refertypes: types,
            refercodes: codes,

        })
    }

    referHandleChange(type, selected) {
        let that = this;
        if (type == 'bills') {
            let referbills = selected.map((item)=> {
                return {
                    id: item.id,
                    name: item.name ? item.name : ""
                }
            })
            that.setState({
                referbills: referbills
            })
        }
        if (type == 'types') {
            let refertypes = selected.map((item)=> {
                return {
                    id: item.id,
                    name: item.name ? item.name : ""
                }
            })
            that.setState({
                refertypes: refertypes
            })
        }
        if (type == 'codes') {
            let refercodes = selected.map((item)=> {
                return {
                    id: item.id,
                    name: item.name ? item.name : ""
                }
            })
            that.setState({
                refercodes: refercodes
            })
        }
    }

    initGrid = () => {
        let _this = this;
        let tableData = this.validaStore.queryValidationDataList;
        let num = 1;
        let pageNum = this.validaStore.getValidataPageNum;
        if (tableData && tableData.length != 0) {
            num = Math.ceil(pageNum / this.validaStore.queryValidationDataParam.pagenum);
        }
        const CustomComponent = React.createClass({
            editValidata ()  {
                let rowObj =  this.props.rowObj  ;
                _this.setState({
                    bills: rowObj.bills && rowObj.bills.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    referbills:rowObj.bills&&rowObj.bills.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    codes: rowObj.codes && rowObj.codes.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    refercodes:rowObj.codes&&rowObj.codes.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    types: rowObj.types && rowObj.types.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    refertypes: rowObj.types&&rowObj.types.map((item)=> {
                        let dItem = {}
                        dItem.id=item.pk;
                        dItem.name=item.name?item.name:"";
                        return dItem
                    })||[],
                    pageData: rowObj,
                    tabPage: 1,
                    isVisible:true,
                    isMultiple:false,
                })
            },

            deleteValidata (){
                globalStore.showCancelModel("您确认要删除吗？", ()=> {
                    // 取消
                }, ()=> {
                    // 确定
                    let param = [];
                    param.push(this.props.rowObj.id)
                    _this.validaStore.deleteValidata({"ids": param}, ()=> {
                        _this.validaStore.queryValidata();
                        _this.initGrid()
                    });
                });
            },

            render(){
                return (
                    <td>
                        <span className="mr15" onClick={this.editValidata}>编辑</span>
                        <span className="" onClick={this.deleteValidata}>删除</span>
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
                activePage={this.validaStore.queryValidationDataParam.page}
                className="standard-grid"
                onPagination={this.handlePagination}

            />

        )
    }


    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div
                        className={this.state.tabPage==1 ? "nav nav-tabs flights-nav" : "nav nav-tabs flights-nav hide"}>
                        <ul>
                            <li className="active"><Link to="validation/crossvalidation">交叉校验规则</Link></li>
                        </ul>
                    </div>
                    <div className={this.state.tabPage==1 ?"flights-body" : "flights-body hide"}>
                        <div className="row">
                            <div className="col-md-12">
                                <a className="btn btn-primary flights-btnadd" href="javascript:;"
                                   onClick={this.addValidata}>新增</a>
                            </div>
                        </div>
                        {this.initGrid() }
                    </div>
                    <Modal show={this.state.isVisible} onHide={this.cancelFn.bind(this)}>
                        <Modal.Header>
                            <Modal.Title>添加数据</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>

                                <div className="row">
                                        <div className="col-xs-6 col-md-4"> <span className="screen-condition-label screen-condition-title fr">单据类型：</span></div>
                                        <div className="col-xs-6">
                                            <Refers
                                                key={Math.random()}
                                                labelKey="name"
                                                emptyLabel='暂无数据'
                                                onChange={this.referHandleChange.bind(this,'bills')}
                                                placeholder="请选择..."
                                                referConditions={{"refType":"table","rootName":"关联单据","displayFields":["id","name"]}}
                                                referDataUrl={Config.validation.referbillsUrl}
                                                referType="list"
                                                selected={this.state.referbills}
                                                ref={ref => this._myrefers = ref}
                                                multiple={false}
                                            />
                                        </div>
                                </div>
                                <div className="row">
                                        <div className="col-xs-6 col-md-4"> <span className="screen-condition-label screen-condition-title fr">类型：</span></div>
                                        <div className="col-xs-6">
                                            <Refers
                                                key={Math.random()}
                                                labelKey="name"
                                                emptyLabel='暂无数据'
                                                onChange={this.referHandleChange.bind(this,'types')}
                                                placeholder="请选择..."
                                                referConditions={{"refType":"table","rootName":"类型","displayFields":["id","name"]}}
                                                referDataUrl={Config.validation.refertypesUrl}
                                                referType="list"
                                                selected={this.state.refertypes}
                                                ref={ref => this._myrefers = ref}
                                                multiple={false}
                                            />
                                        </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6 col-md-4"> <span className="screen-condition-label screen-condition-title fr">编码：</span></div>
                                    <div className="col-xs-6">
                                        <Refers
                                            key={Math.random()}
                                            labelKey="name"
                                            emptyLabel='暂无数据'
                                            onChange={this.referHandleChange.bind(this,'codes')}
                                            placeholder="请选择..."
                                            referConditions={{"refType":"table","rootName":"编码","displayFields":["id","name"],"condition":[this.state.referbills,this.state.refertypes]}}
                                            referDataUrl={Config.validation.refercodesUrl}
                                            // referType="list"
                                            selected={this.state.refercodes}
                                            ref={ref => this._myrefers = ref}
                                            multiple={this.state.isMultiple}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer style={{"paddingRight":"36%"}}>
                            <Button onClick={this.cancelFn.bind(this)}>取消</Button>
                            <Button bsStyle="primary" onClick={this.sureFn.bind(this)}>确定</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            </div>)
    }
}

export  default CrossValidation ;