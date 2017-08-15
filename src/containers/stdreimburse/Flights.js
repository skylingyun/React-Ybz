/**
 * 机票报销标准 组件
 * author:zhangtongchuan
 * date: 2017-05-15
 * mail: zhangtch@yonyou.com
 * api:http://git.yonyou.com/sscplatform/fc_doc/blob/master/expense-standard.md
 */
import React from 'react';
import {Link} from 'react-router';
import {Grid} from 'ssc-grid'
import mobx from 'mobx';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import FlightsAddorEdit from '../../components/stdreimburse/FlightsAddorEdit';
import standardReimburseFlightsAjaxStore from '../../stores/stdreimburse/StdReimburseFlightsStore';

const flightsAjaxStore = new standardReimburseFlightsAjaxStore();

@observer
export default class Flights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPage: 1,
      itemData: {}
      // dataList : [],
      // sort:{
      //   name:true
      // },
      // sortIndex:-1,
      // activePage:1,
      // pageCount:1
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.addItem = this.addItem.bind(this);
    this.setTabPage = this.setTabPage.bind(this);
    this.dataAddOrUpdate = this.dataAddOrUpdate.bind(this);
    // this.getDataList = this.getDataList.bind(this);
  }

  componentDidMount(){
    //查询列表
    flightsAjaxStore.queryStandardData();
    //获取仓位列表
    // flightsAjaxStore.getList();
    // this.getDataList();
  }

  handleSelect(page) {
    //let that = this;
    flightsAjaxStore.queryStandardDataParame.page = page;
    flightsAjaxStore.queryStandardData();
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
    }, ()=> {
      that.setState({
        tabPage: 2
      })
    })
  }

  editItem(item) {
    let that = this;
    that.setState({
      itemData: item
    }, ()=> {
      that.setState({
        tabPage: 2
      })
    })
  }

  delItem(item) {
    //let that = this;
    globalStore.showCancelModel("您确认要删除吗？", ()=> {
      // console.log('quxiao')
    }, ()=> {
      flightsAjaxStore.deleteStandardData({standardids: [item.id]})
    });
  }

  /*
   // getDataList(){
   //   let that = this;
   //   flightsAjaxStore.queryStandardData((flag)=>{
   //     if(flag){
   //       that.setState({
   //         dataList:mobx.toJS(flightsAjaxStore.queryStandardDataList.data),
   //         activePage:mobx.toJS(flightsAjaxStore.queryStandardDataList.page),
   //         pageCount:Math.ceil(mobx.toJS(flightsAjaxStore.queryStandardDataList.totalnum)/mobx.toJS(flightsAjaxStore.queryStandardDataList.pagenum)),
   //       })
   //     }
   //   })
   // }
   // ColSort(name,index,event){
   //   event.preventDefault();
   //   let that = this;
   //   let dataList = Object.assign([],that.state.dataList);
   //   let sort = that.state.sort
   //   let sortFlag = that.state.sort[name];
   //   sort[name]=!sort[name]
   //   dataList = dataList.sort((a,b)=>{
   //     // console.log(a,b,a[name]>b[name]);
   //     if(sortFlag){
   //       return a[name]>b[name] ? -1 : 1;
   //     }else{
   //       return a[name]>b[name] ? 1 : -1;
   //     }
   //   })
   //   let state = {
   //     sort:sort,
   //     dataList:dataList,
   //     sortIndex:index
   //   }
   //   // console.log(dataList);
   //   that.setState(state)
   // }
   */
  dataAddOrUpdate(type,data,callback){
    let that = this;
    if(type==0){
      flightsAjaxStore.saveStandardData(data,callback)
    }else{
      flightsAjaxStore.updateStandardData(data,callback)
    }
    // that.setTabPage(1)
  }
  render() {
    let that = this;
    const CustomComponent = React.createClass({
      handleEvent(type,event) {
        event.preventDefault();
        if(type==1){
          that.editItem(this.props.rowObj)
        }
        if(type==2){
          that.delItem(this.props.rowObj)
        }
      },
      render() {
        return (
          <td>
            <a onClick={this.handleEvent.bind(this,1)} href="javascript:void(0)">编辑</a>
            <a onClick={this.handleEvent.bind(this,2)} href="javascript:void(0)">删除</a>
          </td>
        );
      }
    });
    return (
        <div className="content">
          <div className="container-fluid">
            <div className={that.state.tabPage==1 ? "nav nav-tabs flights-nav" : "nav nav-tabs flights-nav hide"}>
              <ul>
                <li className="active"><Link to="stdreimburse/flights">机票</Link></li>
                <li><Link to="stdreimburse/train">火车票</Link></li>
                <li><Link to="stdreimburse/hotel">住宿</Link></li>
                <li><Link to="stdreimburse/ship">轮船票</Link></li>
              </ul>
            </div>
            <div className={that.state.tabPage==1 ?"flights-body" : "flights-body hide"}>
              <div className="row">
                <div className="col-md-12">
                  <a onClick={that.addItem} className="btn btn-primary flights-btnadd" href="javascript:void(0)">新增</a>
                </div>
              </div>
              <Grid
                columnsModel={flightsAjaxStore.DataListColumn.toJS()}
                tableData={flightsAjaxStore.queryStandardDataList.toJS()}
                operationColumnClass={CustomComponent}
                operationColumn={{
                  className: 'operation',
                  text: ' '
                }}
                paging
                totalPage={flightsAjaxStore.items}
                activePage={flightsAjaxStore.activePage}
                onPagination={that.handleSelect}
                className="standard-grid"
              />
            </div>
            <div className={that.state.tabPage==2 ? "" : "hide"}>
              <FlightsAddorEdit
              fuserColumn={flightsAjaxStore.fuserColumn}
              getfilternodeexpensestandarduser={that.getUserList.bind(this)}
              fuserList={flightsAjaxStore.fuserDataList}
              FlightsList={flightsAjaxStore.FlightsList.toJS()}
              setTabPage={that.setTabPage}
              dataAddOrUpdate={that.dataAddOrUpdate}
              itemData={this.state.itemData}/>
            </div>
          </div>
        </div>
    );
  }
  getUserList(data){
    flightsAjaxStore.getfilternodeexpensestandarduser(data)
  }
}
