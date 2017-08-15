/**
 * 轮船报销标准组件
 * author:dangwei
 * date: 2017-05-15
 * mail: dangwei@yonyou.com
 * api:http://git.yonyou.com/sscplatform/fc_doc/blob/master/expense-standard.md
 */
import React from 'react';
import {Link} from 'react-router';
import {Grid as SSCGrid} from 'ssc-grid';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import ShipAddorEdit from '../../components/stdreimburse/ShipAddorEdit';
import StdReimburseShipStore from '../../stores/stdreimburse/StdReimburseShipStore';

const stdReimburseShipStore = new StdReimburseShipStore();

@observer
export default class Ship extends React.Component {
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

  componentDidMount() {
    //查询列表
    stdReimburseShipStore.queryStandardData();
  }

  handleSelect(page) {
    stdReimburseShipStore.queryStandardDataParame.page = page;
    stdReimburseShipStore.queryStandardData();
  }

  setTabPage(tab) {
    let that = this;
    that.setState({
      tabPage: tab
    })
  }

  // 新增用户
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

  // 编辑用户
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

  // 删除行操作
  delItem(item) {
    globalStore.showCancelModel("您确认要删除吗？", ()=> {
      // console.log('quxiao')
    }, ()=> {
      stdReimburseShipStore.deleteStandardData({standardids: [item.id]})
    });
  }

  dataAddOrUpdate(type,data,callback){
    let that = this;
    if(type==0){
      stdReimburseShipStore.saveStandardData(data,callback)
    }else{
      stdReimburseShipStore.updateStandardData(data,callback)
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
                <li><Link to="stdreimburse/hotel">住宿</Link></li>
                <li className="active"><Link to="stdreimburse/ship">轮船票</Link></li>
              </ul>
            </div>
            <div className={that.state.tabPage==1 ?"flights-body" : "flights-body hide"}>
              <div className="row">
                <div className="col-md-12">
                  <a onClick={that.addItem} className="btn btn-primary flights-btnadd" href="javascript:void(0)">新增</a>
                </div>
              </div>
              <SSCGrid
                  columnsModel={stdReimburseShipStore.DataListColumn.toJS()}
                  tableData={stdReimburseShipStore.queryStandardDataList.toJS()}
                  operationColumnClass={CustomComponent}
                  operationColumn={{
                  className: 'operation',
                  text: ' '
                  }}
                  paging
                  totalPage={stdReimburseShipStore.items}
                  activePage={stdReimburseShipStore.page}
                  onPagination={that.handleSelect}
                  className="standard-grid"
              />
            </div>
            <div className={that.state.tabPage==2 ? "" : "hide"}>
              <ShipAddorEdit
              fuserColumn={stdReimburseShipStore.fuserColumn}
              getfilternodeexpensestandarduser={that.getUserList.bind(this)}
              fuserList={stdReimburseShipStore.fuserDataList}
              ShipList={stdReimburseShipStore.ShipList.toJS()}
              setTabPage={that.setTabPage} dataAddOrUpdate={that.dataAddOrUpdate} itemData={this.state.itemData}/>
            </div>
          </div>
        </div>
    );
  }
  getUserList(data){
    stdReimburseShipStore.getfilternodeexpensestandarduser(data)
  }
}
