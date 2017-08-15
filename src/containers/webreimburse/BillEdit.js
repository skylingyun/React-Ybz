/**
http://git.yonyou.com/sscplatform/fc_doc/blob/master/expense-web-reimburse.md
*/
import React from 'react';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore from '../../stores/webreimburse/WebreImburseStore';
import {Grid} from 'ssc-grid';
import {Refers} from 'ssc-refer';
import Config from '../../config'
import {DatePicker} from 'ssc-grid';
import {Modal,Button} from 'react-bootstrap';
import Utils from '../../common/utils'
import BillEditBase  from '../../components/webreimburse/BillEditBase'
import BillEditTotal  from '../../components/webreimburse/BillEditTotal'
import BillEditShare  from '../../components/webreimburse/BillEditShare'
import BillEditSubsidies  from '../../components/webreimburse/BillEditSubsidies'
import BillEditTable  from '../../components/webreimburse/BillEditTable'
import BillEditImport  from '../../components/webreimburse/BillEditImport'
const store = new WebreImburseStore();
// const store = WebreImburseStore
@observer
export default class BillEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      bodyListData:[
        {
          id: '0',
          type:'travel',
          name: '交通',
          data:[]
        },{
          id: '1',
          type:'hotel',
          name: '住宿',
          data:[]
        },{
          id: '2',
          type:'eating',
          name: '餐饮',
          data:[]
        },{
          id: '6',
          type:'communicate',
          name: '通信',
          data:[]
        },{
          id: '7',
          type:'other',
          name: '其他',
          data:[]
        },
      ],
      headListData: {},
      tabPage : 1,
      pk: this.props.params.pk,
      isVisible: false,
      subsidiesData: {},
      shareData:[
        {
          dw: {
            name:'单位',
            code: '业务单元',
            data: []
          },
          bm: {
            name:'部门',
            code: '部门',
            data: []
          },
          money: {
            name: '金额',
            data: 0
          }
        }
      ]
    }
    this.setStateData = this.setStateData.bind(this);
    this.webItemAdd = this.webItemAdd.bind(this);
    this.setPage = this.setPage.bind(this);
    this.ImportData = this.ImportData.bind(this);
    this.submitSend = this.submitSend.bind(this);
    this.close = this.close.bind(this);
  }
  componentWillMount(){
    let that = this;
    let state = globalStore.getCache('BillEditStateData')
    // console.log(globalStore.getCache("cacheData"));
    if(globalStore.getCache("cacheData") && globalStore.getCache("cacheData").length>0){
      globalStore.getCache("cacheData").forEach((item)=>{
        let itemData = store.updateItemData(item)
        if(state){
          state.bodyListData.forEach((sitem)=>{
            if(sitem.type==itemData.type){
              sitem.data.push(itemData)
            }
          })
        }
      })
      // console.log(globalStore.getWebReimburse);
      // globalStore.webreimburse=[]
      globalStore.getCache("cacheData",undefined)
      // console.log(globalStore.getWebReimburse);

    }

    if(state){
      that.setState({
        bodyListData:state.bodyListData,
        headListData: state.headListData,
        tabPage: state.tabPage,
        subsidiesData: state.subsidiesData,
        shareData:state.shareData
      },()=>{
        globalStore.setCache('BillEditStateData',undefined);
      })
    }
  }
  componentDidMount(){
    let that = this;
    //获取所有单据类型
    store.getBillType({},that.state.pk);
    //获取提交Key store.ExpenseKeyData
    store.getSaveExpenseKey({});
    // 获取个人银行账号
    store.getUserBank({});
  }
  setPage(page){
    let that = this;
    that.setState({
      tabPage: page
    })
  }
  // 添加报销明细
  webItemAdd(){
    let that = this;
    let state = JSON.parse(JSON.stringify(that.state))
    globalStore.setCache('BillEditStateData',state)
    // 动态配置路由
    let resultRouter = "travel";
    let routerList =store.BillTypeDataItem;
    if(routerList.nodetypes && routerList.nodetypes.length >0){
        resultRouter =this.switchRouter( routerList.nodetypes[0]); 
    }
    //页面跳转到添加
    that.props.router.replace('/web/'+resultRouter+'/'+that.state.pk)
    // console.log(that.props.router.replace('/web/traffice'));
  }

  //AjaxResult：travel、hotel、eating、communicate、other 
  //router:     travel、hotel、restaurant、communication 、other
  switchRouter( r ){
    let result = "" ; 
    if(r =="eating"){
      result = 'restaurant';
    }else if(r =="communicate"){
      result ='communication'
    }else{
      result = r ; 
    }
    return result;

  }

  //点击导入需要重新获取导入的数据
  ImportData(){
    let that = this;
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    if(m===0){
      y = y - 1;
      m = 12
    }
    m = m<10 ? '0'+m : m;
    d = d<10 ? '0'+d : d;

    store.getNodesByDateWithTemplatePk({
      date: y + '-' + m + '-' + d,
      templatePk: store.BillTypeDataItem.pk
    },()=>{
      that.setPage(2);
    })

  }

  setStateData(data,callback){
    let that = this;
    that.setState(data,()=>{
      if(callback){
        callback()
      }
    })
  }
  render(){
    let that = this;
    return (
      <div className="content" style={{paddingBottom:"50px"}}>
        <div className={that.state.tabPage==1 ? "container-fluid":"hide"}>
          <div className="details_title">{store.BillTypeDataItem.billtype}</div>
          {/*基本信息*/}
          <BillEditBase
            UserBankData={store.UserBankData}
            getLoanBillItemInformationData={store.getLoanBillItemInformationData}
            bodyListData={that.state.bodyListData}
            headListData={that.state.headListData}
            setStateData={that.setStateData}
           />
          {/*明细统计*/}
          <BillEditTotal
            bodyListData={that.state.bodyListData}
            webItemAdd={that.webItemAdd}
            ImportData={that.ImportData}
          />
          {/*明细表格*/}
          <BillEditTable
              bodyListData={that.state.bodyListData}
              BillTableColumn={store.BillTableColumn}
          />
          {/*费用归属*/}
          <BillEditShare
            shareData={that.state.shareData}
            setStateData={that.setStateData}
            subsidiesData={that.state.subsidiesData}
            bodyListData={that.state.bodyListData}
            BillTypeDataItem={store.BillTypeDataItem}
           />
          {/*补助*/}
          <BillEditSubsidies
            bodyListData={that.state.bodyListData}
            setStateData={that.setStateData}
            subsidiesData={that.state.subsidiesData}
            BillTypeDataItem={store.BillTypeDataItem}
           />
        </div>
        <div className={that.state.tabPage==1 ? "btn-bottom-fixed":"hide"}>
          <div className="row btn-bottom">
            <div className="col-sm-12">
              <span className="details_title_total">合计：{this.state.headListData.money ? Utils.formatCurrency(this.state.headListData.money) : 0}</span>
              <button type="button" onClick={that.submitSend} className='btn btn-primary fr'>报账</button>
            </div>
          </div>
        </div>
        <BillEditImport
          key={Math.random()+'3'}
          setPage={that.setPage}
          tabPage={that.state.tabPage}
          setStateData={that.setStateData}
          bodyListData={that.state.bodyListData}
          BillTypeDataItem={store.BillTypeDataItem}
          getNodesByDateWithTemplatePkData={store.getNodesByDateWithTemplatePkData}
        />
        <Modal show={that.state.isVisible} onHide={that.close.bind(this,'close')} className="static-modal">
          <Modal.Header closeButton={true}>
              <Modal.Title style={{textAlign:'left'}}>超出报销标准</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{overflow:'auto'}}>
              您报销的已经超不保险标注！
          </Modal.Body>
          <Modal.Footer>
              <Button bsStyle="primary" onClick={that.close.bind(this,'close')}>返回修改</Button>
              <Button bsStyle="primary" onClick={that.close.bind(this,'send')}>继续保险</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
  submitSend(){
    let that = this;

    let messageerror = [];
    //表头信息
    let headListData = that.state.headListData;
    store.getLoanBillItemInformationData.forEach((item,index)=>{
      if(item.type==5){
        if(item.source_code == 'bankAccount' || item.source_code == 'bankAccountKey'){
          if(!store.UserBankData.userName || !store.UserBankData.bankCard)
          messageerror.push(<li>个人收款账户或个人收款账号不能为空!</li>)
        }else{
          if(item.typeTwo==2){
            if(!headListData[item.source_code]){
              messageerror.push(<li>请选择{item.source_name}</li>)
            }
          }else{
            if(!headListData[item.source_code]){
              messageerror.push(<li>请选择{item.source_name}</li>)
            }
          }
        }
      }else{
        if(!headListData[item.source_code]){
          messageerror.push(<li>请输入{item.source_name}</li>)
        }
      }
    })


    let totalMoney = 0;
    let items = [];
    that.state.bodyListData.forEach((item)=>{
      item.data.forEach((ditem)=>{
        totalMoney= totalMoney + ditem.money
        items.push({
          type: item.id,
          pk:ditem.pk
        })
      })
    })

    if(items.length<1){
      messageerror.push(<li>请导入或添加信息</li>)
    }
    let totalshareMoney = 0;
    let dworbm = false
    if(store.BillTypeDataItem.costShared){
      that.state.shareData.forEach((item)=>{
        totalshareMoney = totalshareMoney + Number(item.money.data)
        if((item.dw.data.length<1) || (item.bm.data.length<1 )){
          dworbm=true
        }
      })
      if(dworbm){
        messageerror.push(<li>分摊信息填写不完整</li>)
      }
      if(totalshareMoney!=(totalMoney+that.state.subsidiesData.total)){
        messageerror.push(<li>分摊金额与实际金额不符</li>)
      }
    }
    if(messageerror.length>0){
      globalStore.showModel(messageerror)
      return;
    }
    store.checkStandard({
      billType:store.BillTypeDataItem.billtype,
      items:items
    },(data)=>{
      let flag = false;
      data.forEach((item)=>{
        if('check' in item && item.check=='false'){
          flag=true;
        }
      })
      if(flag){
        that.setState({
          isVisible:true
        })
      }else{
        that.submitSendData();
      }
    })
  }
  close(state){
    let that = this;
    if(state=='send'){
      that.submitSendData();
    }
    that.setState({
      isVisible:false
    })
  }
  submitSendData(){
    let that = this;
    let data = {}
    let totalMoney = 0;
    let itemListData = []
    let tagNames = []
    let information = {} //表头信息
    let msg = [];
    let headListData = that.state.headListData;
    //表头信息
    store.getLoanBillItemInformationData.forEach((item,index)=>{
      if(item.type==5){
        if(item.source_code == 'bankAccount'){
          information[item.source_code] = store.UserBankData.userName
        }else if(item.source_code == 'bankAccountKey'){
          information[item.source_code] = store.UserBankData.bankCard
        }else{
          if(item.typeTwo==3){
            if(headListData[item.source_code]){
              information[item.source_code]=headListData[item.source_code][0].id+','+headListData[item.source_code][0].code
            }
          }else{
            if(headListData[item.source_code]){
              information[item.source_code]=headListData[item.source_code][0].id+','+headListData[item.source_code][0].name
            }
          }
        }

      }else{
        if(headListData[item.source_code]){
          information[item.source_code]=headListData[item.source_code]
        }
      }
    })
    that.state.bodyListData.map((item)=>{
      item.data.map((ditem)=>{
        itemListData.push({
          type:item.id,
          pk:ditem.pk
        })
        if(ditem.tagContent){
          tagNames.push(ditem.tagContent)
        }

        totalMoney= totalMoney + ditem.money
      })
    })
    //（费用分摊部门信息）
    let cshare_item = []
    if(store.BillTypeDataItem.costShared){
      that.state.shareData.map((item)=>{
        cshare_item.push({
          assume_amount: item.money.data+"",
          assume_pk_org:item.dw.data[0].pk,
          assume_org_name: item.dw.data[0].name,
          assume_pk_dept:item.bm.data[0].pk,
          assume_dept_name:item.bm.data[0].name
        })
      })
    }

    let overstandard = []
    store.checkStandardData.forEach((item)=>{
      if('check' in item && item.check=='false'){
        overstandard.push(item)
      }
    })
    data.expenseDate = Utils.formatDate(new Date()); //（报账日期）
    data.descript = ''; //（事由）
    data.djlxmc = store.BillTypeDataItem.billtype; //"差旅报销",
    data.djlxpk = store.BillTypeDataItem.pk;
    if(store.BillTypeDataItem.allowance){
      data.subsidy = { //（补助信息）
        subsidyDays: that.state.subsidiesData.day+"",
        subsidyUnits:that.state.subsidiesData.money+"",
        startDate:that.state.subsidiesData.startDate+"",
        endDate:that.state.subsidiesData.endDate+""
      }
    }else{
      data.subsidy = { //（补助信息）
        subsidyDays: "",
        subsidyUnits:"",
        startDate:"",
        endDate:""
      }
    }

    data.money = totalMoney; //（报账金额）,
    data.cshare_item = cshare_item;
    //（超出标准验证，验证已经超出报账标准的表体后，如果强行提交，需要标注出那条）
    data.overstandard = overstandard;
    data.item=itemListData;//(表体信息,即记事信息,type为0-8,分别表示一种记事, pk为记事的pk)
    data.tagNames = tagNames;//包含的标标签集合
    data.totalInform = {
      billTypeInformation: {
        billType:store.BillTypeDataItem.pk
      },
      information:information,
      otherInformation:{
        "djlxpk": store.BillTypeDataItem.pk, // (单据类型,               这里的billtype传billtypePk),
        "dest_billtype": store.BillTypeDataItem.billtype, //
        "Djdl": store.BillTypeDataItem.type //(单据大类)
      }
    }
    data.expenseKey = store.ExpenseKeyData;//前面的接口取回来的key
    store.saveNodeExpense1(data,(s,pk)=>{
      if(s==0){
        that.props.router.replace('/billdetails/'+store.BillTypeDataItem.type+'/'+pk+'/2')
      }else{

      }
    })
//     {
//     "expenseDate": "2017-06-23"（报账日期）,
//     "descript": ""（事由）,
//     "djlxmc": "差旅报销",
//     "djlxpk": "TFSCYpUgRUTjEgaE0rMtv"（单据类型PK，即billtypePk）,
//     "subsidy": {
//         "subsidyDays": "0.5",
//         "subsidyUnits": "60",
//         "startDate": "2017-06-22",
//         "endDate": "2017-06-22"
//     }（补助信息）,
//     "money": "165.00"（报账金额）,
//     "cshare_item": [
//         {
//             "assume_amount": "165.00",
//             "assume_pk_org": "15718812222",
//             "assume_pk_dept": "65C8CBDA-733D-45E8-8656-D9DCF40F204F",
//             "assume_org_name": "8080测试企业",
//             "assume_dept_name": "IT部"
//         }
//     ]（费用分摊部门信息）,
//     "overstandard": [
//         {
//             "type": "0",
//             "pks": [
//                 "8rSChJZI4pYDq0kt4STWq"
//             ]
//         }
//     ]（超出标准验证，验证已经超出报账标准的表体后，如果强行提交，需要标注出那条）,
//     "item": [
//         {
//             "type": "0",
//             "pk": "fHSCNjhEKm4zyX9TZ0BO1"
//         },
//         {
//             "type": "0",
//             "pk": "8rSChJZI4pYDq0kt4STWq"
//         }
//     ](表体信息,
//     即记事信息,
//     type为0-8,
//     分别表示一种记事,
//     pk为记事的pk),
//     "tagNames": [
//
//     ](包含的标标签集合),
//     "totalInform": {
//         "billTypeInformation": {
//             "billType": "TFSCYpUgRUTjEgaE0rMtv"
//         }(单据类型,
//         这里的billtype传billtypePk),
//         "information": {
//             "money": "165.00"(金额),
//             "descript": "开关盒"(事由,
//             和前面的事由的区别,
//             可能是后来修改后,
//             前面的事由废弃了.),
//             "bankAccount": "undefined,2902728405"(银行账户),  pk name 1500 1530
//             "bankAccountKey": "undefined,12312132132132131"(银行账号, pk code 1520
//             与账户的区别是,
//             同一个参照取回来的信息里,
//             NAME为账户,
//             code为账号,
//             前面拼接的undefined是PK,
//             这里有些情况下取不到PK,
//             前端不必处理.),
//             "dealdate": "2017-06-23"(单据时间),
//             "szitemKey": "73CD974B-5B4A-4068-AACF-7DA86C95A0D0,B费用项目"(收支项目,
//             '"PK"+","+"name"'),
//             "zdyhead": "2D2902F4-DBF7-4CDA-ADE4-BB2F09D43931,A项目"
//         }(项目,
//         '"PK"+","+"name"'),
//         "otherInformation": {
//             "djlxpk": "TFSCYpUgRUTjEgaE0rMtv"(单据类型,
//             这里的billtype传billtypePk),
//             "dest_billtype": "",
//             "Djdl": "bx"(单据大类)
//         }
//     },
//     "expenseKey": "ddSCikfR3XfsUy4MjezFt"(前面的接口取回来的key)
// }
  }
}
