/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {observer} from 'mobx-react';
import NotesDetailsAjaxStore from "../../stores/datastatssystem/NotesDetailsAjaxStore";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import Grid from "react-bootstrap/es/Grid";
import {
    Breadcrumb, BreadcrumbItem,
} from "react-bootstrap";
import {Grid as SSCGrid} from 'ssc-grid'

const notesDetailsAjaxStore = new NotesDetailsAjaxStore();


@observer
export default class NotesDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // EventsDict:"",
        }
    }

    componentDidMount() {
        //初始化位置
        //查询列表
        let param = {
            "tenantId" : this.props.router.params.tenantId,
            "businessTripCount" : this.props.router.params.businessTripCount,
            "expenseCount" : this.props.router.params.expenseCount,
            "loanBillCount" : this.props.router.params.loanBillCount
        }
        notesDetailsAjaxStore.queryStandardData(param);
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <Breadcrumb>
                                <BreadcrumbItem active>统计单据详情</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>

                    <SSCGrid
                        columnsModel={notesDetailsAjaxStore.DataListColumn.toJS()}
                        tableData={notesDetailsAjaxStore.queryStandardDataList.toJS()}

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


