/**
 * Created by Administrator on 2017/6/22.
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

import {DatePicker2} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';
import {Refers} from 'ssc-refer';
import  Upload  from '../../components/webreimburse/Upload';
import  NavTab  from '../../components/webreimburse/NavTab';
import  Footer  from '../../components/webreimburse/Footer';
import  Util from '../../common/utils';
const webStore = new WebreImburseStore();
@observer
class Traffic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      money: "",
      trafficTools: [{name: "出租车", id: "",seat:""}, {name: "公交车", id: "",seat:""}, {name: "火车", id: "train",seat:"火车坐席"},
        {name: "飞机", id: "plane",seat:"舱位"}, {name: "长途巴士", id: "",seat:""}, {name: "轮船", id: "steamer",seat:"轮船坐席"},
        {name: "商务车", id: "",seat:""}, {name: "地铁城铁", id: "",seat:""}, {name: "其他", id: "",seat:""}],
      trafficToolsSeat:[{"seatPk":"","seat":""}],
      trafficToolsSeatName:"",
      costType: [],
      startDate: "",
      endDate: "",
      trafficToolsValue: "",
      costTypeValue: "",
      address: [{start: ""}, {end: ""}],
      note: "",
      itemPk: "",
      itemName: "",
      szitemPk: "",
      szitemName: "",
      seat:"",
      seatPk:"",
      errorTip: {
        money: ""
      }
    }
  }

  componentWillMount() {
    webStore.getNodeRefs((data)=> {
      if (!data || data.length < 1) {
        return;
      }
      this.setNodeRefs(data.information);
    })
  }

  setNodeRefs = (data)=> {
    data.map((value, index) => {
      if (value.type == "travel") {
        this.setState({
          itemPk: value.pk,
          itemName: value.item
        }, ()=> {
          if(value.reftypename =="feedefitem"){ //TODO 目前只执行一次。
              this.setRefs(value.reftypename);
          }
        })

      }
    })
  }

  setRefs = (param)=> {
    let cost = this.state.costType ;
    webStore.queryRefItem({"refCode": param, "filterCondition": {"query": "", "pk_org": "", "context": ""}}, (data)=> {
      if (!data) {
        return false
      };
      // cost = cost.push(data);
      this.setState({
        costType: data
      })
    })
  }

  getMoney = (e)=> {
    this.setState({
      money: $(e.currentTarget).val()
    })
  }
  validateMoney = (e)=> {
    let val = $(e.currentTarget).val();
    this.setState({
      errorTip: {
        money: webStore.validateMoney(val)
      }
    })

  }
    //失去焦点自动补全数据
  blurMoney = ()=>{
    let money = this.state.money;
    if(!money||money==""||this.state.errorTip.money){return};
    this.setState({
        money:Util.formatCurrency( money)
    })
   }

  getTime = (index, value, formattedValue)=> {
    if (index == 0) {
      this.setState({
        startDate: formattedValue
      })
    } else {
      this.setState({
        endDate: formattedValue
      })
    }
  }
  getTrafficTools = (id,name ,seat )=> {

    this.setState({
      trafficToolsValue: name,
      seat:"",  //初始化
      seatPk:"",
      trafficToolsSeatName:seat
    })

    //飞机火车单独处理
    if(id == "train" || id == "plane" || id=="steamer"){
      this.getTrafficToolsSeat(id);
    }else{
      $("#trafficToolsSeatShow").slideUp("slow");
    }
  }

  //飞机火车取座次  {"seatType":"train/plane/steamer"}
  getTrafficToolsSeat = ( id ) => {
    webStore.getSeat({"seatType":id},(data)=>{
        this.setState({
          trafficToolsSeat:data.information
        })
        $("#trafficToolsSeatShow").slideDown("slow");
    })
  }
  getTrafficToolsSeatEvent =(seat , seatPk )=>{
      this.setState({
        seat:seat,
        seatPk:seatPk
      })
  }

  getCostType = (e)=> {
    this.setState({
      szitemPk: $(e.currentTarget).attr("id"),
      szitemName: $(e.currentTarget).val()
    })
  }
  getNote = (e)=> {
    this.setState({
      note: $(e.currentTarget).val()
    })
  }
  /**
   * param 0 起点  1 终点
   * @param param
   */
  getAddress = (param, e)=> {
    e.stopPropagation();
    let value = $(e.currentTarget).val();
    let start = this.state.address.start, end = this.state.address.end;
    if (param == 0) {
      start = value;
    } else {
      end = value;
    }
    this.setState({
      address: {
        start: start,
        end: end
      }
    })
  }

  changeAddress = (e) => {
    e.stopPropagation();
    let start = this.state.address.start;
    let end = this.state.address.end;
    this.setState({
      address: {
        start: end,
        end: start
      }
    })
  }

  submitClick = ()=> {
    let state = this.state , tips =  webStore.validateTips ;
    state.money = Util.unmakeFormatCurrecy(state.money);
    let errorList = [];
    errorList.push(webStore.setErrorMessage(state.money, tips.moeny,state.errorTip.money));
    errorList.push(webStore.setErrorMessage(state.startDate, tips.startDate));
    errorList.push(webStore.setErrorMessage(state.endDate, tips.endDate));
    errorList.push(webStore.setErrorMessage(state.trafficToolsValue, tips.trafficToolsValue));
    errorList.push(webStore.setErrorMessage(state.address.start, tips.address.start));
    errorList.push(webStore.setErrorMessage( state.address.end, tips.address.end));

    //比较时间
    let timeResult = webStore.compareTime(state.startDate , state.endDate);
    errorList.push(webStore.setErrorMessage("",timeResult,timeResult));

    errorList = webStore.grepArray(errorList);
    if (errorList && errorList.length > 0) {
      let errorTips = (<div>
        {errorList.map((value, index)=> {
          return (<p key={"errorMessage"+index}>{value}</p>);
        })} </div>)

      globalStore.showModel(errorTips)
      return;
    }

    let param = {
      money: state.money,
      fromCity: state.address.start,
      toCity: state.address.end,
      travelDate: state.startDate,
      travelWay: state.trafficToolsValue,
      note: state.note,
      expensetype: state.szitemPk,
      tags: null,
      imageSystemType: "oss",
      startDate: state.startDate,
      endDate: state.endDate,
      itemPk: state.itemPk,
      itemName: state.itemName,
      szitemPk: state.szitemPk,
      szitemName: state.szitemName,
      seat:state.seat,
      seatPk:state.seatPk
    }


    webStore.saveTravelNode(param, (data)=> {
      data.result.travel.type ="travel";
      globalStore.setCache("cacheData", [data.result.travel]) ;
      this.refs.fileUploadRef.continueUpload();
      this.props.router.replace('/billedit/' + this.props.params.pk);
    })
  }

  render() {
    return (
        <div className="content">
          <div className="container-fluid">
            <NavTab pk={this.props.params.pk} tab="travel"/>
            <div className="row">
              <div className="col-md-8">
                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">基本信息</span>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="web-p">金额</p>
                          <input className="standard-name-input" type="text" placeholder="0.00"
                                 value={this.state.money} onChange={this.getMoney} onKeyUp={this.validateMoney} onBlur={this.blurMoney}/>
                          <span className="error">{this.state.errorTip.money}</span>
                        </div>
                        <div className="col-md-6">
                          <p className="web-p">日期</p>
                          <div className="web-example-datepicker">
                            <DatePicker2 value={this.state.startDate}
                                         onChange={this.getTime.bind(this,0)}
                                         className="standard-name-input web-name-input"
                            />
                            <span style={{"margin":"0 10px"}}>至</span>
                            <DatePicker2 dateFormat='YYYY-MM-DD' value={this.state.endDate}
                                         onChange={this.getTime.bind(this,1)}
                                         className="standard-name-input web-name-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">交通工具</span>
                      <form className="horizontal">
                        <div className="form-group standard-formgroup">
                          {this.state.trafficTools.map((value, index) => {
                            return (
                                <div className="checkbox mr20 standard-checkbox"
                                     key={"trafficTools"+index}>
                                  <label>
                                    <input className="web-radio" type="radio" name="trafficTools" value={value.name}
                                           onClick={this.getTrafficTools.bind(this , value.id , value.name , value.seat)}/>
                                    {value.name}
                                  </label>
                                </div>
                            )
                          })}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="stdreimburse-box" style={{"display":"none"}} id="trafficToolsSeatShow">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">请选择{this.state.trafficToolsSeatName}</span>
                      <form className="horizontal">
                          {this.state.trafficToolsSeat.map((v , i )=>{
                            return (
                                <div className="checkbox mr20 standard-checkbox"  key={"trafficToolsSeat"+i}>
                                  <label>
                                    <input className="web-radio" type="radio" name="trafficToolsSeat" value={v.seatPk}
                                           onClick={this.getTrafficToolsSeatEvent.bind(this, v.seat ,v.seatPk ) }/>
                                    {v.seat}
                                  </label>
                                </div>
                            )
                          })}
                      </form>
                    </div>
                  </div>
                </div>

                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">起始地点</span>
                      <div className="row">
                        <div className="col-md-4">
                          <span className="start-note"></span>
                          <input className="standard-name-input" type="text"
                                 value={this.state.address.start} placeholder="请输入您的起始位置"
                                 onChange={this.getAddress.bind(this,0)}/>
                        </div>
                        <div className="col-md-1 travel-check" onClick={this.changeAddress}></div>
                        <div className="col-md-4">
                          <span className="end-note"></span>
                          <input className="standard-name-input" type="text"
                                 value={this.state.address.end} placeholder="请输入您的终点位置"
                                 onChange={this.getAddress.bind(this,1)}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">费用类型</span>
                      <form className="horizontal">
                        {this.state.costType.map((value, index)=> {
                          return (
                              <div className="checkbox mr20 standard-checkbox" key={"costType"+index}>
                                <label>
                                  <input className="web-radio" type="radio" name="costType" value={value.code}
                                         id={value.id} onClick={this.getCostType}/>
                                  {value.name}
                                </label>
                              </div>
                          )
                        })}
                      </form>
                    </div>
                  </div>
                </div>

                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">备注</span>
                      <div className="row">
                        <div className="col-md-12">
                          <input className="standard-name-input web-remarks" type="text"
                                 value={this.state.note} onChange={this.getNote}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Upload ref="fileUploadRef" uploadOptions={webStore.uploadOptions} />
            </div>
          </div>

          <Footer submitClick={this.submitClick} pk={this.props.params.pk} router={this.props.router}/>

        </div>
    )
  }

}
export default Traffic ;