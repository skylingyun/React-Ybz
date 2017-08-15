import React from 'react';
import {Refers} from 'ssc-refer';
import {DatePicker,Grid} from 'ssc-grid';
import Utils from '../../common/utils'
import Config from '../../config'
let pkArray = []
export default class BillEditShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyListData:'{}'
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   let thisbodyListData = this.state.bodyListData
  //   let propsbodyListData = JSON.parse(JSON.stringify(nextProps.bodyListData))
  //   if(thisbodyListData!=propsbodyListData){
  //     this.setState({
  //       bodyListData:propsbodyListData
  //     })
  //
  //   }
  // }
  componentDidMount(){
    this.setCheckData(this.props.bodyListData)
  }
  handleSelect(rowIdx, rowObj, selected, event, selectedRows){
    let flag = -1;
    pkArray.forEach((item,index)=>{
      if(item.pk==rowObj.pk){
        flag = index
      }
    })
    if(selected && flag==-1){
      let obj = JSON.parse(JSON.stringify(rowObj))
      pkArray.push(obj)
    }
    if(!selected && flag>=0){
      pkArray.splice(flag,1);
    }
  }

  setCheckData(bodyListData){
    pkArray=[]
    let that = this;
    that.props.getNodesByDateWithTemplatePkData.forEach((item,index)=>{
      item.data.forEach((itemData)=>{
        bodyListData.map((bi)=>{
          bi.data.length>0 && bi.data.forEach((dItem)=>{
            if(itemData.pk == dItem.pk){
              that['grid'+index].select('pk', dItem.pk, true);
              pkArray.push(dItem)
            }
          })
        })
      })

    })
  }
  handleSelectAll(tableData, selected/* , event, selectedRowsObj */){
    // let pkArrayList = JSON.parse(JSON.stringify(pkArray))
    if(selected){
      tableData.forEach((item)=>{
        let flag = false;
        pkArray.forEach((aitem)=>{
          if(item.pk==aitem.pk){
            flag=true
          }
        })
        if(!flag){
          let obj = JSON.parse(JSON.stringify(item))
          pkArray.push(obj)
        }
      })
    }else{
      for(let i = pkArray.length-1;i>=0;i--){
        tableData.map((item)=>{
          if(item.pk==pkArray[i].pk){
            pkArray.splice(i,1);
          }
        })
      }
    }
  }
  render(){
    let that = this;
    return (
      <div>
      <div className={that.props.tabPage==2 ? "container-fluid":"hide"}>
        <div className="details_title">导入{that.props.BillTypeDataItem.billtype}</div>
          {that.props.getNodesByDateWithTemplatePkData.map((item,index)=>{
            return (
              <div key={'getNodesByDateWithTemplatePkData'+index} className="details_table details_table_b">
                <div className="row details_table_t">{item.date}</div>
                <div className="webimport-grid">
                  <Grid
                     ref={(c) => { that[`grid${index}`] = c; }}
                    selectRow={{
                      mode: 'checkbox',
                      onSelect: that.handleSelect.bind(this),
                      onSelectAll: that.handleSelectAll.bind(this)
                    }}
                    columnsModel={item.columns.toJS()}
                    tableData={item.data.toJS()}
                    className="standard-grid"
                  />
                </div>
              </div>
            )
          })}
      </div>
      <div className={that.props.tabPage==2 ? "btn-bottom-fixed":"hide"}>
        <div className="row btn-bottom">
          <div className="col-sm-12">
            <button type="button" onClick={that.sendData.bind(this)} className='btn btn-primary fr'>确定</button>
            <button type="button" onClick={that.exitData.bind(this)} className='btn btn-default fr'>取消</button>
          </div>
        </div>
      </div>
      </div>
    )
  }
  sendData(){
    let that = this;
    let bodyListData = JSON.parse(JSON.stringify(that.props.bodyListData))
    bodyListData.forEach((item)=>{
      item.data=[]
      pkArray.forEach((aitem)=>{
        if(item.type === aitem.type){
          item.data.push(aitem)
        }
      })
    })
    // console.log(bodyListData);
    that.props.setStateData({bodyListData:bodyListData})
    that.props.setPage(1)
  }
  exitData(){
    this.props.setPage(1);
  }
}
