import React from 'react';
import {Refers} from 'ssc-refer';
import {DatePicker} from 'ssc-grid';
import Utils from '../../common/utils'
import Config from '../../config'

export default class BillEditShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headListData:{

      }
    }
  }
  componentWillReceiveProps(nextProps) {

  }

  render(){
    let that = this;
    let inputStyle={
      width: '100%',
      border: 0,
      outline: 'none'
    }
    let titleStyle={
      lineHeight: '35px',
      fontSize: '16px',
      fontWeight:'bold'
    }
    let totalMoney = 0;
    that.props.bodyListData.map((item)=>{
      item.data.map((ditem)=>{
        totalMoney= totalMoney + ditem.money
      })
    })
    return (
      <div className="stdreimburse-box">
        <b>明细：共{Utils.formatCurrency(totalMoney)}</b>
        <button type="button" onClick={that.props.webItemAdd} style={{marginLeft:'15px'}} className='btn btn-primary fr'>添加报销明细</button>
        <button type="button" onClick={that.props.ImportData} className='btn btn-default fr'>导入</button>
      </div>
    )
  }
}
