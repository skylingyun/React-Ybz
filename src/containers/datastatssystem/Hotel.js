/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {Grid as SSCGrid} from 'ssc-grid'
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import HotelAjaxStore from "../../stores/datastatssystem/HotelAjaxStore";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

const hotelAjaxStore = new HotelAjaxStore();

@observer
export default class NodeHotel extends React.Component {
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
            activePage: 1
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
        hotelAjaxStore.queryStandardData();
        //获取仓位列表
        // hotelAjaxStore.getList();
        // this.getDataList();
    }

    handleSelect(page) {
        //let that = this;
        hotelAjaxStore.queryStandardDataParame.page = page;
        hotelAjaxStore.queryStandardData();
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
                                <BreadcrumbItem active>住宿记事</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </div>
                    <SSCGrid
                        columnsModel={hotelAjaxStore.DataListColumn.toJS()}
                        tableData={hotelAjaxStore.queryStandardDataList.toJS()}
                        operationColumnClass={CustomComponent}
                        // operationColumn={{
                        //      className: 'operation',
                        //      text: ' '
                        //  }}
                        // paging
                        // totalPage={hotelAjaxStore.items}
                        // activePage={hotelAjaxStore.activePage}
                        onPagination={that.handleSelect}
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


