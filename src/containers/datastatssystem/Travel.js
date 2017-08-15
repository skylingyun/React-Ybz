/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {DatePicker2, Grid as SSCGrid} from 'ssc-grid'
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import TravelAjaxStore from "../../stores/datastatssystem/TravelAjaxStore";
import {Breadcrumb, BreadcrumbItem, Button, ControlLabel, FormControl, FormGroup} from "react-bootstrap";

const travelAjaxStore = new TravelAjaxStore();

@observer
export default class NodeTravel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // tabPage: 1,
            // itemData: {}
            // dataList : [],
            // sort:{
            //   name:true
            // },
            // sortIndex:-1,
            activePage: 1,
            totalPage: 1,
            pageSize:20,
            inputValue: "",
            dateTime: ""
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
        let param = {
            "tenantId": "",
            "currentTime": this.state.dateTime,
            "totalPage": this.state.pageSize,
            "activePage": this.state.activePage
        }
        travelAjaxStore.queryStandardData(param,(data)=>{
            let pageNum = Math.ceil(JSON.parse(data).data.totalCount / this.state.pageSize);
            this.setState({totalPage:pageNum})
        });
        //获取仓位列表
        // travelAjaxStore.getList();
        // this.getDataList();
    }

    handleSelect(page) {
        //let that = this;
        travelAjaxStore.queryStandardDataParame.page = page;
        travelAjaxStore.queryStandardData();
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
            travelAjaxStore.deleteStandardData({standardids: [item.id]})
        });
    }

    setDateTime = (value, formattedValue) => {
        this.setState({
            dateTime: formattedValue
        })
    }

    setInputValue = (e) => {
        this.setState({
            inputValue: $(e.currentTarget).val()
        })
    }

    handlePagination = (nextPage) => {
        this.setState({
            /*tableData: 10,*/
            activePage: nextPage
        },()=>{
            this.submitAll()
        });


    }
    submitAll = () => {
        let param = {
            "currentTime": this.state.dateTime, "tenantId": this.state.inputValue,
            activePage: this.state.activePage, totalPage: this.state.pageSize
        }
        travelAjaxStore.queryStandardData(param,(data)=>{
            let pageNum = Math.ceil(JSON.parse(data).data.totalCount / this.state.pageSize);
            this.setState({totalPage:pageNum})
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
                                <BreadcrumbItem active>出行记事</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                        <div className="col-md-2">
                            <FormGroup controlId="formControlsSelect">
                                <FormControl componentClass="select" placeholder="select">
                                    <option value="select">xx9i3hpm</option>
                                    <option value="other">other</option>
                                </FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                            <DatePicker2 value={this.state.dateTime} onChange={this.setDateTime}/>
                        </div>
                        <div>
                            <Button bsSize="small" active onClick={this.submitAll}>搜索</Button>
                        </div>
                    </div>
                    <SSCGrid
                        columnsModel={travelAjaxStore.DataListColumn.toJS()}
                        tableData={travelAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        // operationColumn={{
                        //      className: 'operation',
                        //      text: ' '
                        //  }}
                        paging
                        totalPage={this.state.totalPage}
                        activePage={this.state.activePage}
                        onPagination={this.handlePagination}
                        // onPagination={that.handleSelect}
                        // className="standard-grid"
                        localSearch/>
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}


