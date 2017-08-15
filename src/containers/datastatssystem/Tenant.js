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
import TenantAjaxStore from "../../stores/datastatssystem/TenantAjaxStore";

const tenantAjaxStore = new TenantAjaxStore();

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
        let param = {"userMobile": this.state.inputValue}
        tenantAjaxStore.queryStandardData(param);
    }

    handleSelect(page) {
        tenantAjaxStore.queryStandardDataParame.page = page;
        tenantAjaxStore.queryStandardData();
    }

    setTabPage(tab) {
        let that = this;
        that.setState({
            tabPage: tab
        })
    }

    addToTenantItem(item) {
        tenantAjaxStore.getDataBasesList((data) => {
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
            tenantAjaxStore.queryStandardData(param, () => {
            })
        })
    }

    delItem(item) {
        globalStore.showCancelModel("您确认要删除吗？", () => {
        }, () => {
            let params = {"tenantId": item.tenantId, "userMobile": this.state.inputValue}
            tenantAjaxStore.deleteStandardData(params)
        });
    }

    setInputValue = (e) => {
        this.setState({
            inputValue: $(e.currentTarget).val()
        })
    }

    setUserName = (e) => {
        this.setState({
            userName: $(e.currentTarget).val()
        })
    }
    setUserCode = (e) => {
        this.setState({
            userCode: $(e.currentTarget).val()
        })
    }
    setUserEmail = (e) => {
        this.setState({
            userEmail: $(e.currentTarget).val()
        })
    }

    submitAll = () => {
        let param = {"userMobile": this.state.inputValue}
        tenantAjaxStore.queryStandardData(param, () => {
        })
    }

    onHideModal = () => {
        this.setState({
            show: false
        })
    }

    onHideRelationModal = () => {
        this.setState({
            relationShow: false
        })
    }

    addToTenant = () => {
        let param = {"tenantId": this.state.selectListTitle, "userMobile": this.state.inputValue}
        tenantAjaxStore.saveStandardData(param, () => {
            this.setState({
                show: false
            })
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
                        <a onClick={this.handleEvent.bind(this, 2)} href="javascript:;">删除关系</a>
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
                                <BreadcrumbItem active>查询用户所在租户信息</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <a onClick={that.addToTenantItem} className="btn btn-primary"
                               href="javascript:;">添加关联关系</a>
                            &nbsp;
                            <a onClick={that.addUserAndRelationItem} className="btn btn-primary"
                               href="javascript:;">添加用户和关联关系</a>
                        </div>
                        <div className="col-md-2">
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入手机号" value={this.state.inputValue}
                                             onChange={this.setInputValue}/>
                                <FormControl.Feedback />
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <Button active onClick={this.submitAll}>搜索</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12"></div>
                    </div>

                    <Grid
                        columnsModel={tenantAjaxStore.DataListColumn.toJS()}
                        tableData={tenantAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        operationColumn={{
                            className: 'operation',
                            text: ' '
                        }}
                        localSearch/>
                    <Modal show={this.state.show} onHide={this.onHideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-lg">添加关联关系</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <FormControl type="text" placeholder="请输入手机号" value={this.state.inputValue}
                                                     onChange={this.setInputValue}/>
                                        <FormControl.Feedback />
                                    </FormGroup>
                                </div>
                                <div className="col-md-5">
                                    <SplitButton pullRight title={this.state.selectListTitle}
                                                 id="split-button-pull-right">
                                        {this.state.selectList.map((value, index) => {
                                            return (<MenuItem eventKey={index}
                                                              onSelect={this.isSelect.bind(this, value[index])}>{value[index]}</MenuItem>)
                                        })}

                                    </SplitButton>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.addToTenant}>添加关联关系</Button>
                            <Button onClick={this.onHideModal}>关闭</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.relationShow} onHide={this.onHideRelationModal}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-lg">添加用户和关联关系</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入名称" value={this.state.userName}
                                             onChange={this.setUserName}/>
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入编码" value={this.state.userCode}
                                             onChange={this.setUserCode}/>
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入手机号" value={this.state.inputValue}
                                             onChange={this.setInputValue}/>
                                <FormControl.Feedback />
                            </FormGroup>
                            <FormGroup>
                                <FormControl type="text" placeholder="请输入邮箱" value={this.state.userEmail}
                                             onChange={this.setUserEmail}/>
                                <FormControl.Feedback />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.addToTenant}>添加关联关系</Button>
                            <Button onClick={this.onHideRelationModal}>关闭</Button>
                        </Modal.Footer>
                    </Modal>


                </div>
            </div>
        );
    }
}


