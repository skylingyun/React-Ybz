/*
 * 火车报销标准 新增组件
 * */
import React from 'react';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import TrainStore  from '../../stores/stdreimburse/StdReimburseTrainStore';
import mobx from 'mobx';
import Config from '../../config';
import {Refers} from 'ssc-refer';
import Checkbox from 'rc-checkbox';

@observer
class TrainAddorEdit extends React.Component {

  constructor(props) {
    super(props);
    this.FlightsUserList=[]
    this.trainStore = new TrainStore();
    this.state = {
      trainSitList: [
        {code: "train_01", name: "商务座"},
        {code: "train_02", name: "一等座"},
        {code: "train_03", name: "二等座"},
        {code: "train_04", name: "软卧"},
        {code: "train_05", name: "硬卧"},
        {code: "train_06", name: "软座"},
        {code: "train_07", name: "硬座"},
        {code: "train_08", name: "无座"}
      ],

      posts: [], //职位
      ranks: [], //职级
      pageData: [],
      referposts: [], //职位
      referranks: [], //职级
      checkboxChange: false,
      standardName: "",
      isVisible: false,
      depts: [], //部门
      referdepts:[],
      fuserList: [],
      isuser: false,
      itemDataString: ''
    }
    this.setCheckData = this.setCheckData.bind(this);
  }

  componentWillMount() {
    globalStore.hideAlert(); //
  }

  componentWillReceiveProps(nextProps) {
    var data = nextProps.pageData || [];
    var _this = this;
    let that = this;
    this.setState({
      pageData: data
    }, function () {
      if(that.state.itemDataString != JSON.stringify(nextProps.pageData)){
        _this.init();
      }

    });

  }


  // 获得编辑的数据，通过Store来调用
  init = ()=> {
    var data = this.state.pageData;
    this.setState({
          ranks: data.ranks && data.ranks.map((item)=> {
            let dItem = {}
            dItem.id=item.pk;
            // dItem.code=item.pk;
            // dItem.isLeaf = "true";
            // dItem.pid = "";
            dItem.name=item.name?item.name:"";
            return dItem
          })||[],
          posts: data.posts&&data.posts.map((item)=> {
              let dItem = {}
              dItem.id=item.pk;
              // dItem.code=item.pk;
              // dItem.isLeaf = "true";
              // dItem.pid = "";
              dItem.name=item.name?item.name:"";
              return dItem
            })||[],
          standardName: data.name || "",
          referranks:data.ranks&&data.ranks.map((item)=> {
            let dItem = {}
            dItem.id=item.pk;
            // dItem.code=item.pk;
            // dItem.isLeaf = "true";
            // dItem.pid = "";
            dItem.name=item.name?item.name:"";
            return dItem
          })||[],
          referposts:data.posts&& data.posts.map((item)=> {
            let dItem = {}
            dItem.id=item.pk;
            // dItem.code=item.pk;
            // dItem.isLeaf = "true";
            // dItem.pid = "";
            dItem.name=item.name?item.name:"";
            return dItem
          })||[],
          seattypeList:data.seattype || [],
          checkboxChange: false,
          itemDataString: JSON.stringify(data.pageData),
          depts: data.depts ? data.depts.map((item)=>{
            let dItem = {}
            dItem.id=item.pk;
            dItem.name=item.name?item.name:"";
            return dItem
          }) : [],
          referdepts: data.depts ? data.depts.map((item)=>{
            let dItem = {}
            dItem.id=item.pk;
            dItem.name=item.name?item.name:"";
            return dItem
          }) : [],
          isuser: data.relationuserflag == 'Y' ? true : false,
          fuserList: data.users ? data.users : []
        },
        () => {
          // input输入框
          if (this.state.standardName) {
            this.titleName.style.top = '-10px';
          } else {
            this.titleName.style.top = '5px';
          }
        })
  }

  checkboxState = (e) => {
    var el = e.target;
    var trainSitList = this.state.trainSitList;
    trainSitList.map((value, index)=> {
      if (el.name == value.code) {
        if (el.checked) {
          trainSitList[index].checked = true;
        } else {
          trainSitList[index].checked = false;
        }
      }
    })

    this.setState({
      trainSitList: trainSitList,
      checkboxChange: true     //用户是否进行了操作
    })

  }

  //取消提交
  cancelSubmit = () => {
    globalStore.showCancelModel("您确认要取消吗？", ()=> {
      // 取消
    }, ()=> {
      // 确定
      this.props.updateAndAdd();
    });
  }

  //确认提交
  submit = () => {
    let that = this;
    var seattype = this.state.trainSitList;
    var seattypeList = [], msg = [];
    var _this = this;
    $.each(seattype, (index, value) => {
      if (value.checked == true) {
        seattypeList.push(value.code)
      }
    });
    if (!this.state.standardName) {
      msg.push(<li key="standard001">标准名称不能为空！</li>)
    }
    if (seattypeList.length == 0) {
      msg.push(<li key="standard003">请选择座次！</li>)
    }
    // if (!this.state.posts || this.state.posts.length == 0) {
    //   msg.push(<li key="standard002">请选择职级！</li>)
    // }
    // if (!this.state.ranks || this.state.ranks.length == 0) {
    //   msg.push(<li key="standard004">请选择职务！</li>)
    // }
    if (msg.length > 0) {
      globalStore.showModel(msg)
      return;
    }

    var data = {
      "code": "",
      "id": this.state.pageData.id,
      "name": this.state.standardName,
      "policyexpensetype": "train",     //政策性标准类型
      "seattype": seattypeList,       //席位
      "posts": this.state.posts.map((item)=>item.id),    //职务
      "ranks": this.state.ranks.map((item)=>item.id)    //职级
    };
    data.depts = that.state.depts.map((item)=>item.id);
    data.users = that.state.fuserList.map((item)=>item.userid)
    data.relationuserflag = that.state.isuser ? 'Y' : 'N'

    if (globalStore.trainEditData && globalStore.trainEditData.length != 0) {
      this.trainStore.updateTrain(data, ()=> {
        this.props.updateAndAdd()
      })
    } else {
      this.trainStore.saveTrain(data, ()=> {
        this.props.updateAndAdd()
      })
    }
  }

  getStandardName = (e) => {
    this.setState({
      standardName: $.trim($(e.currentTarget).val())
    })
  }


  referHandleChange(type, tempArray) {
    let json = {};
    let selected = [];
    tempArray.forEach((item)=>{
      if(!json[item.id]){
        selected.push(item);
        json[item.id]=1;
      }
    })
    let that = this;
    if(type=='ranks'){
      that.setState({
        referranks:selected
      })
    }
    if(type=='posts'){
      that.setState({
        referposts:selected
      })
    }
    if(type=='depts'){
      that.setState({
        referdepts:selected
      })
    }
  }

  sureFn() {
    let that = this;
    let referposts = that.state.referposts;
    let referranks = that.state.referranks;
    let referdepts = that.state.referdepts;
    that.setState({
      isVisible:false,
      posts:referposts,
      ranks:referranks,
      depts:referdepts,
      fuserList:that.FlightsUserList
    })
  }

  cancelFn() {
    let that = this;
    let posts = that.state.posts;
    let ranks = that.state.ranks;
    let depts = that.state.depts;
    that.setState({
      isVisible:false,
      referposts:posts,
      referranks:ranks,
      referdepts:depts
    })
  }

  addUserList = (e)=> {
    let that = this;
    e.stopPropagation();
    that.setCheckData();
    this.setState({
      isVisible: true
    })
  }


  trainSit = ()=> {
    var trainSitList = this.state.trainSitList;
    var selectSit = this.state.pageData.seattype;
    var _this = this;

    if (selectSit && selectSit.length > 0 ) {    //编辑
      if (!this.state.checkboxChange) {
        $.each(trainSitList, (n, m) => {
          m.checked = false;
          $.each(selectSit, (i, v)=> {
            if (v.code == m.code) {
              m.checked = true;
            }
          })
        })
      }

      /*if (!this.state.checkboxChange) {
        $.each(trainSitList, (n, m) => {
          $.each(selectSit, (i, v)=> {
            if (v.code == m.code) {
              m.checked = true;
            }
          })
        })
      }*/

    } else {
      //新增
      if(!this.state.checkboxChange){
          $.each(trainSitList, (n, m) => {
            m.checked = false;
        })
      }
    }

    return (
        trainSitList.map((value, index)=> {
          return (
              <div key={"checkbox"+index} className="checkbox mr20 standard-checkbox">
                <label>
                  <Checkbox name={value.code} checked={value.checked} onChange={_this.checkboxState}/> {value.name}
                </label>
              </div>
          )
        })
    )
  }

  trainRanks = ()=> {
    let ranks = this.state.ranks;
    let that = this;
    if (!ranks || ranks.length == 0) {
      return ( <div className="standard-detail-name"></div>)
    }
    return (
        that.state.ranks.map((item, index)=> {
          if (index === 0) {
            return (
                <div key={index+'ranks'} className="standard-detail-name">
                  {item.name}
                  <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                </div>
            )
          } else {
            return (
                <div key={index+'ranks'} style={{display:"inline-block"}}>
                  、
                  <div className="standard-detail-name">
                    {item.name}
                    <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                  </div>
                </div>
            )
          }
        })
    )
  }

  trainPosts = () => {
    let posts = this.state.posts;
    let that = this;
    if (!posts || posts.length == 0) {
      return ( <div className="standard-detail-name"></div>)
    }
    return (
        that.state.posts.map((item, index)=> {
          if (index === 0) {
            return (
                <div key={index+'posts'} className="standard-detail-name">
                  {item.name}
                  <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                </div>
            )
          } else {
            return (
                <div key={index+'posts'} style={{display:"inline-block"}}>
                  、
                  <div className="standard-detail-name">
                    {item.name}
                    <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                  </div>
                </div>
            )
          }
        })
    )
  }

  handleDelete(type,data,event) {
    let that = this;
    let msg = [];
    msg.push('您是否要将用户')
    msg.push(data.name)
    msg.push('移除')
    msg.push(type=='ranks'?'职级': type=='depts'? '部门':'职务')
    msg.push('外?')
    globalStore.showCancelModel(msg.join(''), ()=> {
    }, ()=> {

      if(type==='ranks'){
        let ranks = that.state.ranks;
        let referranks = that.state.referranks;
        ranks.forEach((item,index)=>{
          if(data.id==item.id){
            ranks.splice(index,1);
            referranks.splice(index,1);
          }
        });
        that.setState({
          ranks:ranks,
          referranks:referranks
        });
      }

      if(type==='posts'){
        let posts = that.state.posts;
        let referposts = that.state.referposts;
        posts.forEach((item,index)=>{
          if(data.id==item.id){
            posts.splice(index,1);
            referposts.splice(index,1);
          }
        });
        that.setState({
          posts:posts,
          referposts:referposts
        });
      }
      if(type==='depts'){
        let depts = that.state.depts;
        let referdepts = that.state.referdepts;
        depts.forEach((item,index)=>{
          if(data.id==item.id){
            depts.splice(index,1);
            referdepts.splice(index,1);
          }
        });
        that.setState({
          depts:depts,
          referdepts:referdepts
        });
      }
    });
  }
  //input 获取焦点
  inputOnFocus() {
    this.titleName.style.top = '-10px'
    // this.setState({focus: true});
  }

  //input 失去焦点
  inputOnBlur(event) {
    let val = event.target.value;
    if (val == '') {
      this.titleName.style.top = '5px'
    }
    // this.setState({focus: false});
  }

  render() {
    var that = this;
    return (
        <div className="container-fluid">
          <div className="stdreimburse-box">
            <div className="row">
              <div className="col-md-12">
                <div className="pr">
                  <div ref={(input) => { this.titleName = input; }} className="standard-name-label">标准名称</div>
                  <input type="text" value={this.state.standardName} className="standard-name-input"
                         onChange={this.getStandardName}
                         onBlur={ ::this.inputOnBlur }
                         onFocus={ ::this.inputOnFocus }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="stdreimburse-box">
            <div className="row">
              <div className="col-md-12">
                <span className="standard-content">标准内容</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="standard-detail">座次选择</div>
                <form className="horizontal">
                  <div className="form-group standard-formgroup">
                    {this.trainSit()}
                  </div>
                </form>
                <div className="standard-detail mt10">提示：请勾选该标准包含的选项，不勾选则不包含在标准内。</div>
              </div>
            </div>
          </div>

          <div className="stdreimburse-box">
            <div className="row">
              <div className="col-md-12">
                <span className="standard-content">匹配用户</span>
                <span className="checkbox" style={{display:'inline-block','margin-left':'15px'}}>
                  <label><input type="checkbox" onClick={that.isUserChecked.bind(this)} checked={that.state.isuser} />确定到用户</label>
                </span>
                <a className="btn btn-primary fr" onClick={that.addUserList} href="javascript:void(0)">添加用户</a>
              </div>
            </div>
            <div className={!that.state.isuser ? 'row' : 'hide'}>
              <div className="col-md-12">
                <span className="standard-detail">部门： </span>
                <div style={{display:"inline-block"}}>
                    {
                      that.state.depts.map((item,index)=>{
                        if(index===0){
                          return (
                            <div key={index+'depts'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'depts',item)}>x</span>
                          </div>
                          )
                        }else{
                          return (
                            <div key={index+'depts'} style={{display:"inline-block"}}>
                              、
                              <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'depts',item)}>x</span>
                              </div>
                            </div>
                          )
                        }
                      })
                    }
                </div>

              </div>
            </div>
            <div className={!that.state.isuser ? 'row' : 'hide'}>
              <div className="col-md-12">
                <span className="standard-detail">职级： </span>
                <div style={{display:"inline-block"}}>
                    {
                      that.state.ranks.map((item,index)=>{
                        if(index===0){
                          return (
                            <div key={index+'ranks'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                          </div>
                          )
                        }else{
                          return (
                            <div key={index+'ranks'} style={{display:"inline-block"}}>
                              、
                              <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'ranks',item)}>x</span>
                              </div>
                            </div>
                          )
                        }
                      })
                    }
                </div>
              </div>
            </div>
            <div className={!that.state.isuser ? 'row' : 'hide'}>
              <div className="col-md-12">
                <span className="standard-detail">职务： </span>
                <div style={{display:"inline-block"}}>
                    {
                      that.state.posts.map((item,index)=>{
                        if(index===0){
                          return (
                            <div key={index+'posts'} className="standard-detail-name">
                            {item.name}
                            <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                          </div>
                          )
                        }else{
                          return (
                            <div key={index+'posts'} style={{display:"inline-block"}}>
                              、
                              <div className="standard-detail-name">
                                {item.name}
                                <span className="tip" onClick={that.handleDelete.bind(this,'posts',item)}>x</span>
                              </div>
                            </div>
                          )
                        }
                      })
                    }
                </div>

              </div>
            </div>
            <div className={that.state.isuser ? 'row' : 'hide'}>
              <div className="col-md-12">
              <Grid
                columnsModel={that.props.fuserColumn.toJS()}
                tableData={that.state.fuserList}
                className="standard-grid"
              />
              </div>
            </div>
          </div>
          <div className="btn-bottom-fixed">
            <div className="row btn-bottom">
              <div className="col-sm-12">
                <button type="button" onClick={that.submit} className='btn btn-primary fr'>保存</button>
                <button type="button" onClick={that.cancelSubmit} className='btn btn-default fr'>取消</button>
              </div>
            </div>
          </div>

          <Modal show={that.state.isVisible} onHide={that.cancelFn.bind(this)} className ="static-modal">
              <Modal.Header>
                  <Modal.Title>添加用户</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{'overflow':'auto'}}>
                <div className="stdreimburse-box">
                  <div className="row mb20">
                    <div className="col-md-12">
                      <span className="screen-condition">筛选条件</span>
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-3">
                    <div className="screen-condition-label">部门</div>
                    <div>
                      <Refers
                          key={Math.random()}
                          labelKey="name"
                          emptyLabel='暂无数据'
                          onChange={this.referHandleChange.bind(this,'depts')}
                          placeholder="请选择..."
                          referConditions={{"refType":"tree","refCode":"dept"}}
                          referDataUrl={Config.refer.referDataUrl}
                          referType="list"
                          selected={that.state.referdepts}
                          ref={ref => this._myrefers = ref}
                          multiple={true}
                      />
                    </div>
                  </div>
                    <div className="col-md-3">
                      <div className="screen-condition-label">职级</div>
                        <div>
                          <Refers
                            key={Math.random()}
                            labelKey="name"
                            emptyLabel='暂无数据'
                            onChange={this.referHandleChange.bind(this,'ranks')}
                            placeholder="请选择..."
                            referConditions={{"refType":"table","rootName":"职级","displayFields":["id","name"]}}
                            referDataUrl={Config.stdreimburse.referranksUrl}
                            referType="list"
                            selected={that.state.referranks}
                            ref={ref => this._myrefers = ref}
                            multiple={true}
                          />
                        </div>
                    </div>
                    <div className="col-md-3">
                      <div className="screen-condition-label">职务</div>
                      <div>
                      {/*//"http://127.0.0.1:88/mapping/json"*/}
                        <Refers
                          key={Math.random()}
                          labelKey="name"
                          onChange={this.referHandleChange.bind(this,'posts')}
                          placeholder="请选择..."
                          emptyLabel='暂无数据'
                          referConditions={{"refType":"table","rootName":"职级","displayFields":["id","name"]}}
                          referDataUrl={Config.stdreimburse.referpostsUrl}
                          referType="list"
                          selected={that.state.referposts}
                          ref={ref => this._dutyrefers = ref}
                          multiple={true}
                        />
                        </div>
                    </div>
                    <div  className={that.state.isuser ? 'col-md-3' : 'hide'} style={{"padding": '24px 0 0 15px'}}>
                      <Button bsStyle="primary" onClick={that.selectUser.bind(this)}>筛选</Button>
                    </div>
                  </div>
                  <div className={that.state.isuser ? 'row mb20' : 'hide'}>
                    <div className="col-md-12">
                      <span className="screen-condition">用户列表</span>
                    </div>
                  </div>
                  <div className={that.state.isuser ? 'row' : 'hide'}>
                  <Grid
                     ref={(c) => { that[`griduser`] = c; }}
                    selectRow={{
                      mode: 'checkbox',
                      onSelect: that.handleSelect.bind(this),
                      onSelectAll: that.handleSelectAll.bind(this)
                    }}
                    columnsModel={that.props.fuserColumn.toJS()}
                    tableData={that.props.fuserList.toJS()}
                    className="standard-grid"
                  />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={that.cancelFn.bind(this)}>取消</Button>
                  <Button bsStyle="primary" onClick={that.sureFn.bind(this)}>确定</Button>
              </Modal.Footer>
          </Modal>
        </div>

    )
        ;
  }
  isUserChecked(){
    let that = this
    that.setState({
      isuser: !that.state.isuser
    })
  }
  selectUser(){
    let that = this
    let data = {}
    if(that.state.referdepts.length==0 && that.state.referposts.length ==0 && that.state.referranks==0){
      return;
    }
    data.deptids = that.state.referdepts.map((item)=>{
      return item.id
    })
    data.postpks = that.state.referposts.map((item)=>{
      return item.id
    })
    data.rankpks = that.state.referranks.map((item)=>{
      return item.id
    })
    this.props.getfilternodeexpensestandarduser(data);
  }
  handleSelect(rowIdx, rowObj, selected, event, selectedRows){
    let that = this
    let flag = -1;
    that.FlightsUserList.forEach((item,index)=>{
      if(item.userid==rowObj.userid){
        flag = index
      }
    })
    if(selected && flag==-1){
      let obj = JSON.parse(JSON.stringify(rowObj))
      that.FlightsUserList.push(obj)
    }
    if(!selected && flag>=0){
      that.FlightsUserList.splice(flag,1);
    }
  }
  handleSelectAll(tableData, selected/* , event, selectedRowsObj */){
    let that = this
    if(selected){
      tableData.forEach((item)=>{
        let flag = false;
        that.FlightsUserList.forEach((aitem)=>{
          if(item.userid==aitem.userid){
            flag=true
          }
        })
        if(!flag){
          let obj = JSON.parse(JSON.stringify(item))
          that.FlightsUserList.push(obj)
        }
      })
    }else{
      for(let i = that.FlightsUserList.length-1;i>=0;i--){
        tableData.map((item)=>{
          if(item.userid==that.FlightsUserList[i].userid){
            that.FlightsUserList.splice(i,1);
          }
        })
      }
    }
  }
  setCheckData(bodyListData){
    let that = this;
    that.props.getfilternodeexpensestandarduser({isflag:true});
    that.FlightsUserList= []
  }
}

export  default TrainAddorEdit;
