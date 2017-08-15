/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {DatePicker, DatePicker2, Grid as SSCGrid} from 'ssc-grid'
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import {
    Breadcrumb, BreadcrumbItem, Button, Col, ControlLabel, FormControl, FormGroup, MenuItem, Panel,
    SplitButton
} from "react-bootstrap";
import UserAjaxStore from "../../stores/datastatssystem/UserAjaxStore";

const userAjaxStore = new UserAjaxStore();

@observer
export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            totalPage: 1,
            pageSize: 20,
            inputValue: "",
            beginTime: "",
            endTime: "",
            selectOptions: [],
            selectDefault: "efgf8xd9",
            validCode: true
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.addItem = this.addItem.bind(this);
        this.setTabPage = this.setTabPage.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    componentDidMount() {
        //查询列表
        let param = {
            "tenantId": this.state.selectDefault,
            "beginTime": this.state.beginTime,
            "endTime": this.state.endTime,
            "totalPage": this.state.pageSize,
            "activePage": this.state.activePage,
            "validCode": this.state.validCode
        }
        userAjaxStore.queryStandardData(param, (data) => {
            let pageNum = Math.ceil(JSON.parse(data).data.totalCount / this.state.pageSize);
            this.setState({totalPage: pageNum})
        });
        userAjaxStore.selectOptions((data) => {
            this.setState({
                selectOptions: data.data
            })
        });
        userAjaxStore.selectValid((data) => {
            this.setState({
                selectValid: data
            })
        })
    }

    handleSelect(page) {
        userAjaxStore.queryStandardDataParame.page = page;
        userAjaxStore.queryStandardData();
    }

    setTabPage(tab) {
        let that = this;
        that.setState({
            tabPage: tab
        })
    }

    addItem(item) {
        let that = this;
        that.setState({
            itemData: {}
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
            that.setState({
                tabPage: 2
            })
        })
    }

    delItem(item) {
        globalStore.showCancelModel("您确认要删除吗？", () => {
        }, () => {
            userAjaxStore.deleteStandardData({standardids: [item.id]})
        });
    }

    selectBeginTime = (value, formattedValue) => {
        this.setState({
            beginTime: value,
            formattedValue
        })
    }
    selectEndTime = (value, formattedValue) => {
        this.setState({
            endTime: value,
            formattedValue
        })
    }

    selectOption = (param) => {
        this.setState({
            selectDefault: param
        })
    }

    handlePagination = (nextPage) => {
        this.setState({
            activePage: nextPage
        }, () => {
            this.submitAll()
        });


    }
    submitAll = () => {
        let param = {
            "beginTime": this.state.beginTime, "tenantId": this.state.selectDefault,
            activePage: this.state.activePage, totalPage: this.state.pageSize,
            "validCode": this.state.validCode, "endTime": this.state.endTime,
        }
        userAjaxStore.queryStandardData(param, (data) => {
            let pageNum = Math.ceil(JSON.parse(data).data.totalCount / this.state.pageSize);
            this.setState({totalPage: pageNum})
        });
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
                        <a onClick={this.handleEvent.bind(this, 1)} href="javascript:void(0)">编辑</a>
                        <a onClick={this.handleEvent.bind(this, 2)} href="javascript:void(0)">删除</a>
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
                                <BreadcrumbItem active>人员信息</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            <DatePicker dateFormat="YYYY-mm-DD" value={this.state.beginTime}
                                        onChange={this.selectBeginTime}/>
                        </div>
                        <div className="col-md-2">
                            <DatePicker dateFormat="YYYY-mm-DD" value={this.state.endTime}
                                        onChange={this.selectEndTime}/>
                        </div>
                        <div className="col-md-4">
                            <SplitButton pullRight title={this.state.selectDefault}
                                         id="split-button-pull-right">
                                {this.state.selectOptions.map((value, index) => {
                                    return (<MenuItem eventKey={index}
                                                      onSelect={this.selectOption.bind(this, value[index])}>{value[index]}</MenuItem>)
                                })}
                            </SplitButton>
                        </div>
                        <div className="col-md-2">
                            <Button active onClick={this.submitAll}>搜索</Button>
                        </div>
                        <div className="4"></div>
                    </div>
                    <br/>
                    <SSCGrid
                        columnsModel={userAjaxStore.DataListColumn.toJS()}
                        tableData={userAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        // operationColumn={{
                        //       className: 'operation',
                        //      text: ' '
                        //   }}
                        paging
                        totalPage={this.state.totalPage}
                        activePage={this.state.activePage}
                        onPagination={this.handlePagination}
                        localSearch/>
                </div>
            </div>
        );
    }
}


