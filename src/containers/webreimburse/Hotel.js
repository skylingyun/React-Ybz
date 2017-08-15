/*
 * 住宿记事
 */
import React from 'react';
import {observer} from 'mobx-react';
import {DatePicker2} from 'ssc-grid';
import {Refers} from 'ssc-refer';

import  Upload  from '../../components/webreimburse/Upload';
import  NavTab  from '../../components/webreimburse/NavTab';
import  Footer  from '../../components/webreimburse/Footer';
import Config from '../../config';
import Utils from '../../common/utils'
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';

const webStore = new WebreImburseStore();

@observer
class Hotel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      money: "",     //金额
      taxrate: 0.00,  // 税率
      invoiceType: [{name: "增值发票", id: "0"}, {name: "增值专票", id: "1"}],
      errorTip: {
        money: ""
      },
      imageSystemType: "oss",
      demo1: "0", // 发票类型
      invoicenum: "", // 发票号
      hotel: "", // 酒店名称
      city: "", // 城市
      startDate: "", // 入住时间
      endDate: "",  // 离店时间
      note: "",  // 备注
      refcity: [],  //选中的城市
      checked: false
    }
  }

  // 获取金额
  getMoney = (e) => {
    this.setState({money: e.target.value});
    webStore.money = e.target.value;
  }

  // 金额 失去焦点自动补全数据
  blurMoney = ()=> {
    let money = this.state.money;
    if(!money||money==""||this.state.errorTip.money){return};
    this.setState({
      money:Utils.formatCurrency( money)
    })
  }

  // 金额校验
  validateMoney = (e)=> {
    let val = $(e.currentTarget).val();
    this.setState({
      errorTip: {
        money: webStore.validateMoney(val)
      }
    });
  }

  // 获取日期
  getTime = (index, value, formattedValue)=> {
    if (index == 0) {
      this.setState({
        startDate: formattedValue
      });
    } else {
      this.setState({
        endDate: formattedValue
      });
    }
  }

  // 单选框
  radioState = (e)=> {
    e.stopPropagation();
    let that = this;
    let flag = $(e.currentTarget).val();
    if (flag == 0) {
      // 增值普票
      that.setState({
        taxrate: "0.00",
        demo1: flag
      });
    } else {
      //增值专票
      that.setState({
        demo1: flag
      });
    }
  }

  // 税率 失去焦点事件
  inputOnBlur(e) {
    this.setState({taxrate: Utils.formatCurrency(e.target.value)});
    webStore.taxrate = Utils.formatCurrency(e.target.value);
  }

  // 输入发票号 增值税
  handleChange(index, e) {
    e.preventDefault();

    switch (index) {
      case 0:
        this.setState({taxrate: e.target.value});
        webStore.taxrate = Utils.formatCurrency(e.target.value);
        break;
      case 1:
        this.setState({
          invoicenum: e.target.value
        });
        break;
      case 2:
        this.setState({
          note: e.target.value
        });
        break;
      case 3:
        this.setState({
          hotel: e.target.value
        });
        break;
    }
  }


  // 城市参照选中
  referHandleChange(selected) {
    this.setState({
      refcity: selected
    });
  }

  // 保存
  submitClick = ()=> {
    let state = this.state;

    let tips = webStore.validateTips;
    let errorList = [];
    errorList.push(webStore.setErrorMessage(state.money, tips.moeny, state.errorTip.money));
    errorList.push(webStore.setErrorMessage(state.startDate, tips.startDate));
    errorList.push(webStore.setErrorMessage(state.endDate, tips.endDate));
    // 城市
    if (state.refcity.length < 1) {
      errorList.push(webStore.setErrorMessage(state.city, tips.city));
    }
    errorList.push(webStore.setErrorMessage(state.hotel, tips.hotel));

    //比较时间
    let timeResult = webStore.compareTime(state.startDate, state.endDate);
    errorList.push(webStore.setErrorMessage("", timeResult, timeResult));

    // 增值专票的税率必填
    if (state.demo1 == 1 && state.taxrate == "") {
      errorList.push(webStore.setErrorMessage(state.taxrate, tips.taxrate));
    }

    errorList = webStore.grepArray(errorList);
    if (errorList && errorList.length > 0) {
      let errorTips = (<div>
        {errorList.map((value, index)=> {
          return (<p key={"errorMessage"+index}>{value}</p>);
        })} </div>);

      globalStore.showModel(errorTips);
      return;
    }

    let param = {
      money: state.money,
      taxrate: state.taxrate,
      invoicenum: state.invoicenum,
      demo1: state.demo1,
      note: state.note,
      startDate: state.startDate,
      endDate: state.endDate,
      hotel: state.hotel,
      city: state.refcity[0].name,
      imageSystemType: state.imageSystemType
    }

    webStore.saveHotelNode(param, (data)=> {
      data.result.hotel.type = "hotel";
      globalStore.setCache("cacheData", [data.result.hotel]);
      this.refs.fileUploadRef.continueUpload();
      this.props.router.replace('/billedit/' + this.props.params.pk);
    });

  }

  render() {

    // 参照支持 name ename 匹配
    const filterByFields = ['ename', 'name'];

    return (
        <div className="content">
          <div className="container-fluid">
            <NavTab  pk={this.props.params.pk} tab="hotel"/>
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
                                 value={this.state.money}
                                 onChange={this.getMoney.bind(this)}
                                 onBlur={this.blurMoney.bind(this)}
                                 onKeyUp={this.validateMoney.bind(this)}
                          />
                          <span className="error">{this.state.errorTip.money}</span>
                        </div>
                        <div className="col-md-6">
                          <p className="web-p">日期</p>
                          <DatePicker2
                              dateFormat="YYYY-MM-DD"
                              value={this.state.startDate}
                              onChange={this.getTime.bind(this,0)}
                              className="standard-name-input  web-name-input"
                          />
                          <span style={{"margin":"0 10px"}}>至</span>
                          <DatePicker2
                              dateFormat="YYYY-MM-DD"
                              value={this.state.endDate}
                              onChange={this.getTime.bind(this,1)}
                              className="standard-name-input  web-name-input"
                          />
                        </div>
                      </div>
                      <div className="row" style={{"marginTop":"20px"}}>
                        <div className="col-md-6">
                          <p className="web-p">入住城市</p>
                          <Refers
                              key={Math.random()}
                              labelKey="name"
                              emptyLabel='暂无数据'
                              onChange={this.referHandleChange.bind(this)}
                              placeholder="请选择..."
                              referConditions={{"refCode":"cityarchive","refType":"table","fields":["code","name","ename"]}}
                              referDataUrl={Config.webreimburse.webReferUrl}
                              referType="list"
                              ref={ref => this._myrefers = ref}
                              multiple={false}
                              filterBy={filterByFields}
                              selected={this.state.refcity}
                          />
                        </div>
                        <div className="col-md-6">
                          <p className="web-p">入住酒店</p>
                          <input className="standard-name-input" type="text"
                                 value={this.state.hotel}
                                 onChange={this.handleChange.bind(this,3)}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stdreimburse-box">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="standard-content">发票类型</span>
                      <form className="horizontal">
                        <div className="form-group standard-formgroup">
                          {this.state.invoiceType.map((value, index)=> {
                            return (
                                <div className="checkbox mr20 standard-checkbox" key={"invoiceType"+index}>
                                  <label>
                                    <input type="radio" name="invoiceType"
                                           className="web-radio"
                                           value={value.id}
                                           onClick={this.radioState}
                                    />
                                    {value.name}
                                  </label>
                                </div>
                            )
                          })}
                        </div>
                      </form>
                      <div className={this.state.demo1=="1"?"alue-added":"hidden"}>
                        <div className="row mt20">
                          <div className="col-md-6">
                            <p className="web-p">税率（%）</p>
                            <input className="standard-name-input" type="text"
                                   value={this.state.taxrate}
                                   onChange={this.handleChange.bind(this,0)}
                                   onBlur={ ::this.inputOnBlur }
                            />
                          </div>
                          <div className="col-md-6">
                            <p className="web-p">请输入发票号</p>
                            <input className="standard-name-input" type="text"
                                   value={this.state.invoicenum}
                                   onChange={this.handleChange.bind(this,1)}
                            />
                          </div>
                        </div>
                        <div className="row mt20">
                          <div className="col-md-6">
                            <p className="web-p">增值税</p>
                            <input className="standard-name-input" type="text"
                                   value={webStore.addedTax.toFixed(2)}
                            />
                          </div>
                          <div className="col-md-6">
                            <p className="web-p">未含税金额</p>
                            <input className="standard-name-input" type="text"
                                   value={webStore.reduceTax.toFixed(2)}
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
                      <span className="standard-content">备注</span>
                      <div className="row">
                        <div className="col-md-12">
                          <input className="standard-name-input web-remarks" type="text"
                                 value={this.state.note}
                                 onChange={this.handleChange.bind(this,2)}
                                 placeholder="请输入您的备注"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Upload  uploadOptions={webStore.uploadOptions}   ref="fileUploadRef"/>
            </div>
          </div>

          <Footer submitClick={this.submitClick} pk={this.props.params.pk} router={this.props.router}/>
        </div>
    )
  }
}
export default Hotel;
