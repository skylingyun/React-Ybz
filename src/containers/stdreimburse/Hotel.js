/**
 * 住宿报销标准组件
 * author:zhangtongchuan
 * date: 2017-05-15
 * mail: zhangtch@yonyou.com
 * api:http://git.yonyou.com/sscplatform/fc_doc/blob/master/expense-standard.md
 */
import React from 'react';
import {Link} from 'react-router';
import {Grid as SSCGrid} from 'ssc-grid'
import mobx from 'mobx';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import HotelAddorEdit from '../../components/stdreimburse/HotelAddorEdit';
import StdReimburseHotelStore from '../../stores/stdreimburse/StdReimburseHotelStore';

const stdReimburseHotelStore = new StdReimburseHotelStore();

@observer
export default class Hotel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPage: 1,
      itemData: {}
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.addItem = this.addItem.bind(this);
    this.setTabPage = this.setTabPage.bind(this);
    this.dataAddOrUpdate = this.dataAddOrUpdate.bind(this);
  }

  componentDidMount(){
    //查询列表
    stdReimburseHotelStore.queryStandardData();
  }

  handleSelect(page) {
    stdReimburseHotelStore.queryStandardDataParame.page = page;
    stdReimburseHotelStore.queryStandardData();
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
      stdReimburseHotelStore.deleteStandardData({standardids: [item.id]})
    });
  }

  dataAddOrUpdate(type,data,callback){
    let that = this;
    if(type==0){
      stdReimburseHotelStore.saveStandardData(data,callback)
    }else{
      stdReimburseHotelStore.updateStandardData(data,callback)
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
              <li><Link to="stdreimburse/flights">机票</Link></li>
              <li><Link to="stdreimburse/train">火车票</Link></li>
              <li className="active"><Link to="stdreimburse/hotel">住宿</Link></li>
              <li><Link to="stdreimburse/ship">轮船票</Link></li>
            </ul>
          </div>
          <div className={that.state.tabPage==1 ?"flights-body" : "flights-body hide"}>
            <div className="row">
              <div className="col-md-12">
                <a onClick={that.addItem} className="btn btn-primary flights-btnadd" href="javascript:void(0)">新增</a>
              </div>
            </div>
            <SSCGrid
              columnsModel={stdReimburseHotelStore.DataListColumn.toJS()}
              tableData={stdReimburseHotelStore.queryStandardDataList.toJS()}
              operationColumnClass={CustomComponent}
              operationColumn={{
                  className: 'operation',
                  text: ' '
                  }}
              paging
              totalPage={stdReimburseHotelStore.items}
              activePage={stdReimburseHotelStore.page}
              onPagination={that.handleSelect}
              className="standard-grid"
            />
          </div>
          <div className={that.state.tabPage==2 ? "" : "hide"}>
            <HotelAddorEdit
            fuserColumn={stdReimburseHotelStore.fuserColumn}
            getfilternodeexpensestandarduser={that.getUserList.bind(this)}
            fuserList={stdReimburseHotelStore.fuserDataList}
            cityLevel={stdReimburseHotelStore.CityLevel.toJS()}
            setTabPage={that.setTabPage}
            dataAddOrUpdate={that.dataAddOrUpdate}
            itemData={this.state.itemData}/>
          </div>
        </div>
      </div>
    );
  }
  getUserList(data){
    stdReimburseHotelStore.getfilternodeexpensestandarduser(data)
  }
}
