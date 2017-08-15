/**
 * U8 & U9 系统配置
 * chenliw@yonyou.com
 */
import React from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal,Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import loadStore from '../../stores/systemIntegration/LeadStore';

import LeadPage from '../../components/systemIntegration/Lead' ;
import Regist from '../../components/systemIntegration/Regist' ;
import Sync from '../../components/systemIntegration/Sync' ;
import Deploy from '../../components/systemIntegration/Deploy' ;

const lstore = new loadStore();
@observer
class Lead extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            isShow:[true,false,false,false]  ,//初始化页面展示状态依次为 引导、注册、同步、配置。true展示
            modalShow:true,
            SyncProgressid:null,
            Sync:{
              send: false, // 同步按钮是否可用
              next: true, //继续同步是否可用
            },
            checkData: [
              {
                id:1,
                label:'项目',
                name:'project',
                tab: 1, // 1 初始化状态，2同步中 3 同步成功 4 同步失败
                state: false, //是否选中 false不选中，true 选中
                progress: 0, //进度条
                func:'syncProject', //同步的方法名
                funcType:'Project', //取消同步的参数
                index:0, //下标
              },{
                id:2,
                label:'部门',
                name:'department',
                tab: 1,
                state: false,
                progress: 0, //进度条
                func:'syncDept',
                funcType:'Dept',
                index:1,
              },{
                id:3,
                label:'银行账户',
                name:'bank',
                tab: 1,
                state: false,
                progress: 0, //进度条
                func:'syncProjectClass',
                funcType:'ProjectClass',
                index:2,
              }
            ], //选中的项
        }
        this.SyncSendBut = this.SyncSendBut.bind(this);
        this.SyncGetData = this.SyncGetData.bind(this);
        this.SyncSend = this.SyncSend.bind(this);
        this.SyncCheckNext = this.SyncCheckNext.bind(this);
        this.SyncProgress = this.SyncProgress.bind(this)
        this.SyncCancel = this.SyncCancel.bind(this);
    }

    componentWillMount(){

        // 判断当前用户是否已经注册，如果注册则直接跳到同步
        lstore.getOsType( () =>{
            var registered =  lstore.osTypeInfo.registered;
            if(registered  == "true"){
                this.setState({
                    isShow:[false , false ,true , false]
                })
            }
        })
    }

    /**
     * param 参数配置说明
     * 0  引导     1 注册    2 同步   3 配置
     * @param param
     */

    changeShow = (param ) =>{
        if(!param){return;}
        this.nextPage(param);
    }

    nextPage =(param) =>{
      console.log(param);
        let isShow = this.state.isShow ;
        isShow.map( ( value , index ) =>{
            isShow[index] = false;
            if( param == index ){
                isShow[index] = true ;
            }
        })
        this.setState({
            isShow : isShow
        })
    }

    //头部控制，哪一步需要展示
    setHeader = () => {
        let isShow = this.state.isShow;
        if(isShow[0] == true ){
            return ("")
        }else if(isShow[2] == true ){
            return (
              <Modal.Header closeButton>
                <Modal.Title>ERP档案同步</Modal.Title>
              </Modal.Header>)
        }else{
            return (
                <Modal.Header closeButton>
                    <Modal.Title>ERP注册</Modal.Title>
                </Modal.Header>
            )
        }
    }

    //尾部控制，哪一步需要展示
    setFooter = () =>{
        let isShow = this.state.isShow;
        if(isShow[0] == true ||isShow[1] == true  ){
            return ("")
        }else if(isShow[2] == true ){
          return (
              <Modal.Footer style={{'textAlign':'center'}}>
                  <Button onClick={this.state.Sync.send ? this.SyncSendBut.bind(this) : void(0)} className={this.state.Sync.send ? 'btn btn-primary' : 'btn btn-primary disabled'}>同步</Button>
                  <Button onClick={this.state.Sync.next ? this.changeShow.bind(this,3) : void(0)} className={this.state.Sync.next ? 'btn btn-primary' : 'btn btn-primary disabled'}>继续同步</Button>
              </Modal.Footer>
          )
        }else{
            return (
                <Modal.Footer>
                    <Button onClick ={this.modalClose}>取消</Button>
                    <Button bsStyle="primary">确定</Button>
                </Modal.Footer>
            )
        }
    }

    modalClose =() =>{
        this.setState({
            modalShow:false
        })
    }

    SyncCancel(item){
      lstore.cancelSync({type:item.funcType},()=>{

      })
    }
    SyncCheckNext(){
      let that = this;
      let checkData = that.state.checkData;
      let Sync = Object.assign({},that.state.Sync);
      let flag = false;
      checkData.map((item)=>{
        if(item.tab===2){
          flag=true;
        }
      })
      Sync.next = !flag;
      that.setState({
        Sync:Sync
      })
    }
    SyncSend(item){
      let that = this;
      let Sync = Object.assign({},that.state.Sync);
      let func = {
        project:'project',
        name:'department',
      }
      Sync.next = false;
      that.setState({
        Sync:Sync
      })
      lstore[item.func]({},(type)=>{
        let checkData = Object.assign([],that.state.checkData);
        if(checkData[item.index].tab == 2){
          item.tab = type===0 ? 3 : 4
          checkData[item.index] = item;
          that.setState({
            checkData: checkData
          },()=>{
            that.SyncCheckNext()
          })
        }
      })
      // if(item.id===1){
      //   lstore.syncProject({},(type)=>{
      //     let checkData = Object.assign([],that.state.checkData);
      //     if(checkData[0].tab == 2){
      //       item.tab = type===0 ? 3 : 4
      //       checkData[0] = item;
      //       that.setState({
      //         checkData: checkData
      //       },()=>{
      //         that.SyncCheckNext()
      //       })
      //     }
      //   })
      // }
      // if(item.id===2){
      //   lstore.syncDept({},(type)=>{
      //     let checkData = Object.assign([],that.state.checkData);
      //     if(checkData[1].tab == 2){
      //       item.tab = type===0 ? 3 : 4
      //       checkData[1] = item;
      //       that.setState({
      //         checkData: checkData
      //       },()=>{
      //         that.SyncCheckNext()
      //       })
      //     }
      //   })
      // }
      // if(item.id===3){
      //   lstore.syncProjectClass({},(type)=>{
      //     let checkData = Object.assign([],that.state.checkData);
      //     if(checkData[2].tab == 2){
      //       item.tab = type===0 ? 3 : 4
      //       checkData[2] = item;
      //       that.setState({
      //         checkData: checkData
      //       },()=>{
      //         that.SyncCheckNext()
      //       })
      //     }
      //   })
      // }
    }
    SyncProgress(data){
      let that = this;
      let SyncProgressid = that.state.SyncProgressid
      if(SyncProgressid){
        clearInterval(SyncProgressid)
      }
      SyncProgressid = setInterval(function(){
        let flag = false
        data.map((d)=>{
          if(d.tab===2 && d.progress<0.9){
            flag=true
            d.progress=d.progress+0.1
          }
        })
        if(!flag){
          clearInterval(SyncProgressid)
          that.setState({
            SyncProgressid:SyncProgressid
          })
        }
        let checkData = Object.assign([],data);
        that.setState({
          checkData:checkData
        })
      },500)
      that.setState({
        SyncProgressid:SyncProgressid
      })
    }
    SyncSendBut(){
      let that = this;
      let checkData = Object.assign([],that.state.checkData)
      let data = checkData.map((item)=>{
        if(item.state && item.tab === 1){
          item.tab = 2;
          item.progress=0;
          that.SyncSend(item)
          // 请求接口
        }
        return item;
      })
      that.setState({
        checkData:data
      },()=>{
        that.SyncProgress(data)
      })
      //发送请求监控状态
    }
    SyncGetData(data){
      let that = this;
      let Sync = Object.assign({},that.state.Sync)
      let send = data.some((item)=>{
        return item.state;
      })
      if(send){
        Sync['send'] = true
      }else{
        Sync['send'] = false
      }
      let checkData = Object.assign([],data);
      that.setState({
        Sync:Sync,
        checkData:checkData
      },()=>{
        that.SyncProgress(checkData)
      })
      // 根据数据 启用同步按钮
    }

    render(){

        if( !lstore.osTypeInfo || lstore.osTypeInfo.code != 0 ){
            return (<div>{ lstore.osTypeInfo.errMsg}</div>)
        }
        return(
            <div>
                <Modal  bsSize="large" show={this.state.modalShow} className="static-modal" onHide={this.modalClose}>
                    {this.setHeader()}
                    <Modal.Body>
                        <LeadPage show={this.state.isShow[0]} changeShow={this.changeShow }/>
                        <Regist show={this.state.isShow[1]} changeShow={this.changeShow }/>
                        <Sync
                          show={this.state.isShow[2]}
                          data={this.state.checkData}
                          SyncGetData={this.SyncGetData}
                          SyncSend={this.SyncSend}
                          SyncCancel={this.SyncCancel} />
                        <Deploy show={this.state.isShow[3]} changeShow={this.changeShow }/>
                    </Modal.Body>
                    {this.setFooter()}
                </Modal>
            </div>
        )
    }




}
export  default Lead ;
