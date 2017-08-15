/**
 * 机票报销标准 组件
 * author:zhangtongchuan
 * date: 2017-05-23
 * mail: zhangtch@yonyou.com
 * api:
 */
import React from 'react';
import {Link} from 'react-router';
import {Grid} from 'ssc-grid'
import mobx from 'mobx';
import {observer} from 'mobx-react';
import { Thumbnail,Modal,Button,Grid as ReactGrid,Row as ReactRow,Col as ReactCol } from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import DetailsAjaxStore from '../../stores/bill/DetailsAjaxStore';
//import "./Details.less"

const detailsAjaxStore = new DetailsAjaxStore();
@observer
export default class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type: this.props.params.type,
      pk: this.props.params.pk,
      audit: this.props.params.audit,
      isVisible:false,
      isVisibleHistory:false,
      isVisibleAudit: false,
    }
    this.attachment = this.attachment.bind(this);
    this.historyEvent = this.historyEvent.bind(this);
    this.auditEvent = this.auditEvent.bind(this);
  }
  componentDidMount(){
    let that = this;
    detailsAjaxStore.queryBillDetailsData({
      type:that.state.type,
      pk:that.state.pk,
      approve:that.state.audit==1 ? '0' : ''
    });

  }
  render(){
    let that = this;
    return (
      <div className="content" style={{paddingBottom:"50px"}}>
        <div className="container-fluid">
          <div className="details_title">{detailsAjaxStore.DetailsTitle[that.state.type]}</div>
          <div className="stdreimburse-box">
            <div className="row">
            {detailsAjaxStore.headerListData.map((item,index)=>{
              return (
                <div key={'header'+index} className="col-md-4 col-sm-4 col-xs-4 details-h">
                  <div className="details-h-t">{item.name}</div>
                  <div className="details-h-v">{item.value}</div>
                </div>
              )
            })}
            </div>
          </div>
          <div className={detailsAjaxStore.bodyListData.length>0 ? 'stdreimburse-box' : 'stdreimburse-box hide'}>
            <b>明细：共{detailsAjaxStore.total.totalCount}条，合计：￥{detailsAjaxStore.total.totalMoney}</b>
          </div>
          {
            that.state.type=='sq' && (
              <div className="stdreimburse-box">
                <div className="row">
                  {
                    detailsAjaxStore.bodyListData.map((item,index)=>{
                      return (
                        <div key={'header'+index} className="col-md-4 col-sm-4 col-xs-4 details-h">
                          <div className="details-h-t">{item.infoTypeCN}</div>
                          <div className="details-h-v">{detailsAjaxStore.formatCurrency(item.totalMoney)}</div>
                        </div>
                      )
                    })
                  }
              </div>
            </div>
            )
          }
          {that.state.type!='sq' && detailsAjaxStore.bodyListData.map((item,index)=>{
            return (
              <div key={'body'+index} className="details_table">
                <div className="row details_table_t">{item.infoTypeCN}{item.totalCount}次，金额：￥{detailsAjaxStore.formatCurrency(item.totalMoney)}</div>
                <Grid
                  columnsModel={detailsAjaxStore.DetailsTableColumn[item.infoType].toJS()}
                  tableData={item.infoList.toJS()}
                  className="standard-grid"
                />
              </div>
            )
          })}
          {detailsAjaxStore.isRendercShare ? (
              <div className="details_table">
                <Grid
                  columnsModel={detailsAjaxStore.DetailsTableColumn["cShare"].toJS()}
                  tableData={detailsAjaxStore.cShareListData.toJS()}
                  className="standard-grid"
                />
              </div>
            ):(<div></div>)
          }

          {detailsAjaxStore.isRenderSubsidy ? (
            <div className="details_table">
              <Grid
                columnsModel={detailsAjaxStore.DetailsTableColumn["subsidy"].toJS()}
                tableData={detailsAjaxStore.subsidyData.toJS()}
                className="standard-grid"
              />
            </div>):(<div></div>)
          }


        </div>
          {that.state.audit==0 && detailsAjaxStore.attachments.length >= 0 && (
            <div className="btn-bottom-fixed">
                <div className="row btn-bottom">
                  <div className="col-sm-12">
                    <button type="button" onClick={that.attachment} className='btn btn-default fl'>附件<span className="badge">{detailsAjaxStore.attachments.length}</span></button>
                  </div>
                </div>
              </div>
          )}
          {that.state.audit==1 && (<div className="btn-bottom-fixed">
            <div className="row btn-bottom">
              <div className="col-sm-12">
                <button type="button" onClick={that.auditEvent} className='btn btn-primary fr'>审批</button>
                {detailsAjaxStore.attachments.length > 0 && <button type="button" onClick={that.attachment} className='btn btn-default fl'>附件<span className="badge">{detailsAjaxStore.attachments.length}</span></button>}
              </div>
            </div>
            </div>
          )}
          {that.state.audit==2 && (<div className="btn-bottom-fixed">
            <div className="row btn-bottom">
              <div className="col-sm-12">
                <button type="button" onClick={that.historyEvent} className='btn btn-primary fr'>审批历史</button>
                {detailsAjaxStore.attachments.length > 0 && <button type="button" onClick={that.attachment} className='btn btn-default fl'>附件<span className="badge">{detailsAjaxStore.attachments.length}</span></button>}
              </div>
            </div>
            </div>
          )}
          <Modal show={that.state.isVisibleAudit} onHide={that.close.bind(this,'isVisibleAudit')} className="static-modal">
              <Modal.Header closeButton={true}>
                  <Modal.Title style={{textAlign:'left'}}>审批</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{overflow:'auto'}}>
                <textarea ref="AuditText" className="form-control" rows="3"></textarea>
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="primary" onClick={that.close.bind(this,'isVisibleAudit','ok')}>批准</Button>
              </Modal.Footer>
          </Modal>
          <Modal show={that.state.isVisibleHistory} onHide={that.close.bind(this,'isVisibleHistory')} className="static-modal">
              <Modal.Header closeButton={true}>
                  <Modal.Title style={{textAlign:'left'}}>审批历史记录</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{overflow:'auto'}}>
                <Grid
                  columnsModel={detailsAjaxStore.historyEventListColumns.toJS()}
                  tableData={detailsAjaxStore.historyEventListData.toJS()}
                  className="standard-grid"
                />
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="primary" onClick={that.close.bind(this,'isVisibleHistory')}>确定</Button>
              </Modal.Footer>
          </Modal>
          <Modal show={that.state.isVisible} onHide={that.close.bind(this,'isVisible')} className="static-modal">
              <Modal.Header closeButton={true}>
                  <Modal.Title style={{textAlign:'left'}}>附件</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{overflow:'auto'}}>
                <ReactGrid>
                  <ReactRow>
                  {
                    detailsAjaxStore.attachments.map((item)=>{
                      return (
                        <ReactCol xs={6} md={4}>
                        <a href={item} target="_blank">
                          <Thumbnail src={item} alt={item} title={item}>
                            {/**<h3>收据</h3>
                            <p>张三 2019-05-03</p>*/}
                          </Thumbnail>
                          </a>
                        </ReactCol>
                      )
                    })
                  }
                  </ReactRow>
                </ReactGrid>
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="primary" onClick={that.close.bind(this,'isVisible')}>确定</Button>
              </Modal.Footer>
          </Modal>


      </div>
    )
  }
  close(type,sub){
    let that = this;
    let state = Object.assign({},that.state)
    state[type]=false
    that.setState(state)
    if(type==='isVisibleAudit' && sub==='ok'){//如果是批准
      let val = that.refs.AuditText.value
      let data = detailsAjaxStore.approveData
      data.comment = val
      detailsAjaxStore.sendApprove({data:{
        comment:val,
        action:0,
        taskid:data[0].taskinfo.taskid,
        otherinfo:data[0].taskinfo,
        billinfo:data[0].billinfo
      }})
      this.refs.AuditText.value=""
    }
  }

  attachment(){
    let that = this;
    that.setState({
      isVisible:true
    })
  }
  //审批
  auditEvent(){
    let that = this;
    that.setState({
      isVisibleAudit:true
    })
  }
  historyEvent(){
    let that = this;
    detailsAjaxStore.historyEventList({
      businessKey : that.state.pk
    })
    that.setState({
      isVisibleHistory:true
    })
  }
}
