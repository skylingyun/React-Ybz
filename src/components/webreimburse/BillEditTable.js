import React from 'react';
import {Refers} from 'ssc-refer';
import {DatePicker,Grid} from 'ssc-grid';
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
    return (
      <div>
      {that.props.bodyListData.map((item,d)=>{
        if(item.data.length>0){
          return (
            <div className="details_table" key={'bodylist'+d}>
              <div className="row details_table_t">{item.name} {item.data.length} 次，金额：￥{
                Utils.formatCurrency(item.data.map((d)=>d.money).reduce((a,b,i)=>{
                return a+b
              },0))}</div>
              <div className="standard-grid">
              <Grid
                columnsModel={that.props.BillTableColumn[item.type].toJS()}
                tableData={item.data}
                className="standard-grid"
              />
              </div>
            </div>
          )
        }
      })}
      </div>
    )
  }
}
