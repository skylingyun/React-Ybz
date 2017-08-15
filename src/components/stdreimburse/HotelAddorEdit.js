/*
 * 住宿报销标准 新增、编辑组件
 * */
import React from 'react';
import {Refers} from 'ssc-refer';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import mobx from 'mobx';
import Config from '../../config';
import {DatePicker,Grid} from 'ssc-grid';
export default class HotelAddorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.FlightsUserList=[]
    this.state = {
      nameValue: "",
      focus: false,
      posts: [], //职位
      ranks: [], //职级
      itemData: {},
      CityLevel: [],
      referposts: [], //职位
      referranks: [], //职级
      citylevel1: "",
      citylevel2: "",
      citylevel3: "",
      citylevel4: "",
      isVisible: false,
      depts: [], //部门
      referdepts:[],
      fuserList: [],
      isuser: false,
      itemDataString: ''
    }
    this.cancelClick = this.cancelClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCityLevel1 = this.handleChangeCityLevel1.bind(this);
    this.handleChangeCityLevel2 = this.handleChangeCityLevel2.bind(this);
    this.handleChangeCityLevel3 = this.handleChangeCityLevel3.bind(this);
    this.handleChangeCityLevel4 = this.handleChangeCityLevel4.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.addUserList = this.addUserList.bind(this);
    this.CheckedState = this.CheckedState.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
    this.inputOnBlur = this.inputOnBlur.bind(this);
    this.setCheckData = this.setCheckData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let that = this;
    if(nextProps.cityLevel!=that.state.cityLevel){
      that.setState({
        CityLevel:nextProps.CityLevel
      })
    }
    if(that.state.itemDataString != JSON.stringify(nextProps.itemData)){
      let nameValue = nextProps.itemData && nextProps.itemData.name ? nextProps.itemData.name : ""
      let citylevel1 = nextProps.itemData && nextProps.itemData.citylevel1 ? nextProps.itemData.citylevel1 : ""
      let citylevel2 = nextProps.itemData && nextProps.itemData.citylevel2 ? nextProps.itemData.citylevel2 : ""
      let citylevel3 = nextProps.itemData && nextProps.itemData.citylevel3 ? nextProps.itemData.citylevel3 : ""
      let citylevel4 = nextProps.itemData && nextProps.itemData.citylevel4 ? nextProps.itemData.citylevel4 : ""
      that.setState({
        itemDataString: JSON.stringify(nextProps.itemData),
        itemData:nextProps.itemData,
        nameValue:nameValue,
        citylevel1:citylevel1,
        citylevel2:citylevel2,
        citylevel3:citylevel3,
        citylevel4:citylevel4,
        posts:nextProps.itemData && nextProps.itemData.posts ? nextProps.itemData.posts.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          // dItem.code=item.pk;
          // dItem.isLeaf = "true";
          // dItem.pid = "";
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        referposts:nextProps.itemData && nextProps.itemData.posts ? nextProps.itemData.posts.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          // dItem.code=item.pk;
          // dItem.isLeaf = "true";
          // dItem.pid = "";
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        ranks:nextProps.itemData && nextProps.itemData.ranks ? nextProps.itemData.ranks.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          // dItem.code=item.pk;
          // dItem.isLeaf = "true";
          // dItem.pid = "";
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        referranks:nextProps.itemData && nextProps.itemData.ranks ? nextProps.itemData.ranks.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          // dItem.code=item.pk;
          // dItem.isLeaf = "true";
          // dItem.pid = "";
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        depts: nextProps.itemData && nextProps.itemData.depts ? nextProps.itemData.depts.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        referdepts: nextProps.itemData && nextProps.itemData.depts ? nextProps.itemData.depts.map((item)=>{
          let dItem = {}
          dItem.id=item.pk;
          dItem.name=item.name?item.name:"";
          return dItem
        }) : [],
        isuser: nextProps.itemData && nextProps.itemData.relationuserflag == 'Y' ? true : false,
        fuserList: nextProps.itemData && nextProps.itemData.users ? nextProps.itemData.users : []
      }, () => {
        if (that.state.nameValue) {
          if (that.state.nameValue) {
            that.titleName.style.top = '-10px';
          } else {
            that.titleName.style.top = '5px';
          }
        }

        if (that.state.citylevel1) {
          if (that.state.citylevel1) {
            that.titleNameCityOne.style.top = '-10px';
          } else {
            that.titleNameCityOne.style.top = '5px';
          }
        }

        if (that.state.citylevel2) {
          if (that.state.citylevel2) {
            that.titleNameCityTwo.style.top = '-10px';
          } else {
            that.titleNameCityTwo.style.top = '5px';
          }
        }

        if (that.state.citylevel3) {
          if (that.state.citylevel3) {
            that.titleNameCityThree.style.top = '-10px';
          } else {
            that.titleNameCityThree.style.top = '5px';
          }
        }

        if (that.state.citylevel4) {
          if (that.state.citylevel4) {
            that.titleNameCityFour.style.top = '-10px';
          } else {
            that.titleNameCityFour.style.top = '5px';
          }
        }

      });
    }

  }

  CheckedState(event) {
    let that = this;
    let val = event.target.value;
  }



  cancelClick() {
    let that = this;
    globalStore.showCancelModel("您是否要放弃当前操作？", ()=> {
    }, ()=> {
      that.props.setTabPage(1);
    });
  }

  referHandleChange(type,tempArray){
    // console.log(selected);
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
      // let referranks = selected.map((item)=>{
      //   return {
      //     pk:item.id,
      //     id:item.id,
      //     name:item.name
      //   }
      // })
      that.setState({
        referranks:selected
      })
    }
    if(type=='posts'){
      // let referposts = selected.map((item)=>{
      //   return {
      //     pk:item.id,
      //     id:item.id,
      //     name:item.name
      //   }
      // })
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

  // 取消按钮
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

  // 确认按钮
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

  /* 新增用户按钮 */
  addUserList() {
    let that = this;
    that.setCheckData();
    that.setState({
      isVisible: true
    });
  }
  // addUserList() {
  //   let that = this;
  //   globalStore.showCancelModel((
  //       <div className="stdreimburse-box">
  //         <div className="row mb20">
  //           <div className="col-md-12">
  //             <span className="screen-condition">筛选条件</span>
  //           </div>
  //         </div>
  //         <div className="row">
  //           <div className="col-md-6">
  //             <label className="screen-condition-label">职级</label>
  //             <div>
  //               <Refers
  //                   labelKey="name"
  //                   onChange={this.referHandleChange.bind(this,'ranks')}
  //                   placeholder="请选择..."
  //                   referConditions={{"refType":"tree","rootName":"职级","displayFields":["code","name"]}}
  //                   referDataUrl={Config.stdreimburse.referranksUrl}
  //                   referType="tree"
  //                   defaultSelected={mobx.toJS(that.state.referranks)}
  //                   ref={ref => this._myrefers = ref}
  //                   multiple={true}
  //               />
  //             </div>
  //           </div>
  //           <div className="col-md-6">
  //             <label className="screen-condition-label">职务</label>
  //             <div>
  //               {/*//"http://127.0.0.1:88/mapping/json"*/}
  //               <Refers
  //                   labelKey="name"
  //                   onChange={this.referHandleChange.bind(this,'posts')}
  //                   placeholder="请选择..."
  //                   referConditions={{"refType":"tree","rootName":"职级","displayFields":["code","name"]}}
  //                   referDataUrl={Config.stdreimburse.referpostsUrl}
  //                   referType="tree"
  //                   defaultSelected={that.state.referposts}
  //                   ref={ref => this._myrefers = ref}
  //                   multiple={true}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //   ), ()=> {
  //     // 取消
  //     let posts = that.state.posts;
  //     let ranks = that.state.ranks;
  //     that.setState({
  //       referposts:posts,
  //       referranks:ranks
  //     })
  //   }, ()=> {
  //     // 确定
  //     let referposts = that.state.referposts;
  //     let referranks = that.state.referranks;
  //     that.setState({
  //       posts:referposts,
  //       ranks:referranks
  //     })
  //   });
  // }

  submitClick() {
    let that = this;
    let data = {};
    data.citys = [];
    let msg = [];

    data.name = that.state.nameValue;
    data.posts = that.state.posts.map((item)=>item.id);
    data.ranks = that.state.ranks.map((item)=>item.id);
    data.depts = that.state.depts.map((item)=>item.id);
    data.users = that.state.fuserList.map((item)=>item.userid)
    data.relationuserflag = that.state.isuser ? 'Y' : 'N'
    /**

    if(that.state.citylevel1.length!=0) data.citys.push({"citylevel":"1", "citymny": that.state.citylevel1+""});
    if(that.state.citylevel2.length!=0) data.citys.push({"citylevel":"2", "citymny": that.state.citylevel2+""});
    if(that.state.citylevel3.length!=0) data.citys.push({"citylevel":"3", "citymny": that.state.citylevel3+""});
    if(that.state.citylevel4.length!=0) data.citys.push({"citylevel":"4", "citymny": that.state.citylevel4+""});
     *
     */
    if(!data.name){
      msg.push(<li>标准名称不能为空！</li>)
    }
    if(that.state.citylevel1.length!=0){
      data.citys.push({"citylevel":"1", "citymny": that.state.citylevel1+""});
    }else{
      msg.push(<li>请设置一线城市标准金额！</li>)
    }
    if(that.state.citylevel2.length!=0){
      data.citys.push({"citylevel":"2", "citymny": that.state.citylevel2+""});
    }else{
      msg.push(<li>请设置二线城市标准金额！</li>)
    }
    if(that.state.citylevel3.length!=0){
      data.citys.push({"citylevel":"3", "citymny": that.state.citylevel3+""});
    }else{
      msg.push(<li>请设置三线城市标准金额！</li>)
    }
    if(that.state.citylevel4.length!=0){
      data.citys.push({"citylevel":"4", "citymny": that.state.citylevel4+""});
    }else{
      msg.push(<li>请设置四线及以下城市标准金额！</li>)
    }

    // if(data.posts.length==0){
    //   msg.push(<li>请选择职级！</li>)
    // }
    // if(data.ranks.length==0){
    //   msg.push(<li>请选择职务！</li>)
    // }

    data.policyexpensetype='stay';
    data.posts = that.state.posts.map((item)=>item.id);
    data.ranks = that.state.ranks.map((item)=>item.id);
    if(that.state.itemData && that.state.itemData.ts){
      data.ts = that.state.itemData.ts;
    }
    if(msg.length>0){

      globalStore.showModel(msg)
      return;
    }

    if(that.state.itemData && that.state.itemData.id){
      data.id = that.state.itemData.id;
      data.code = that.state.itemData.code;
      that.props.dataAddOrUpdate(1,data,(type)=>{
        if(type==1){
          that.props.setTabPage(1);
        }
      });
    }else{
      that.props.dataAddOrUpdate(0,data,(type)=>{
        if(type==1){
          that.props.setTabPage(1);
        }
      });
    }
  }

  handleChange(e) {
    this.setState({nameValue: e.target.value});
  }

  handleChangeCityLevel1(e) {
    this.setState({citylevel1: e.target.value});
  }

  handleChangeCityLevel2(e) {
    this.setState({citylevel2: e.target.value});
  }

  handleChangeCityLevel3(e) {
    this.setState({citylevel3: e.target.value});
  }

  handleChangeCityLevel4(e) {
    this.setState({citylevel4: e.target.value});
  }

  //input 获取焦点
  inputOnFocus(type) {
    //this.setState({focus: true});
    switch (type) {
      case 0:
        this.titleName.style.top = '-10px';
        break;
      case 1:
        this.titleNameCityOne.style.top = '-10px';
        break;
      case 2:
        this.titleNameCityTwo.style.top = '-10px';
        break;
      case 3:
        this.titleNameCityThree.style.top = '-10px';
        break;
      case 4:
        this.titleNameCityFour.style.top = '-10px';
        break;
      default:
        break;
    }

  }

  //input 失去焦点
  inputOnBlur(type, e) {
    let val = e.target.value;

    switch (type) {
      case 0:
        if (val == '') {
          this.titleName.style.top = '5px';
        }
        break;
      case 1:
        if (val == '') {
          this.titleNameCityOne.style.top = '5px';
        }
        break;
      case 2:
        if (val == '') {
          this.titleNameCityOne.style.top = '5px';
        }
        break;
      case 3:
        if (val == '') {
          this.titleNameCityThree.style.top = '5px';
        }
        break;
      case 4:
        if (val == '') {
          this.titleNameCityFour.style.top = '5px';
        }
        break;
      default:
        break;
    }


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

  render() {
    let that = this;

    return (
        <div className="container-fluid">
          <div className="stdreimburse-box">
            <div className="row">
              <div className="col-md-12">
                <div className="pr">
                  <div ref={(input) => { this.titleName = input; }} className="standard-name-label">标准名称</div>
                  <input className="standard-name-input" type="text" value={that.state.nameValue}
                         onChange={that.handleChange}
                         onBlur={ this.inputOnBlur.bind(this,0) }
                         onFocus={ this.inputOnFocus.bind(this,0) }
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
              <div className="col-md-3 col-sm-6">
                <div className="standard-name">
                  <div ref={(input) => { this.titleNameCityOne = input; }} className="standard-name-label">一线城市标准(元/天)
                  </div>
                  <input className="standard-name-input" type="number" value={that.state.citylevel1}
                         onChange={that.handleChangeCityLevel1.bind(this)}
                         onBlur={ this.inputOnBlur.bind(this, 1) }
                         onFocus={ this.inputOnFocus.bind(this, 1) }
                  />
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="pr">
                  <div ref={(input) => { this.titleNameCityTwo = input; }} className="standard-name-label">二线城市标准(元/天)
                  </div>
                  <input className="standard-name-input" type="number" value={that.state.citylevel2}
                         onChange={that.handleChangeCityLevel2}
                         onBlur={ this.inputOnBlur.bind(this,2) }
                         onFocus={ ::this.inputOnFocus.bind(this,2) }
                  />
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="pr">
                  <div ref={(input) => { this.titleNameCityThree = input; }} className="standard-name-label">
                    三线城市标准(元/天)
                  </div>
                  <input className="standard-name-input" type="number" value={that.state.citylevel3}
                         onChange={that.handleChangeCityLevel3}
                         onBlur={ this.inputOnBlur.bind(this,3) }
                         onFocus={ this.inputOnFocus.bind(this,3) }
                  />
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="pr">
                  <div ref={(input) => { this.titleNameCityFour = input; }} className="standard-name-label">
                    四线及以下城市标准(元/天)
                  </div>
                  <input className="standard-name-input" type="number" value={that.state.citylevel4}
                         onChange={that.handleChangeCityLevel4}
                         onBlur={ this.inputOnBlur.bind(this,4) }
                         onFocus={ this.inputOnFocus.bind(this,4) }
                  />
                </div>
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
                <button type="button" onClick={that.submitClick} className='btn btn-primary fr'>保存</button>
                <button type="button" onClick={that.cancelClick} className='btn btn-default fr'>取消</button>
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
