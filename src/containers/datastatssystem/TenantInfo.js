/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {Grid, DatePicker2} from 'ssc-grid'
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import {
    Breadcrumb, BreadcrumbItem, Button, DropdownButton, Modal, FormControl, FormGroup, MenuItem,
    SplitButton
} from "react-bootstrap";
import TenantInfoAjaxStore from "../../stores/datastatssystem/TenantInfoAjaxStore";

const tenantInfoAjaxStore = new TenantInfoAjaxStore();

@observer
export default class Tenant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            totalPage: 20,
            inputValue: "",
            dateTime: "",
            show: false,
            tenantId: "",
            userName: "",
            userMobile: "",
            userCode: "",
            userEmail: "",
            relationShow: false,
            selectList: [],
            selectListTitle: "请选择租户",
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.addToTenantItem = this.addToTenantItem.bind(this);
        this.addUserAndRelationItem = this.addUserAndRelationItem.bind(this);
        this.setTabPage = this.setTabPage.bind(this);
        this.isSelect = this.isSelect.bind(this);
    }

    componentDidMount() {//查询列表
        tenantInfoAjaxStore.queryTenantList();

        tenantInfoAjaxStore.getDataBasesList((data) => {
            this.setState({
                selectList: data.data
            })
        })
    }

    handleSelect(page) {
        tenantInfoAjaxStore.queryStandardDataParame.page = page;
        tenantInfoAjaxStore.queryStandardData();
    }

    setTabPage(tab) {
        let that = this;
        that.setState({
            tabPage: tab
        })
    }

    addToTenantItem(item) {
        tenantInfoAjaxStore.getDataBasesList((data) => {
            this.setState({
                selectList: data.data
            }, () => {
                this.setState({
                    show: true
                })
            })
        })
    }

    addUserAndRelationItem(item) {
        let that = this;
        that.setState({
            itemData: {},
            relationShow: true
        }, () => {
            that.setState({
                tabPage: 2
            })
        })
    }

    editItem(item) {
        let that = this;
        that.setState({
            itemData: item
        }, () => {
            let param = {"userMobile": this.state.inputValue}
            tenantInfoAjaxStore.queryStandardData(param, () => {
            })
        })
    }

    delItem(item) {
        globalStore.showCancelModel("您确认要删除吗？", () => {
        }, () => {
            let params = {"tenantId": item.tenantId, "userMobile": this.state.inputValue}
            tenantInfoAjaxStore.deleteStandardData(params)
        });
    }

    setInputValue = (e) => {
        this.setState({
            inputValue: $(e.currentTarget).val()
        })
    }


    submitAll = () => {
        let param = {"userMobile": this.state.inputValue}
        tenantInfoAjaxStore.queryStandardData(param, () => {
        })
    }

    searchByTenantId = () => {
        let param = {"tenantId": this.state.selectListTitle}
        tenantInfoAjaxStore.queryTenantInfoByTenantId(param, () => {

        })
    }

    isSelect = (param) => {
        this.setState({
            selectListTitle: param
        })
    }

    render() {
        let that = this;
        const CustomComponent = React.createClass({
            handleEvent(type, event) {
                event.preventDefault();
                if (type == 1) {
                    that.editItem(this.props.rowObj)
                }
                if (type == 2) {
                    that.delItem(this.props.rowObj)
                }
            },
            render() {
                return (
                    <td>
                        {/*<a onClick={this.handleEvent.bind(this, 2)} href="javascript:;">删除关系</a>*/}
                    </td>
                );
            }
        });


        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <Breadcrumb>
                                <BreadcrumbItem active>查询租户信息</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入手机号" value={this.state.inputValue}
                                             onChange={this.setInputValue}/>
                                <FormControl.Feedback />
                            </FormGroup>
                        </div>
                        <div className="col-md-5">
                            <Button active onClick={this.submitAll}>搜索</Button>
                        </div>
                        <div className="col-md-3">
                            <SplitButton pullRight title={this.state.selectListTitle}
                                         id="split-button-pull-right">
                                {this.state.selectList.map((value, index) => {
                                    return (<MenuItem eventKey={index}
                                                      onSelect={this.isSelect.bind(this, value[index])}>{value[index]}</MenuItem>)
                                })}
                            </SplitButton>
                        </div>
                        <div className="col-md-2">
                            <Button active onClick={this.searchByTenantId}>搜索</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12"></div>
                    </div>

                    <Grid
                        columnsModel={tenantInfoAjaxStore.DataListColumn.toJS()}
                        tableData={tenantInfoAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        operationColumn={{
                            className: 'operation',
                            text: ' '
                        }}
                        localSearch/>
                </div>
            </div>
        );
    }
}


