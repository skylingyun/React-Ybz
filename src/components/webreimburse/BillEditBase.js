import React from 'react';
import {Refers} from 'ssc-refer';
import {DatePicker} from 'ssc-grid';
import Utils from '../../common/utils'
import Config from '../../config'
export default class BillEditShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headListData:'',
      bodyListData:''
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    let headListData = JSON.stringify(nextProps.headListData)
    let bodyListData = JSON.stringify(nextProps.bodyListData)
    if(headListData!=this.state.headListData || bodyListData!=this.state.bodyListData){
      this.setState({
        headListData:headListData,
        bodyListData:bodyListData
      })
      headListData=JSON.parse(headListData)
      bodyListData = JSON.parse(bodyListData)
      let totalMoney = 0;
      bodyListData.map((item)=>{
        item.data.map((ditem)=>{
          totalMoney= totalMoney + ditem.money
        })
      })
      nextProps.getLoanBillItemInformationData.map((item,index)=>{
        if(item.type == 3){
          headListData[item.source_code] = headListData[item.source_code] ? headListData[item.source_code] : Utils.getTime()
        }
        if(item.source_code == 'money'){
          headListData[item.source_code] = totalMoney
        }
      })
      console.log(headListData);
      nextProps.setStateData({headListData:headListData})
    }
  }
  //参照选择
  referHandleChange(type,item){
    let that = this;
    let headListData = that.props.headListData;
    headListData[type] = item;
    that.props.setStateData({headListData:headListData})
  }
  radioInputChange(type,value){
    let that = this;
    let headListData = that.props.headListData;
    headListData[type] = value;
    that.props.setStateData({headListData:headListData})
  }
  inputChange(type,event){
    let that = this;
    let headListData = that.props.headListData;
    headListData[type] = event.target.value;
    that.props.setStateData({headListData:headListData})
  }
  getTime(type,value){
    let that = this;
    let headListData = that.props.headListData;
    headListData[type] = value;
    that.props.setStateData({headListData:headListData})
  }
  render(){
    let that = this;
    let inputStyle={
      width: '100%',
      border: 0,
      outline: 'none',
      lineHeight:'30px'
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
        <h3 style={titleStyle}>基本信息</h3>
        <div className="row">
          {that.props.getLoanBillItemInformationData.map((item,index)=>{
            return (
              <div key={'LoanBill'+index} className={item.source_code == 'money' ? 'hide' : 'col-md-4 col-sm-4 col-xs-4 details-h'} style={{height:'60px'}}>
                <div className="details-h-t">{item.source_name}</div>
                {item.type==5?(
                  <span>
                  {
                    item.source_code == 'bankAccount' ? (
                      <div className="details-h-v" style={{height:'35px'}}>
                        <input style={inputStyle} readOnly="readOnly" value={this.props.UserBankData.userName} type="text" />
                      </div>
                    ) : item.source_code == 'bankAccountKey' ? (
                      <div className="details-h-v" style={{height:'35px'}}>
                        <input style={inputStyle} readOnly="readOnly" value={this.props.UserBankData.bankCard} type="text" />
                      </div>
                    ) : (
                      <Refers
                       key={Math.random()}
                        labelKey={item.typeTwo==3 ? 'code': 'name'}
                        emptyLabel='暂无数据'
                        onChange={that.referHandleChange.bind(this,item.source_code)}
                        placeholder="请选择..."
                        referConditions={{"refType":"table","refCode":(item.source_type==1530 || item.source_type==1520) ? '个人银行账户' :item.dest_property_name,"rootName":item.source_name,"displayFields":["id","name"]}}
                        referDataUrl={Config.webreimburse.webReferUrl}
                        referType="list"
                        selected={that.props.headListData[item.source_code] ? that.props.headListData[item.source_code] : []}
                        ref={ref => this._myrefers = ref}
                        multiple={false}
                      />
                    )
                  }
                  </span>
                ): ''}
                {item.type == 4 ? (
                  <div className="details-h-v" style={{height:'35px'}}>
                    <label>
                      <input type="radio" checked={that.props.headListData[item.source_code]===true} onClick={that.radioInputChange.bind(this,item.source_code,true)} value={true} /> 是
                    </label>
                    <label>
                      <input type="radio" checked={that.props.headListData[item.source_code]===false} onClick={that.radioInputChange.bind(this,item.source_code,false)} value={false} /> 否
                    </label>
                  </div>
                ):''}
                {item.type == 3 ? (

                  <DatePicker id="example-datepicker"
                      dateFormat="YYYY-MM-DD"
                      value={that.props.headListData[item.source_code] ? that.props.headListData[item.source_code] : Utils.getTime()}
                      onChange={that.getTime.bind(this,item.source_code)}/>

                ):''}
                {item.type == 2 ? (
                  <div className="details-h-v" style={{height:'35px'}}>
                  {
                    item.source_code == 'money' ? (
                      <input style={inputStyle} readOnly="readOnly" value={Utils.formatCurrency(that.props.headListData[item.source_code])} type="text" />
                    ) : (
                      <input style={inputStyle} value={that.props.headListData[item.source_code]?that.props.headListData[item.source_code]:''} onChange={that.inputChange.bind(this,item.source_code)} type="text" />
                    )
                  }
                  </div>
                ):''}
                {item.type == 1 || item.type == 0 ? (
                  <div className="details-h-v" style={{height:'35px'}}>
                    <input style={inputStyle} value={that.props.headListData[item.source_code]?that.props.headListData[item.source_code]:''} onChange={that.inputChange.bind(this,item.source_code)} type="text" />
                  </div>
                ):''}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
