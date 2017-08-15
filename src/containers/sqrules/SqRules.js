/**
 * 友报账web-申请规则
 * author:zhangtongchuan
 * date: 2017-07-27
 * mail: zhangtch@yonyou.com
 * api:http://git.yonyou.com/sscplatform/fc_doc/blob/master/controlRules.md
 */
import React from 'react';
import {observer} from 'mobx-react';
import Checkbox from 'rc-checkbox';
import {Refers} from 'ssc-refer';
import  GlobalStore from '../../stores/GlobalStore';
import Config from '../../config'
import SqRulesStore from '../../stores/sqrules/SqRulesStore'
@observer
export default class SqRules extends React.Component {
  /**
  * 构造方法
  */
  constructor(props){

    super(props)
    this.state = {
      defaultData: {
        id: '',
        pk: '',
        billPk: '',
        billName: '',
        isMustApply: false,
        controlMode: 'ban',
        isAssociateProject: false,
        isAssociateExpense: false,
        isAllowReimburse: false,
        expense:0,
        isAssociateApply: false,
        nodeControlItemList:[],
        billData: [],
        xm: [],
        fyxm: [],
        sqd: [],
        isShow: false
      },
      dataList: []
    }
    this.stores = new SqRulesStore()
    this.referHandleChange = this.referHandleChange.bind(this);
    this.radioClick = this.radioClick.bind(this);
    this.addItem = this.addItem.bind(this);
    this.inputChange = this.inputChange.bind(this)
    this.submitClick = this.submitClick.bind(this)
  }
  submitClick(){
    let that = this
    let dataList = that.state.dataList
    let message = [];
    let billtype = {}
    let flag = []
    let data = dataList.map((item,index)=>{
      if(item.billData.length===0){
        message.push(<li>请选择第{index+1}单据类型</li>)
      }else{
        if(!billtype[item.billData[0].pk]){
          flag.push(item.billData[0].pk)
          billtype[item.billData[0].pk] = true
        }
      }
      if(item.isMustApply&&item.isAssociateProject && item.xm.length===0){
        message.push(<li>请选择第{index+1}项目设置</li>)
      }
      if(item.isMustApply&&item.isAssociateExpense && item.fyxm.length===0){
        message.push(<li>请选择第{index+1}费用项目设置</li>)
      }
      if(item.isAssociateApply && item.sqd.length===0){
        message.push(<li>请选择第{index+1}关联申请单</li>)
      }
      let nodeControlItemList = item.xm.map((item)=>{
        return {
          controlType:'xm',
          refPk:item.id,
          refName: item.name
        }
      })
      nodeControlItemList = nodeControlItemList.concat(item.fyxm.map((item)=>{
        return {
          controlType:'fyxm',
          refPk:item.id,
          refName: item.name
        }
      }))
      nodeControlItemList = nodeControlItemList.concat(item.sqd.map((item)=>{
        return {
          controlType:'sqd',
          refPk:item.pk,
          refName: item.billtype
        }
      }))
      return {
        id: item.id,
        pk: item.pk,
        billPk: item.billData.length>0?item.billData[0].pk:'',
        billName: item.billData.length>0?item.billData[0].billtype:'',
        isMustApply: item.isMustApply,
        controlMode: item.isMustApply?'ban':item.controlMode=='ban'?'no':item.controlMode,
        isAssociateProject: item.isAssociateProject,
        isAssociateExpense: item.isAssociateExpense,
        isAllowReimburse: item.isAllowReimburse,
        expense:item.expense,
        isAssociateApply: item.isAssociateApply,
        nodeControlItemList:nodeControlItemList,
      }
    })
    console.log(flag);
    if(flag.length<dataList.length){
      message.unshift('单据类型不能重复！')
    }
    if(message.length>0){
      GlobalStore.showModel(message)
      return;
    }
    that.stores.save(data,(data)=>{
      if(Number(data.code)===1){
        GlobalStore.showModel('保存成功！')
      }else{
        GlobalStore.showModel('保存失败！')
      }
    })
  }
  /**
  * 首次渲染之前调用 生命周期钩子
  */
  componentWillMount(){
    let that = this
    that.stores.getQuery({},(data)=>{
      let dataList = []
      if(data.length===0){
        dataList = [JSON.parse(JSON.stringify(that.state.defaultData))]
      }else{
        dataList = data.map((item)=>{
          let xm = [];
          let fyxm = [];
          let sqd = [];
          item.nodeControlItemList.forEach((item)=>{
            if(item.controlType=='xm'){
              xm.push(Object.assign(item,{id:item.refPk,name:item.refName}))
            }else if(item.controlType=='fyxm'){
              fyxm.push(Object.assign(item,{id:item.refPk,name:item.refName}))
            }else if(item.controlType=='sqd'){
              sqd.push(Object.assign(item,{pk:item.refPk,billtype:item.refName}))
            }
          })
          return {
            id: item.id,
            pk: item.pk,
            billPk: item.billPk,
            billName: item.billName,
            isMustApply: item.isMustApply,
            controlMode: item.controlMode,
            isAssociateProject: item.isAssociateProject,
            isAssociateExpense: item.isAssociateExpense,
            isAllowReimburse: item.isAllowReimburse,
            expense:item.expense,
            isAssociateApply: item.isAssociateApply,
            nodeControlItemList:item.nodeControlItemList,
            billData: [{pk:item.billPk,billtype:item.billName}],
            xm: xm,
            fyxm: fyxm,
            sqd: sqd,
            isShow: false
          }
        })
      }
      // console.log(JSON.stringify(dataList));
      that.setState({
        dataList: dataList
      })
    })
  }
  /**
  * 单据类型选择
  */
  referHandleChange(type,index,pkid,tempArray){
    // console.log(tempArray);
    let that = this
    let dataList = JSON.parse(JSON.stringify(that.state.dataList))
    let array = []
    let temp = {}
    tempArray.forEach((item)=>{
      if(!temp[item[pkid]]){
        array.push(item)
        temp[item[pkid]] = true
      }
    })
    dataList[index][type]=array.map((item)=>{
      return item
    })
    if(type==='billData'){
      dataList[index]['xm']=[]
      dataList[index]['fyxm']=[]
    }
    that.setState({
      dataList:dataList
    },()=>{
      console.log(that.state.dataList);
    })
  }
  radioClick(type,index,value){
    let that = this
    let dataList = JSON.parse(JSON.stringify(that.state.dataList))
    dataList[index][type]=value
    that.setState({
      dataList:dataList
    })
  }
  addItem(type,item,index){
    let that = this
    let dataList = JSON.parse(JSON.stringify(that.state.dataList))
    let defaultData = JSON.parse(JSON.stringify(that.state.defaultData))
    if(type==='copy'){
      dataList.splice(index,0,Object.assign(JSON.parse(JSON.stringify(item)),{id:'',pk:''}))
    }else if(type==='del'){
      if(dataList.length>1){
        dataList.splice(index,1)
      }else{
        GlobalStore.showModel('最后一个不能删除')
      }
    }else if(type==='add'){
      dataList.push(defaultData)
    }
    that.setState({
      dataList:dataList
    })
  }
  inputChange(type,index,event){
    let that = this
    let value = event.target.value
    let dataList = JSON.parse(JSON.stringify(that.state.dataList))
    if(value == parseInt(value) || value=="" || value=="-"){
      dataList[index][type] = value
      that.setState({
        dataList:dataList
      })
    }
  }
  /**
  * 必选的方法 创建虚拟DOM 生命周期钩子
  */
  render(){
    let that = this;
    let labelStyle = {marginLeft:'-20px'}
    let copyDelStyle = {
      color:'#DD3730',
      cursor:'pointer',
      padding: '3px 5px'
    }
    let addStyle = {
      cursor:'pointer'
    }
    let isShowStyle={
      cursor:'pointer',
      textAlign:'center'
    }
    return (
      <div className="content" style={{paddingBottom:"50px"}}>
        <div className="container-fluid">
          <div className="details_title">申请控制规则</div>
          {
            that.state.dataList.map((item,index)=>{
              return (
                <div key={index} className="stdreimburse-box">
                  <div className="row">
                    <div className="col-xs-4 form-group">
                      <label>单据类型</label>
                      <Refers
                        key={Math.random()}
                        labelKey="billtype"
                        emptyLabel='暂无数据'
                        onChange={this.referHandleChange.bind(this,'billData',index,'pk')}
                        placeholder="请选择..."
                        referConditions={{data:["bx","jk"]}}
                        referDataUrl={Config.sqrules.getBillType}
                        referType="list"
                        selected={item.billData}
                        ref={ref => this._myrefers = ref}
                        multiple={false}
                      />
                    </div>
                    <div className="col-xs-4  form-group">
                      <label>是否必须申请</label>
                      <div className="radio">
                        <label className="radio-inline" onClick={that.radioClick.bind(this,'isMustApply',index,true)}>
                          <input type="radio" checked={item.isMustApply===true}  /> 必须申请
                        </label>
                        <label className="radio-inline" onClick={that.radioClick.bind(this,'isMustApply',index,false)}>
                          <input type="radio" checked={item.isMustApply===false} /> 非必须申请
                        </label>
                      </div>
                    </div>
                    <div className="col-xs-4  form-group">
                      <label>控制方式</label>
                      <div className="radio">
                        <label className={item.isMustApply===true?"radio-inline":"hide"} onClick={that.radioClick.bind(this,'controlMode',index,'ban')}>
                          <input type="radio" checked={item.controlMode==='ban' || item.isMustApply===true}  />禁止
                        </label>
                        <label className={item.isMustApply===false?"radio-inline":"hide"} onClick={that.radioClick.bind(this,'controlMode',index,'no')}>
                          <input type="radio" checked={item.controlMode==='no' || item.isMustApply===false && item.controlMode==='ban'}  />不控制
                        </label>
                        <label className={item.isMustApply===false?"radio-inline":"hide"} onClick={that.radioClick.bind(this,'controlMode',index,'prompt')}>
                          <input type="radio" checked={item.controlMode==='prompt'} />提示
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className={item.isShow && item.isMustApply===true?"row":"row hide"}>
                    <div className="col-xs-offset-4 col-xs-8">
                      <label>控制维度</label>
                      <div className="row">
                        <div className="col-xs-6">
                          <p>按项目设置必须关联申请</p>
                          <div className="checkbox">
                            <label style={labelStyle}>
                              <Checkbox onChange={that.radioClick.bind(this,'isAssociateProject',index,!item.isAssociateProject)} checked={item.isAssociateProject} />参照费用项目档案
                            </label>
                          </div>
                          <div className={item.isAssociateProject?"form-group":'hide'}>
                            <Refers
                              key={Math.random()}
                              labelKey="name"
                              emptyLabel='暂无数据'
                              onChange={this.referHandleChange.bind(this,'xm',index,'id')}
                              placeholder="请选择..."
                              referConditions={{billPk:item.billData.length>0?item.billData[0].pk:'',refType:'xm'}}
                              referDataUrl={Config.sqrules.queryRefJSON}
                              referType="list"
                              selected={item.xm}
                              ref={ref => this._myrefers = ref}
                              multiple={true}
                            />
                          </div>
                        </div>
                        <div className="col-xs-6">
                          按费用项目设置必须关联申请
                          <div className="checkbox">
                            <label style={labelStyle}>
                              <Checkbox onChange={that.radioClick.bind(this,'isAssociateExpense',index,!item.isAssociateExpense)} checked={item.isAssociateExpense} />参照费用项目档案
                            </label>
                          </div>
                          <div className={item.isAssociateExpense?"form-group":'hide'}>
                            <Refers
                              key={Math.random()}
                              labelKey="name"
                              emptyLabel='暂无数据'
                              onChange={this.referHandleChange.bind(this,'fyxm',index,'id')}
                              placeholder="请选择..."
                              referConditions={{billPk:item.billData.length>0?item.billData[0].pk:'',refType:'fyxm'}}
                              referDataUrl={Config.sqrules.queryRefJSON}
                              referType="list"
                              selected={item.fyxm}
                              ref={ref => this._myrefers = ref}
                              multiple={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={item.isShow&&item.isMustApply===true?"row":"row hide"}>
                    <div className="col-xs-offset-4 col-xs-4">
                      <label>允许报销百分比</label>
                      <div className="checkbox">
                        <label style={labelStyle}>
                          <Checkbox onChange={that.radioClick.bind(this,'isAllowReimburse',index,!item.isAllowReimburse)} checked={item.isAllowReimburse} />允许报销百分比
                        </label>
                      </div>
                      <div className={item.isAllowReimburse===true?"form-group":"hide"}>
                        <input type="text" value={item.expense} onChange={that.inputChange.bind(this,'expense',index)} style={{width:'80px',display:'inline-block'}} className="form-control" placeholder="允许报销百分比" />%
                      </div>
                    </div>
                  </div>
                  <div className={item.isShow?"row":'row hide'}>
                    <div className="col-xs-offset-4 col-xs-4">
                      <label>关联申请单 </label>
                      <div className="checkbox">
                        <label style={labelStyle}>
                        <Checkbox onChange={that.radioClick.bind(this,'isAssociateApply',index,!item.isAssociateApply)} checked={item.isAssociateApply} />已选费申请单
                        </label>
                      </div>
                      <div className={item.isAssociateApply===true?"form-group":"hide"}>
                        <Refers
                          key={Math.random()}
                          labelKey="billtype"
                          emptyLabel='暂无数据'
                          onChange={this.referHandleChange.bind(this,'sqd',index,'pk')}
                          placeholder="请选择..."
                          referConditions={{data:["sq"]}}
                          referDataUrl={Config.sqrules.getBillType}
                          referType="list"
                          selected={item.sqd}
                          ref={ref => this._myrefers = ref}
                          multiple={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={item.isShow?"row":'row hide'}>
                    <div className="col-xs-offset-10 col-xs-2">
                      <span onClick={that.addItem.bind(this,'copy',item,index)} style={copyDelStyle}>复制</span>
                      <span onClick={that.addItem.bind(this,'del',item,index)} style={copyDelStyle}>删除</span>
                    </div>
                  </div>
                  <p onClick={that.radioClick.bind(this,'isShow',index,!item.isShow)} style={isShowStyle}><span className={item.isShow?'glyphicon glyphicon-menu-up':'glyphicon glyphicon-menu-down'}></span></p>
                </div>
              )
            })
          }
          <div style={addStyle} onClick={that.addItem.bind(this,'add')} className="details_title"><span className="glyphicon glyphicon-plus"></span></div>
        </div>

        <div className="btn-bottom-fixed">
          <div className="row btn-bottom">
            <div className="col-sm-12">
              <button type="button" onClick={that.submitClick} className='btn btn-primary fr'>保存</button>
              <button type="button" className='btn btn-default fr'>取消</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  /**
  * 真实的DOM被渲染出来后调用 生命周期钩子
  */
  componentDidMount(){

  }
  /**
  * 组件接收到新的props时调用 生命周期钩子
  */
  componentWillReceiveProps(nextProps){

  }
  /**
  * 组件是否应当渲染新的props或state 返回false跳过
  */
  shouldComponentUpdate(){
    return true
  }
  /**
  * 接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state
  */
  componentWillUpdate(){

  }
  /**
  * 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素
  */
  componentDidUpdate(){
  }
  /**
  * 组件被移除之前被调用
  */
  componentWillUnmount(){

  }
}
