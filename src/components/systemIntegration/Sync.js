/**
 * 第二步 同步
 *http://gityonyou.com/sscplatform/fc_doc/blob/75914469cab67dc4ea95e8e42b0037544b3c714e/ybz_synchro.md
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import Checkbox from 'rc-checkbox';
import './sync.less'

class Sync extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      project:false,
      department:false,
      bank: false,
    }
    this.CheckedState = this.CheckedState.bind(this);
    this.cancelSync = this.cancelSync.bind(this);
    this.SyncSend = this.SyncSend.bind(this)
  }
  CheckedState(item,index){
    let that = this;
    let data = that.props.data;
    item.state = !item.state
    data[index] = item;
    that.props.SyncGetData(data);
  }
  cancelSync(item,index){
    let that = this;
    let data = that.props.data;
    globalStore.showCancelModel('已经同了80%，如果取消同步将删除全部，确认取消同步吗？',()=>{
      // 取消
    },()=>{
      item.state = true
      item.tab = 1
      data[index] = item;
      that.props.SyncGetData(data);
      that.props.SyncCancel(item);
      // 确定
    })
  }
  SyncSend(item,index){
    let that = this;
    let data = that.props.data;
    item.state = true
    item.tab = 2
    item.progress = 0
    data[index] = item;
    that.props.SyncGetData(data);
    that.props.SyncSend(item)
  }

  render(){
    let that = this;
    return(
        <div className={this.props.show? "":"hide"}>
          <div className="row sync-row"><p>请选择你要同步的档案</p></div>
          {that.props.data.map((item,index)=>{
            return (
              <div key={index+'sync'} className="row sync-row-list">
                <div className="col-md-7 col-md-offset-5">
                  <ul>
                    <li className={item.tab===1 ? 'show':'hide'}>
                      <label><Checkbox onChange={that.CheckedState.bind(this,item,index)} checked={item.state} />{item.label}</label>
                    </li>
                    <li style={{position:'relative'}} className={item.tab===2 ? 'show':'hide'}>
                      <label><img src="./images/erp-loding.png" />{item.label}</label>
                      <div className="sync-progress">
                        <p className="progress-bg"></p>
                        <p className="progress-p" style={{width:(item.progress*100)+'%'}}></p>
                        <a href="javascript:void(0)" onClick={that.cancelSync.bind(this,item,index)}>取消</a>
                      </div>
                    </li>
                    <li className={item.tab===3 ? 'show':'hide'}>
                      <label><img src="./images/erp-success.png" />{item.label}</label> <span>(同步完成)</span>
                    </li>
                    <li className={item.tab===4 ? 'show':'hide'}>
                      <label><img src="./images/erp-error.png" />{item.label}</label> <span>(同步失败 <a onClick={that.SyncSend.bind(this,item,index)} href="javascript:void(0)">重新同步</a>)</span>
                    </li>

                  </ul>
                </div>
              </div>
            )
          })}
        </div>
    )
  }
}
export default Sync;
