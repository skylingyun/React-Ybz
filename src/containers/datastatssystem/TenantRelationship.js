
import React from 'react';
import {Grid as SSCGrid} from 'ssc-grid'
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import TenantRelationshipAjaxStore from "../../stores/datastatssystem/TenantRelationshipAjaxStore";
import FormGroup from "react-bootstrap/es/FormGroup";
import Button from "react-bootstrap/es/Button";
import FormControl from "react-bootstrap/es/FormControl";

const tenantRelationshipAjaxStore = new TenantRelationshipAjaxStore();

@observer
export default class TenantRelationship extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            totalPage: 1,
            pageSize: 20,
            // pageCount:1
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.addItem = this.addItem.bind(this);
        this.setTabPage = this.setTabPage.bind(this);
        // this.dataAddOrUpdate = this.dataAddOrUpdate.bind(this);
        // this.getDataList = this.getDataList.bind(this);
    }

    componentDidMount() {
        //查询列表
        // tenantRelationshipAjaxStore.queryStandardData();
        //获取仓位列表
        // hotelAjaxStore.getList();
        // this.getDataList();
    }

    handleSelect(page) {
        //let that = this;
        tenantRelationshipAjaxStore.queryStandardDataParame.page = page;
        tenantRelationshipAjaxStore.queryStandardData();
        // that.getDataList();
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
        //let that = this;
        globalStore.showCancelModel("您确认要删除吗？", () => {
            // console.log('quxiao')
        }, () => {
            hotelAjaxStore.deleteStandardData({standardids: [item.id]})
        });
    }

    setInputValue = (e) => {
        this.setState({
            inputValue: $(e.currentTarget).val()
        })
    }

    submitAll = () => {
        let param = {
            "tenantId": this.state.inputValue,
            activePage: this.state.activePage, totalPage: this.state.pageSize,
        }
        tenantRelationshipAjaxStore.syncStandardData(param, (data) => {
            console.log("同步租户量："+data.data);
            tenantRelationshipAjaxStore.queryStandardData(param, (data) => {
                let pageNum = Math.ceil(data.data.totalCount / this.state.pageSize);
                this.setState({totalPage: pageNum})
            })
        })
    }

    handlePagination = (nextPage) => {
        this.setState({
            activePage: nextPage
        }, () => {
            // this.submitAll()
            let param = {
                "tenantId": this.state.inputValue,
                activePage: this.state.activePage, totalPage: this.state.pageSize,
            }
            tenantRelationshipAjaxStore.queryStandardData(param, (data) => {
                let pageNum = Math.ceil(data.data.totalCount / this.state.pageSize);
                this.setState({totalPage: pageNum})
            })
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
                        {/*<a onClick={this.handleEvent.bind(this, 1)} href="javascript:void(0)">编辑</a>*/}
                        {/*<a onClick={this.handleEvent.bind(this, 2)} href="javascript:void(0)">删除</a>*/}
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
                                <BreadcrumbItem active>同步用户租户关系</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <FormGroup>
                            <FormControl type="text" placeholder="请输入租户" value={this.state.inputValue}
                                         onChange={this.setInputValue}/>
                            <FormControl.Feedback/>
                        </FormGroup>
                    </div>
                    <div className="col-md-2">
                        <Button active onClick={this.submitAll}>查询</Button>
                    </div>
                    <SSCGrid
                        columnsModel={tenantRelationshipAjaxStore.DataListColumn.toJS()}
                        tableData={tenantRelationshipAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        // operationColumn={{
                        //      className: 'operation',
                        //      text: ' '
                        //  }}
                        paging
                        totalPage={this.state.totalPage}
                        activePage={this.state.activePage}
                        onPagination={this.handlePagination}
                        // className="standard-grid"

                        localSearch/>
                    {/*</div>*/}
                    {/*<div className={that.state.tabPage==2 ? "" : "hide"}>
                     <FlightsAddorEdit FlightsList={hotelAjaxStore.FlightsList.toJS()} setTabPage={that.setTabPage} dataAddOrUpdate={that.dataAddOrUpdate} itemData={this.state.itemData}/>
                     </div>*/}
                </div>
            </div>
        );
    }
}


