import React from 'react';
import {Refers} from 'ssc-refer';
import Config from '../../config'
import Util from '../../common/utils';
// Config.webreimburse.webReferUrl='http://127.0.0.1:88/nodebillpay/referJSON'
export default class BillEditShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subsidiesData:'',
      bodyListData:'',
      dmoney:0
    }
  }

  componentWillReceiveProps(nextProps) {
    let that = this;
    let subsidiesData = JSON.stringify(nextProps.subsidiesData)
    let bodyListData = JSON.stringify(nextProps.bodyListData)
    if(subsidiesData!=that.state.subsidiesData || bodyListData!=that.state.bodyListData){
      let totalMoney = 0;
      nextProps.bodyListData.map((item)=>{
        item.data.map((ditem)=>{
          totalMoney = totalMoney + ditem.money
        })
      })
      totalMoney = totalMoney + (isNaN(Number(nextProps.subsidiesData.total)) ? 0 : Number(nextProps.subsidiesData.total))
      let dmoney = 0
      let shareData = JSON.parse(JSON.stringify(nextProps.shareData))
      if(shareData.length==1){
        shareData[0].money.data = totalMoney
        dmoney=totalMoney
      }else{
        shareData.forEach((item)=>{
          dmoney=dmoney+ Number(shareData.money)
        })
      }
      that.setState({
        subsidiesData:subsidiesData,
        bodyListData:bodyListData,
        dmoney: totalMoney-dmoney
      })
      that.props.setStateData({shareData:shareData})
    }
  }

  referHandleChange(index,name,item,value){
    let that = this;
    let shareData = JSON.parse(JSON.stringify(that.props.shareData))
    shareData[index][name].data = value
    that.props.setStateData({shareData:shareData})
  }
  inputChange(index,name,item,event){
    let that = this;
    let shareData = JSON.parse(JSON.stringify(that.props.shareData))
    shareData[index][name].data = event.target.value
    let totalMoney = 0;
    that.props.bodyListData.map((item)=>{
      item.data.map((ditem)=>{
        totalMoney = totalMoney + ditem.money
      })
    })

    totalMoney = totalMoney + (isNaN(Number(that.props.subsidiesData.total)) ? 0 : Number(that.props.subsidiesData.total))

    let dmoney = 0
    shareData.forEach((item)=>{
      dmoney=dmoney+ Number(item.money.data)
    })

    that.setState({
      dmoney:totalMoney - dmoney
    })

    that.props.setStateData({shareData:shareData})
  }


  inputBlur(index,name,item,event){
    let that = this;
    let shareData = JSON.parse(JSON.stringify(that.props.shareData))
    shareData[index][name].data =Util.formatCurrency(event.target.value);
    let totalMoney = 0;
    that.props.bodyListData.map((item)=>{
      item.data.map((ditem)=>{
        totalMoney = totalMoney + ditem.money
      })
    })

    totalMoney = totalMoney + (isNaN(Number(that.props.subsidiesData.total)) ? 0 : Number(that.props.subsidiesData.total))

    let dmoney = 0
    shareData.forEach((item)=>{
      dmoney=dmoney+ Number(item.money.data)
    })

    that.setState({
      dmoney:totalMoney - dmoney
    })

    that.props.setStateData({shareData:shareData})
  }


  addListData(){
    let that = this;
    let shareData = JSON.parse(JSON.stringify(that.props.shareData))
    shareData.unshift({
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
    })
    that.props.setStateData({shareData:shareData})
  }
  deleteItem(index){
    let that = this;
    let shareData = JSON.parse(JSON.stringify(that.props.shareData))
    shareData.splice(index,1);

    let totalMoney = 0;
    that.props.bodyListData.map((item)=>{
      item.data.map((ditem)=>{
        totalMoney = totalMoney + ditem.money
      })
    })

    totalMoney = totalMoney + (isNaN(Number(that.props.subsidiesData.total)) ? 0 : Number(that.props.subsidiesData.total))

    let dmoney = 0
    shareData.forEach((item)=>{
      dmoney=dmoney+ Number(item.money.data)
    })

    that.setState({
      dmoney:totalMoney - dmoney
    })

    that.props.setStateData({shareData:shareData})
  }
  componentWillMount(){

  }
  render() {
    let that = this;
    let titleStyle = {
      lineHeight: '35px',
      fontSize: '16px',
      fontWeight: 'bold'
    }
    let inputStyle={
      width: '100%',
      border: 0,
      outline: 'none',
      height: '35px'
    }

    return (
        <div className={that.props.BillTypeDataItem.costShared ? 'stdreimburse-box' : 'hide' }>
          <h3 style={titleStyle}>费用归属 <span style={{fontSize:'14px',fontWeight:'normal'}}>待分摊 {Util.formatCurrency(that.state.dmoney)}</span></h3>
          {that.props.shareData.map((item,index)=>{
            return (
              <div key={'share'+index} className={index == (that.props.shareData.length-1) ? 'row listhoaver': 'row listhoaver assignment'}>
                <div className="col-md-4 col-sm-4 col-xs-4 details-h">
                  <div className="details-h-t">{item.dw.name}</div>
                  <Refers
                   key={Math.random()}
                    labelKey="name"
                    emptyLabel='暂无数据'
                    onChange={that.referHandleChange.bind(this,index,'dw',item)}
                    placeholder="请选择..."
                    referConditions={{"refType":"table","refCode":item.dw.code,"rootName":item.dw.name,"displayFields":["id","name"]}}
                    referDataUrl={Config.webreimburse.webReferUrl}
                    referType="list"
                    selected={item.dw.data}
                    multiple={false}
                  />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 details-h">
                  <div className="details-h-t">{item.bm.name}</div>
                  <Refers
                   key={Math.random()}
                    disabled={item.dw.data.length>0 ? false : true}
                    labelKey="name"
                    emptyLabel='暂无数据'
                    onChange={that.referHandleChange.bind(this,index,'bm',item)}
                    placeholder="请选择..."
                    referConditions={{"refType":"table","refCode":item.bm.code,"rootName":item.bm.name,"displayFields":["id","name"]}}
                    referDataUrl={Config.webreimburse.webReferUrl}
                    referType="list"
                    selected={item.bm.data}
                    multiple={false}
                  />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 details-h">
                  <div className="details-h-t">{item.money.name}</div>
                  <div className="details-h-v" style={{height: '36px'}}>
                    <input style={inputStyle} value={item.money.data} onChange={that.inputChange.bind(this,index,'money',item)} onBlur={that.inputBlur.bind(this,index,'money',item)} type="text" />
                  </div>
                </div>
                <span onClick={that.deleteItem.bind(this,index)} className="assignment-cancel"></span>
              </div>
            )
          })}


          <div className="row">
            <div className="col-sm-12">
              <button type="button" onClick={that.addListData.bind(this)} className='btn btn-primary fr'>添加分摊信息</button>
            </div>
          </div>
        </div>
    )
  }
}
