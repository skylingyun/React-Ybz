/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {DatePicker, Grid as SSCGrid} from 'ssc-grid'
import {observer} from 'mobx-react';
import {
    Breadcrumb, BreadcrumbItem, Button
} from "react-bootstrap";
import BillsAjaxStore from "../../stores/datastatssystem/BillsAjaxStore";
import NotesDetailsAjaxStore from "../../stores/datastatssystem/NotesDetailsAjaxStore";
import NotesDetails from "./NotesDetails";

const billsAjaxStore = new BillsAjaxStore();

@observer
export default class Bills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beginTime: "",
            endTime: "",
            activePage: 1,
            totalPage: 1,
            pageSize:20,
            inputValue: "",
        }
    }

    componentDidMount() {
        //查询列表
        let param = {
            "beginTime": this.state.beginTime,
            "endTime": this.state.endTime,
            activePage: this.state.activePage,
            totalPage: this.state.pageSize
        }
        billsAjaxStore.queryStandardData(param);
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
    searchByConditions = () => {
        let param = {
            "beginTime": this.state.beginTime,"endTime": this.state.endTime,
            activePage: this.state.activePage, totalPage: this.state.pageSize
        }
        billsAjaxStore.queryStandardData(param);
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
                         <a href ={"#/notesDetails/"+[this.props.rowObj.tenantId]+"/"+[this.props.rowObj.businessTripCount]+"/"+[this.props.rowObj.expenseCount]+"/"+[this.props.rowObj.loanBillCount]}>详情</a>
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
                                <BreadcrumbItem active>统计单据</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2">
                            <DatePicker dateFormat="YYYY-mm-DD" value={this.state.beginTime} onChange={this.selectBeginTime}/>
                        </div>
                        <div className="col-md-2">
                            <DatePicker dateFormat="YYYY-mm-DD" value={this.state.endTime} onChange={this.selectEndTime}/>
                        </div>
                        <div className="col-md-2">
                            <Button active onClick={this.searchByConditions}>搜索</Button>
                        </div>
                    </div>
                    <br/>

                    <SSCGrid
                        columnsModel={billsAjaxStore.DataListColumn.toJS()}
                        tableData={billsAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                         operationColumn={{
                              className: 'operation',
                              text: ' '
                          }}
                        // paging
                        // totalPage={this.state.totalPage}
                        // activePage={this.state.activePage}
                        // onPagination={this.handlePagination}
                        // onPagination={that.handleSelect}
                        // className="standard-grid"
                        localSearch/>
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}


