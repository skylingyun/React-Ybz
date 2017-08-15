/*
 * web端填报 导入页面
 * dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore from '../../stores/webreimburse/WebreImburseStore';

// const stores = new WebreImburseStore();
const store = WebreImburseStore
@observer
export default class WebImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}

  }
  componentDidMount() {

  }
  test(){
    // console.log(store.getLoanBillItemInformationData.length);
    // let getLoanBillItemInformationData = store.getLoanBillItemInformationData
    console.log(JSON.stringify(store.getLoanBillItemInformationData));
    store.getLoanBillItemInformationData.push({"source_edit":false,"source_input":true,"dest_property_name":"money","source_type":"1200","source_code":"money","source_name":"金额"})
    // store.getLoanBillItemInformationData= Object.assign([],getLoanBillItemInformationData)
    // console.log(store.getLoanBillItemInformationData.length);
  }
  render() {
    let inputStyle = {
      width: '100%',
      border: 0,
      outline: 'none'
    }
    console.log(store.getLoanBillItemInformationData);
    return (
        <div className="content" style={{paddingBottom:"50px"}}>
          <div className="container-fluid">
            <div className="details_title">报销单</div>
            <div className="details_table details_table_b">
              <div className="row details_table_t">住宿 3 次，金额：￥2,230.00</div>
              <div className="webimport-grid">
                <table className="table">
                  <thead>
                  <tr>
                    <th><input type="checkbox"/></th>
                    <th>地点</th>
                    <th>酒店名称</th>
                    <th>住宿日期</th>
                    <th className="text-right">报账金额</th>
                    <th>标签</th>
                    <th>来源</th>
                    <th>企业支付</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><input type="checkbox"/></td>
                    <td title="飞机">飞机</td>
                    <td title="阿克苏-阿克苏机场--阿拉善右旗-阿拉善右旗机场">阿克苏-阿克苏机场--阿拉善右旗-阿拉善右旗机场</td>
                    <td title="2017-6-1--2017-6-1">2017-6-1--2017-6-1</td>
                    <td className="text-right" title="2,233.00">2,233.00</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="details_table details_table_b" style={{"marginTop":"31px"}}>
              <div className="row details_table_t">交通 3 次，金额：￥2,233.00</div>
              <div className="webimport-grid">
                <table className="table">
                  <thead>
                  <tr>
                    <th><input type="checkbox"/></th>
                    <th>交通工具</th>
                    <th>路线</th>
                    <th>日期</th>
                    <th className="text-right">报账金额</th>
                    <th>标签</th>
                    <th>来源</th>
                    <th>企业支付</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td><input type="checkbox"/></td>
                    <td title="飞机">飞机</td>
                    <td title="阿克苏-阿克苏机场--阿拉善右旗-阿拉善右旗机场">阿克苏-阿克苏机场--阿拉善右旗-阿拉善右旗机场</td>
                    <td title="2017-6-1--2017-6-1">2017-6-1--2017-6-1</td>
                    <td className="text-right" title="2,233.00">2,233.00</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="btn-bottom-fixed">
            <div className="row btn-bottom">
              <div className="col-sm-12">
                <button type="button" onClick={this.test.bind(this)} className='btn btn-primary fr'>确定</button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}
