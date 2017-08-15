/**
 * 其它记事
 * Created by Administrator on 2017/6/22.
 */
import React from 'react';
import {observer} from 'mobx-react';
import {DatePicker2} from 'ssc-grid';

import  Upload  from '../../components/webreimburse/Upload';
import  NavTab  from '../../components/webreimburse/NavTab';
import  Footer  from '../../components/webreimburse/Footer';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';
import Utils from '../../common/utils'

const webStore = new WebreImburseStore();

@observer
class Other extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pk: "",      // 修改比新增多传一个主键
      money: "",     //金额
      taxrate: "",  // 税率
      invoicetypeCode: [{name: "增值普票", id: "0"}, {name: "增值专票", id: "1"}], //发票类型
      invoicenum: "",   // 发票号
      otherDate: "",    // 记事日期
      note: "", // 备注
      invoicetype: "", // 发票类型id
      errorTip: {
        money: ""
      },
      imageSystemType: "oss"
    }
  }

  // 获取金额
  getMoney(e) {
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
  getTime(value, formattedValue) {
    this.setState({
      otherDate: formattedValue
    });
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
        invoicetype: flag
      });
    } else {
      //增值专票
      that.setState({
        invoicetype: flag
      });
    }
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
    }
  }

  // 税率 失去焦点事件
  inputOnBlur(e) {
    this.setState({taxrate: Utils.formatCurrency(e.target.value)});
    webStore.taxrate = Utils.formatCurrency(e.target.value);
  }

  // 保存
  submitClick = ()=> {
    let state = this.state;

    let tips = webStore.validateTips;
    let errorList = [];
    errorList.push(webStore.setErrorMessage(state.money, tips.moeny, state.errorTip.money));
    errorList.push(webStore.setErrorMessage(state.otherDate, tips.timeValue));

    // 增值专票的税率必填
    if (state.invoicetype == 1 && state.taxrate == "") {
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
      invoicetype: state.invoicetype,
      note: state.note,
      otherDate: state.otherDate,
      imageSystemType: state.imageSystemType
    }

    webStore.saveOtherNode(param, (data)=> {
      data.result.other.type = "other";
      globalStore.setCache("cacheData", [data.result.other]);
      this.refs.fileUploadRef.continueUpload();
      this.props.router.replace('/billedit/' + this.props.params.pk);
    });

  }

  render() {
    return (
        <div className="content">
          <div className="container-fluid">
            <NavTab  pk={this.props.params.pk} tab="other"/>
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
                              value={this.state.otherDate}
                              onChange={this.getTime.bind(this)}
                              className="standard-name-input"
                          />
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
                          {this.state.invoicetypeCode.map((value, index)=> {
                            return (
                                <div className="checkbox mr20 standard-checkbox" key={"invoiceType"+index}>
                                  <label>
                                    <input type="radio" name="invoiceType"
                                           className="web-radio"
                                           value={value.id}
                                           onClick={this.radioState.bind(this)}
                                    />
                                    {value.name}
                                  </label>
                                </div>
                            )
                          })}
                        </div>
                      </form>
                      <div className={this.state.invoicetype=="1"?"alue-added":"hidden"}>
                        <div className="row mt20">
                          <div className="col-md-6">
                            <p className="web-p">税率（%）</p>
                            <input className="standard-name-input" type="text"
                                   value={this.state.taxrate}
                                   onChange={this.handleChange.bind(this,0)}
                                   onBlur={ ::this.inputOnBlur }
                                   ref={(c) => this._input = c}
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
                                   value={webStore.reduceTax.toFixed(2)}/>
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
              <Upload uploadOptions={webStore.uploadOptions} ref="fileUploadRef"/>
            </div>
          </div>
          <Footer submitClick={this.submitClick} pk={this.props.params.pk} router={this.props.router}/>
        </div>
    );
  }
}

export default Other;