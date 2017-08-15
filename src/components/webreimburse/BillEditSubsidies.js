import React from 'react';
import {DatePicker2} from 'ssc-grid';
import Utils from '../../common/utils'
export default class BillEditShare extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      bodyListData:'',
      money: 0,
      day: 0,
      total: 0,
      startDate: '',
      endDate: ''
    }
  }
  getDateData(data){
    let startDate=0
    let endDate = 0
    let days = 0;
    let flag = 0
    data.forEach((item)=>{
      if(item.type=='travel' || item.type=='hotel' ){
        item.data.forEach((ditem)=>{
          if(flag==0){
            startDate = ditem.startDate
            endDate = ditem.endDate
            flag++
          }else{
            if(ditem.startDate<startDate){
              startDate=ditem.startDate
            }
            if(ditem.endDate>endDate){
              endDate = ditem.endDate
            }
          }
        })
      } else if (item.type == 'eating') {
        item.data.forEach((ditem)=>{
          if(flag==0){
            startDate = ditem.eatingDate
            endDate = ditem.eatingDate
            flag++
          }else{
            if(ditem.eatingDate<startDate){
              startDate= ditem.eatingDate
            }
            if(ditem.eatingDate>endDate){
              endDate=ditem.eatingDate
            }
          }
        })
      } else if (item.type == 'communicate') {
        item.data.forEach((ditem)=>{
          if(flag==0){
            startDate = ditem.communicateStart
            endDate = ditem.communicateEnd
            flag++
          }else{
            if(ditem.communicateStart<startDate){
              startDate= ditem.communicateStart
            }
            if(ditem.communicateEnd>endDate){
              endDate=ditem.communicateEnd
            }
          }
        })
      } else if (item.type == 'other') {
        item.data.forEach((ditem)=>{
          if(flag==0){
            startDate = ditem.otherDate
            endDate = ditem.otherDate
            flag++
          }else{
            if(ditem.otherDate<startDate){
              startDate= ditem.otherDate
            }
            if(ditem.otherDate>endDate){
              endDate=ditem.otherDate
            }
          }
        })
      }
    })

    startDate = startDate == 0 ? '' : Utils.formatDate(startDate)
    endDate = endDate == 0 ? '' : Utils.formatDate(endDate)
    days = this.getDays(startDate,endDate)
    return [startDate,endDate,days]
  }
  getDays(startDate,endDate){
    let d = new Date(endDate) - new Date(startDate)
    let days = endDate=='' || startDate=='' ? 0 : Math.ceil(d/1000/60/60/24)+this.props.BillTypeDataItem.standardTime
    days = isNaN(days) ? 0 : days
    return days < 0 ? 0 : days
  }
  componentWillReceiveProps(nextProps) {
    let nextp = JSON.stringify(nextProps.bodyListData)
    let thisp = this.state.bodyListData;//JSON.parse(JSON.stringify(this.state.bodyListData))
    if(nextp!=thisp){
      let that = this;
      let [startDate,endDate,days] = this.getDateData(nextProps.bodyListData)
      // let data = JSON.parse(JSON.stringify(this.props.BillTypeDataItem))
      this.setState({
        bodyListData: JSON.stringify(nextProps.bodyListData),
        money: this.props.subsidiesData['money'] ? this.props.subsidiesData['money'] : this.props.BillTypeDataItem.standardUnit,
        day: this.props.subsidiesData['day'] ? this.props.subsidiesData['day'] : days,
        startDate: this.props.subsidiesData['startDate'] ? this.props.subsidiesData['startDate'] : startDate,
        endDate: this.props.subsidiesData['endDate'] ? this.props.subsidiesData['endDate'] : endDate
      },()=>{
        that.setTotal()
      })
    }

  }
  setTotal(){
    let that = this;
    let day = this.state.day
    let money =  this.state.money
    let total = day*money
    total = isNaN(total) ? 0 : total
    this.setState({
      total: total
    })
    console.log(this.props.subsidiesData);
    let subsidiesData = {
      money: money,
      day: day,
      startDate: that.state.startDate,
      endDate: that.state.endDate,
      total: total
    }
    if(JSON.stringify(subsidiesData) != JSON.stringify(this.props.subsidiesData)){
      that.props.setStateData({subsidiesData:{
        money: money,
        day: day,
        startDate: that.state.startDate,
        endDate: that.state.endDate,
        total: total
      }})
    }

  }
  getTime(type,value){
    value=Utils.formatDate(value)
    let that = this;
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    console.log(startDate,endDate);
    if(type=='startDate'){
      let day = that.getDays(value,endDate)
      that.setState({
        day:day,
        startDate:value
      },()=>{
        that.setTotal()
      })
    }
    if(type=='endDate'){
      let day = that.getDays(startDate,value)
      that.setState({
        day:day,
        endDate:value
      },()=>{
        that.setTotal()
      })
    }
  }
  inputChange(event){
    let value = event.target.value;
    let name = event.target.name;
    let that = this;
    that.setState({
      [name]:value
    },()=>{
      that.setTotal()
    })
  }
  render(){
    let that = this;
    let titleStyle={
      lineHeight: '35px',
      fontSize: '16px',
      fontWeight:'bold'
    }
    let inputStyle={
      width: '100%',
      border: 0,
      outline: 'none'
    }
    return (
      <div className={that.props.BillTypeDataItem.allowance ? 'stdreimburse-box' : 'hide'}>
        <h3 style={titleStyle}>补助</h3>
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-4 details-h">
            <div className="details-h-t">日期</div>
              <div className="web-example-datepicker">
                <DatePicker2 value={that.state.startDate}
                             onChange={that.getTime.bind(this,'startDate')}
                             className="standard-name-input web-name-input"
                />-
                <DatePicker2  dateFormat='YYYY-MM-DD' value={that.state.endDate}
                             onChange={that.getTime.bind(this,'endDate')}
                             className="standard-name-input web-name-input"
                />
              </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4 details-h">
            <div className="details-h-t">日期(天)</div>
            <div className="standard-name-input">
              <input style={inputStyle} name="day" onChange={that.inputChange.bind(this)} type="text" value={that.state.day} />
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4 details-h">
            <div className="details-h-t">补助标准(元/天)</div>
            <div className="standard-name-input">
              <input style={inputStyle} name="money" onChange={that.inputChange.bind(this)} type="text" value={that.state.money} />
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4 details-h">
            <div className="details-h-t">补助金额</div>
            <div className="standard-name-input">
              <input style={inputStyle} name="total" readOnly="readOnly" type="text" value={Utils.formatCurrency(that.state.total)} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
