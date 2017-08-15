/**
 * 引导页
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import leadStore from '../../stores/systemIntegration/LeadStore';

class Lead extends React.Component {

  constructor(props){
    super(props);
    this.leadStore =  new leadStore();
    this.state ={
        osTypeInfo:[]
    }
  }
  nextPage = () =>{
    this.props.changeShow(1)
  }

  componentWillMount(){
        this.leadStore.getOsType(()=>{
            let osTypeInfo =  this.leadStore.osTypeInfo;
            this.setState({
                osTypeInfo : osTypeInfo
            })
        }) ;
  }
  render() {
    return (
        <div  className={this.props.show? "":"hide"}>
          <h1 className="lead-title">亲爱的用户，您好，欢迎登录友报账产品！您已经购买友报账产品，成为我们的正式用户。</h1>
          <p className="lead-title-page">
            <span className="lead-Lightbulb"></span>
            系统检测到您的企业正在使用的ERP产品为：用友{this.state.osTypeInfo.osType}（根据用户的ERP系统显示，可选项有NC/U8/U9），请先将ERP与友报账进行集成。
          </p>
          <p className="lead-title-page">
            方便您更好的使用友报账产品。接下来您需要完成3个部分的操作，即可愉快的使用友报账。
          </p>
          <ul className="lead-title-link">
            <li><img src="./images/erp-register.png" alt=""/><span>1.ERP注册</span></li>
            <li><img src="./images/erp-synchronization.png" alt=""/><span>2.ERP档案同步</span></li>
            <li><img src="./images/erp-configure.png" alt=""/><span>3.配置</span></li>
          </ul>
          <div className="lead-title-btn">
            <button className="btn btn-primary" onClick={this.nextPage}>去注册ERP</button>
          </div>
        </div>
    );
  }
}

export default Lead;