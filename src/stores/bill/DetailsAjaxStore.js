/**
 * author:zhangtongchuan
 * date: 2017-05-23
 * mail: zhangtch@yonyou.com
 */
import {observable,action,computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';
// Config.bill.queryDetailsData = "http://127.0.0.1:88/bill/bx"
// Config.bill.WFHISBYBUSINESSKEY = "http://127.0.0.1:88/bill/wfhisByBusinessKey";
// Config.bill.approve = 'http://127.0.0.1:88/bill/approve'
export default class DetailsAjaxStore{
  globalStore = GlobalStore;
  @observable DetailsTitle = {
    "bx":"报销单",
    "sq":"申请单",
    "jk":"借款单",
    "hk":"还款单"
  }
  @observable DetailsTableColumn = {
    travel:[//出行
      {type: 'string', id: 'travelWay', label: '交通工具'},
      {type: 'string', id: 'fromCity_toCity', label: '路线'},
      {type: 'string', id: 'date_', label: '日期'},
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
      {type: 'enum', id: 'category', label: '来源',data:[
        {key:"ctrip_aircraft",value:'携程机票'},
        {key:"ctrip_aircraft_c",value:'携程机票'},
        {key:"ctrip_train",value:'携程火车票'},
        {key:"ctrip_train_c",value:'携程火车票'},
        {key:"mt_train",value:'美团火车票'},
        {key:"mt_train_c",value:'美团火车票'},
        {key:"dd_person_pay",value:'滴滴'},
        {key:"dd_company_pay",value:'滴滴'},
        {key:"sq_company_pay",value:'首汽'},
        {key:"sq_person_pay",value:'首汽'},
      ]},
      {type: 'enum', id: 'category', label: '企业支付',data:[
        {key:"ctrip_aircraft",value:'N'},
        {key:"ctrip_aircraft_c",value:'Y'},
        {key:"ctrip_train",value:'N'},
        {key:"ctrip_train_c",value:'Y'},
        {key:"mt_train",value:'N'},
        {key:"mt_train_c",value:'Y'},
        {key:"dd_person_pay",value:'N'},
        {key:"dd_company_pay",value:'Y'},
        {key:"sq_company_pay",value:'Y'},
        {key:"sq_person_pay",value:'N'},
      ]},

        /**
        出行
        ctrip_aircraft 携程机票 个人
        ctrip_aircraft_c 携程机票 企业
        ctrip_train 携程火车票 个人
        ctrip_train_c 携程火车票 企业
        mt_train 美团火车票 个人
        mt_train_c 美团火车票 企业
        dd_person_pay 滴滴 个人
        dd_company_pay 滴滴 企业
        sq_company_pay 首汽 企业
        sq_person_pay 首汽 个人
        {"money":"金额",
        "fromCity":"出发地",
        "toCity":"目的地",
        "travelDate(date)":"(Date.getTime())出发日期",
        "travelWay":"交通工具",
        "expensetype":"(参照PK)费用类型",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"出行类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"travel"}*/
    ],
    hotel:[// 住宿
      {type: 'string', id: 'city', label: '地点'},
      {type: 'string', id: 'hotel', label: '酒店名称'},
      {type: 'string', id: 'startDate_endDate', label: '住宿日期'},
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
      {type: 'enum', id: 'category', label: '来源',data:[
        {key:"ctrip_inn",value:'携程酒店'},
        {key:"ctrip_inn_c",value:'携程酒店'}
      ]},
      {type: 'enum', id: 'category', label: '企业支付',data:[
        {key:"ctrip_inn",value:'N'},
        {key:"ctrip_inn_c",value:'Y'}
      ]},
        /**
        住宿
        ctrip_inn 携程酒店 个人
        ctrip_inn_c 携程酒店 企业

        企业支付没有
        来源没有
        {"money":"金额",
        "city":"城市",
        ""startDate":"Date.getTime()入住时间",
        "endDate":"Date.getTime()离店时间",
        "hotel":"入住酒店",
        "taxrate":"(增值税发票)税率",
        "includtax":"(增值税发票)税额",
        "nottax":"(增值税发票)无税金额",
        "invoicenum":"(增值税发票)发票号",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"住宿类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"hotel"}*/
    ],
    eating:[//餐饮
      // {type: 'string', id: 'city', label: '地点'},
      {type: 'string', id: 'company', label: '餐饮公司'},
      {type: 'string', id: 'personNum', label: '人数'},
      {type: 'string', id: 'date_', label: '日期'},
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
      {type: 'enum', id: 'category', label: '来源',data:[
        {key:"red_fire",value:'红火台'},
        {key:"red_fire_c",value:'红火台'},
      ]},
      {type: 'enum', id: 'category', label: '企业支付',data:[
        {key:"red_fire",value:'N'},
        {key:"red_fire_c",value:'Y'},
      ]},

        /**
        餐饮
        red_fire 红火台 个人
        red_fire_c 红火台 企业
        {"money":"金额",
        "company":"(去吃的什么,比如杨国福,全聚德)餐饮公司",
        "personNum":"用餐人数",
        "eatingDate(date)":"(Date.getTime())用餐时间",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"餐饮类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"eating"}*/
    ],
    buy:[//收款 暂定没有
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
        /**{"money":"金额",
        "buyDate(date)":"(Date.getTime())收款日期",
        "buyee":"付款单位",
        "buyWay":"收款方式",
        "item":"(参照PK)项目",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"收款类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"buy"}*/
    ],
    pay:[//付款 暂定没有
      {type: 'sting', id: 'payee', label: '收款单位'},
      {type: 'sting', id: 'payWay', label: '付款方式'},
      {type: 'sting', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'sting', id: 'payDate_', label: '付款日期'},
      {type: 'string', id: 'tagContent', label: '标签'},
        /**{"money":"金额",
        "payDate(date)":"(Date.getTime())付款日期",
        "payee":"收款单位",
        "payWay":"付款方式",
        "item":"(参照PK)项目",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"付款类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"pay"}*/
    ],
    gather:[//采购 暂定没有
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
        /**{"money":"金额",
        "materiel":"(采购实体)物料",
        "unitprice":"单价",
        "number":"数量",
        "unit":"(单位名称)单位",
        "taxrate":"税率",
        "tax":"税额",
        "gatherDate(date)":"(Date.getTime())采购日期",
        "invoiceNumber":"发票号",
        "payee":"收款人",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"采购类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"gather"}*/
    ],
    sale:[//销售 暂定没有
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
        /**{"money":"金额",
        "materiel":"(销售实体)物料",
        "unitprice":"单价",
        "number":"数量",
        "unit":"(单位名称)单位",
        "taxrate":"税率",
        "tax":"税额",
        "saleDate(date)":"(Date.getTime())销售日期",
        "invoiceNumber":"发票号",
        "(忽略此处错误单词)costomer":"客户",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"销售类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"sale"}*/
    ],
    communicate:[//通信
      {type: 'string', id: 'communicateType', label: '通信类型'},
      {type: 'string', id: 'phoneNumber', label: '电话号码'},
      {type: 'string', id: 'communicateDate_', label: '费用期间'},
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
      {type: 'enum', id: 'category', label: '来源',data:[
        {key:"einvoice",value:'电子发票'}
      ]},
      {type: 'enum', id: 'category', label: '企业支付',data:[
        {key:"einvoice",value:'N'}
      ]}
        /**
        通信
        einvoice 电子发票 个人   （目前只有通讯）
        {"money":"金额",
        "phoneNumber":"电话号码",
        "communicateType":"(移动电话,移动上网)通信类型",
        "communicateDate(date)":"(Date.getTime())通信日期",
        "communicateStart(date)":"(Date.getTime())通信区间起始",
        "communicateEnd(date)":"(Date.getTime())通信区间结束",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"通信类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"communicate"}*/
    ],
    other:[//其他
      {type: 'string', id: 'note', label: '说明'},
      {type: 'string', id: 'date_', label: '日期'},
      {type: 'double', id: 'money', label: '金额',formatter: { format: '0,0.00' }},
      {type: 'string', id: 'tagContent', label: '标签'},
        /**{"money":"金额",
        "otherDate(date)":"(Date.getTime())其他日期",
        "taxrate":"(增值税发票)税率",
        "includtax":"(增值税发票)税额",
        "nottax":"(增值税发票)无税金额",
        "invoicenum":"(增值税发票)发票号",
        "note":"描述",
        "tag(tagContent)":"友报账标签",
        "ts":"(Date.getTime())时间戳",
        "pk":"其他类记事pk",
        "isexpense":"是否已报账（此处应均为true）",
        "filepath":"（附件path或国信barcode）附件",
        "type":"other"}*/
    ],
    cShare:[//费用归属
      {type: 'string', id: 'assume_org_name', label: '费用归属组织'},
      {type: 'string', id: 'assume_dept_name', label: '费用归属部门'},
      {type: 'double', id: 'assume_amount', label: '分摊金额',formatter: { format: '0,0.00' }}
    ],
    subsidy:[//补助
      {type: 'string', id: 'subsidyDays', label: '补助天数'},
      {type: 'string', id: 'subsidyUnits', label: '补助标准'},
      {type: 'string', id: 'startDate_endDate', label: '补助时间'},
      {type: 'double', id: 'subsidyAmount', label: '补助金额',formatter: { format: '0,0.00' }},
    ]

  }
  @observable total={
    totalMoney:0,
    totalCountL:0
  }
  @observable bodyListData = []
  //费用归属
  @observable cShareListData = []
  //是否显示费用
  @observable isRendercShare = false;
  //补助
  @observable subsidyData = []
  //是否显示补助
  @observable isRenderSubsidy = false;
  @observable headerListData = []
  @observable attachments = []
  /**
  类型	交互方式	预留项	编号含义
  10	0	0	字符型
  11	0	0	整型
  12	0	0	浮点
  13	0	0	日期
  14	0	0	布尔型
  15	0	0	常规参照
  1	0	下拉参照
  2	0	银行参照（账号）
  3	0	银行参照（卡号）
  */
  getHeaderData(data){
    let that = this
    let headerListData = []

    if(data.information && data.information.length>0){
      data.information.forEach((item)=>{
        item.type = item.source_type.length>2 ? item.source_type.substr(1,1) : 0;
        item.name = item.source_name;
        item.value = item.type==5 ? item.source_value.split(',')[1] :
                     item.type == 2 ? that.formatCurrency(item.source_value) :
                     item.type == 4 ? item.source_value==true ? 'true' : 'false' :
                     item.source_value
        if(item.source_type=='1540'){
          item.value = item.source_value
        }
        headerListData.push(item)
      })
    }
    //现在要显示分摊(费用归属)和补助
    if(data.expenseCShareList && data.expenseCShareList.length>0){
      data.expenseCShareList.forEach((item)=>{
        item.type=0;
        item.name = '费用归属';
        item.value = item.assume_dept_name + '[￥'+that.formatCurrency(item.assume_amount)+']'
        headerListData.push(item)
      })
    }
    if(data.subsidy){
      let item = {}
      item.type=0;
      item.name = '补助';
      item.value = data.subsidy.subsidyDays+'天，每天￥'+that.formatCurrency(data.subsidy.subsidyUnits)//that.formatDate(data.subsidy.startDate)//'';//data.subsidy;
      headerListData.push(item)
    }
    return headerListData
  }

  getBodyList(data){
    let that = this;
    let expenseBodyList = []
    if(data.expenseBodyList && data.expenseBodyList.length>0){
      data.expenseBodyList.forEach((item,index)=>{
        if('infoType' in item && item.infoType=='travel'){
          if(item.infoList && item.infoList.length>0){
            item.infoList.forEach((zItem,zIndex)=>{
              zItem.fromCity_toCity = zItem.fromCity+'--'+zItem.toCity;
              zItem.date_ = (zItem.date ? that.formatDate(Number(zItem.date)) : '') + '--' + (zItem.endDate ? that.formatDate(Number(zItem.endDate)) : '')
            })
          }
        }else if('infoType' in item && item.infoType=='hotel'){
          if(item.infoList && item.infoList.length>0){
            item.infoList.forEach((zItem,zIndex)=>{
              zItem.startDate_endDate = (zItem.startDate ? that.formatDate(zItem.startDate) : '' )+'--'+(zItem.endDate ? that.formatDate(zItem.endDate) : '');
            })
          }
        }else if('infoType' in item && item.infoType=='eating'){
          if(item.infoList && item.infoList.length>0){
            item.infoList.forEach((zItem,zIndex)=>{
              zItem.date_ = zItem.date ? that.formatDate(zItem.date) : ''
            })
          }
        }else if('infoType' in item && item.infoType=='communicate'){
          if(item.infoList && item.infoList.length>0){
            item.infoList.forEach((zItem,zIndex)=>{
              zItem.communicateDate_ = (zItem.communicateStart ? that.formatDate(zItem.communicateStart,'ym') : '' )+'--'+(zItem.communicateEnd ? that.formatDate(zItem.communicateEnd,'ym') : '');

            })
          }
        }else if('infoType' in item && item.infoType=='other'){
          if(item.infoList && item.infoList.length>0){
            item.infoList.forEach((zItem,zIndex)=>{
              zItem.date_ = zItem.date ? that.formatDate(Number(zItem.date)) : ''
            })
          }
        }
        expenseBodyList.push(item)
      })
    }
    return expenseBodyList;
  }

  //获得费用归属的列表
  getCShareList(data){
    let that = this;
    let expenseCShareList = []
    if(data.expenseCShareList && data.expenseCShareList.length>0){
      that.isRendercShare = true;
      data.expenseCShareList.forEach((item,index)=>{
        expenseCShareList.push(item)
      })
    }
    return expenseCShareList;
  }

  //获得补助的列表
  getSubsidy(data){
    let that = this;
    let list = [];
    let subsidy = {};
    if(data.subsidy!=null){
      that.isRenderSubsidy = true;
      subsidy.subsidyDays = data.subsidy.subsidyDays+'天';
      subsidy.subsidyUnits = that.formatCurrency(data.subsidy.subsidyUnits)+'元/天';
      subsidy.startDate_endDate = that.formatDate(data.subsidy.startDate)+'--'+that.formatDate(data.subsidy.endDate);
      subsidy.subsidyAmount = that.formatCurrency(data.subsidy.subsidyDays*data.subsidy.subsidyUnits);

      list.push(subsidy);
    }

    return list;
  }


  formatDate(ts,type){
    Date.prototype.toForm = function() {
      return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();// + " " + this.getHours() + ":" + this.getMinutes();// + "分" + this.getSeconds() + "秒";
    };
    Date.prototype.toFormym = function() {
      return this.getFullYear() + "年" + (this.getMonth() + 1) + "月";// + " " + this.getHours() + ":" + this.getMinutes();// + "分" + this.getSeconds() + "秒";
    };
    if(type=='ym'){
      return new Date(ts).toFormym()
    }
    // console.log(typeof ts);
    return new Date(ts).toForm()
  }
  formatCurrency(num) {
    if(!num){
      return "0";
    }
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
    num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    let cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}
@observable approveData = {}
  /**
  * 查询数据
  * @param {Object} data 参数 {pk：'',type:''}
  * @return {"code":"0","information":{"djlxpk":"etSCMHPwcTsSpoX41ffUZ","expenseCShareList":[{"assume_pk_dept":"1001B1100000000001PC","assume_org_name":"用友网络科技股份有限公司","assume_dept_name":"人力资源部","assume_pk_org":"0001B11000000000C3E0","cshare_pk":"s3SCqPYYVmm3ytBLBUYw0","expense_pk":"o8SCLKPO0SLGdrn3h0Bdm","assume_amount":1288}],"costShared":false,"requisition":null,"subsidy":{"startDate": 1495555200000,"subsidy_pk": "6CSCh4LwQUXKKtQdmGIsg","subsidyDays": 0.5,"expense_pk": "ccSC8LIuPOOO5pMu9euF5","subsidyUnits": 60,"endDate": 1495555200000},"allowance":false,"otherInformation":{"djlxpk":"etSCMHPwcTsSpoX41ffUZ","billStatus":"4","billitem":"差旅报账","dest_billtype":"2641","Djdl":"bx"},"expenseDate":1492358400000,"requisitionKey":null,"expensePk":"o8SCLKPO0SLGdrn3h0Bdm","billPk":"0001C110000000019RQC","billStatus":4,"zdyhead":"1001B110000000000N12,集团财务项目","billtypeName":"差旅报账","information":[{"source_edit":true,"source_input":true,"dest_property_name":"人员","source_type":"1520","source_code":"bankAccount","source_name":"户名","source_value":"1001B110000000000G7B,马振全"},{"source_edit":true,"source_input":true,"dest_property_name":"个人银行账户","source_type":"1530","source_code":"bankAccountKey","source_name":"银行账户","source_value":"1001B110000000001AMV,3333233343434344"},{"source_edit":true,"source_input":true,"dest_property_name":"单据日期","source_type":"1300","source_code":"dealdate","source_name":"单据日期","source_value":"2017-04-17"},{"source_edit":true,"source_input":true,"dest_property_name":"事由","source_type":"1000","source_code":"descript","source_name":"描述","source_value":"e"},{"source_edit":true,"source_input":true,"dest_property_name":"金额","source_type":"1200","source_code":"money","source_name":"金额","source_value":"1288.0"},{"source_edit":true,"source_input":true,"dest_property_name":"收支项目","source_type":"1500","source_code":"szitemKey","source_name":"收支项目","source_value":"1001B110000000001L0P,付货款"},{"source_edit":true,"source_input":true,"dest_property_name":"项目","source_type":"1500","source_code":"zdyhead","source_name":"项目","source_value":"1001B110000000000N12,集团财务项目"}],"expenseBodyList":[{"infoType":"hotel","infoTypeCN":"住宿","totalMoney":1234,"infoList":[{"tagContent":"e","note":"","isexpense":true,"filepath":null,"money":1201,"city":"北京市","endDate":1480608000000,"invoiceNumber":"","hotel":"十二月","pk":"URSCGE1LuEeqLHtt7Ckbu","type":"hotel","startDate":1480521600000},{"tagContent":"","note":"","isexpense":true,"filepath":null,"money":33,"city":"北京市","endDate":1479139200000,"invoiceNumber":"","hotel":"德","pk":"8OSCisj7rGSmpwkCleeb2","type":"hotel","startDate":1479052800000}],"totalCount":2},{"infoType":"other","infoTypeCN":"其他","totalMoney":54,"infoList":[{"date":1490544000000,"tagContent":"","note":null,"isexpense":true,"filepath":null,"money":54,"invoiceNumber":"","pk":"ogSCztIGZMQT5CM8FwzzQ","type":"other"}],"totalCount":1},{"infoType":"eating","infoTypeCN":"餐饮","totalMoney":54,"infoList":[{"date":1490544000000,"money":54,"company":"餐饮公司","personNum":"5","toCity":"上海","eatingDate":1490544000000,"tag":"标签","category":"ctrip_aircraft"}],"totalCount":1},{"infoType":"communicate","infoTypeCN":"通信","totalMoney":54,"infoList":[{"date":1490544000000,"money":54,"communicateType":"移动电话","phoneNumber":"13555555555","toCity":"上海","communicateDate":1490544000000,"tag":"标签","category":"ctrip_aircraft"}],"totalCount":1},
		{"infoType":"travel","infoTypeCN":"出行","totalMoney":54,"infoList":[{"date":1490544000000,"money":54,"travelWay":"交通工具","fromCity":"北京","toCity":"上海","travelDate":"1479052800000","tag":"标签","category":"ctrip_aircraft"}],"totalCount":1}],"billtypeCode":"2641","totalMoney":"1888","totalCount":"32"}}
  */
  @action queryBillDetailsData(data){
    var that =this;
    that.globalStore.showWait();
    $.ajax({
        type: "POST",
        url: Config.bill.queryDetailsData,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        // contentType: "application/x-www-form-urlencoded",
        success: data => {
          that.globalStore.hideWait();
          if (data.code==0) {
            that.approveData = Object.assign([],data.information.approve)
            that.headerListData = Object.assign([],that.getHeaderData(data.information))
            that.bodyListData = Object.assign([],that.getBodyList(data.information))
            that.cShareListData = Object.assign([], that.getCShareList((data.information)))
            that.subsidyData = Object.assign([], that.getSubsidy((data.information)))
            that.attachments = Object.assign([],data.information.attachments)
            that.total = Object.assign({},{
              totalMoney:that.formatCurrency(data.information.totalMoney),
              totalCount:data.information.totalCount
            })
          }else{
              that.globalStore.showError(data.message?data.message:"查询失败")
          }
        },
        error: (xhr, status, err) => {
            that.globalStore.hideWait();
            this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
        }
      })
  }

  @observable historyEventListColumns = [
      { type: 'string', id: 'taskname', label: '流程活动名称' ,align: 'left'},
      { type: 'string', id: 'starttime', label: '发送时间' ,formatter: { format:"YYYY-MM-DD"} ,align: 'left'},
      { type: 'string', id: 'procstarttime', label: '发送时间' ,hidden:true  ,align: 'left' },
      { type: 'string', id: 'endtime', label: '完成时间' ,formatter: { format:"YYYY-MM-DD"} ,align: 'left'},
      { type: 'string', id: 'finished', label: '完成状态'   ,align: 'left'},
      { type: 'string', id: 'operator', label: '操作人'   ,align: 'left'},
      { type: 'string', id: 'comments', label: '批语'   ,align: 'left'},
      { type: 'string', id: 'activitykey', label: 'activitykey' ,hidden:true  ,align: 'left'},
      { type: 'string', id: 'taskid', label: 'taskid' ,hidden:true  ,align: 'left'},
  ]
  @observable historyEventListData=[]

  @action historyEventList(data){
    var that =this;
    that.globalStore.showWait();
    $.ajax({
        type: "POST",
        url: Config.bill.WFHISBYBUSINESSKEY,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: data => {
          that.globalStore.hideWait();
          if( data.code == 0 ){
              that.historyEventListData = Object.assign([],data.data.map((item)=>{
                if(item.finished==true){
                  item.finished = "已完成";
                }else if(item.finished == false ){
                  item.finished = "未完成";
                }
                that.historyEventListColumns.forEach((cItem)=>{
                  if(!item[cItem.id]){
                    item[cItem.id]=""
                  }
                })
                return item;
              }))
          }else{
              that.globalStore.showError(data.message?data.message:"查询失败")
          }
        },
        error: (xhr, status, err) => {
            that.globalStore.hideWait();
            this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
        }
      })
  }

  @action sendApprove(data){
    var that =this;
    that.globalStore.showWait();
    $.ajax({
      type: "POST",
      url: Config.bill.approve,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: data => {
        that.globalStore.hideWait();
        if( data.code == 0 ){
          this.globalStore.showModel('操作成功！')
        }else{
            that.globalStore.showError(json.message?json.message:"批准失败")
        }
      },
      error: (xhr, status, err) => {
          that.globalStore.hideWait();
          this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      }
    })
  }

}
