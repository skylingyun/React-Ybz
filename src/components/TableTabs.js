/**
 *  tab组件
 */
import React from 'react';
import { observer } from 'mobx-react';
import { ButtonGroup,Button } from 'react-bootstrap';
import GlobalStore from '../stores/GlobalStore';
import BalanceAjaxStore from '../stores/BalanceAjaxStore'
import mobx from 'mobx';

var globalStore = GlobalStore;
@observer
class TableTabs extends React.Component {
    constructor(props) {
        super(props);
        // this.balanceAjaxStore = new BalanceAjaxStore;
        this.state = {
            tabData:[{"code":"01","name":"资产","id":"G001ZM0000DEFAULTACCPROPERTY00100001"},{"code":"02","name":"负债","id":"G001ZM0000DEFAULTACCPROPERTY00100013"},{"code":"03","name":"共同","id":"G001ZM0000DEFAULTACCPROPERTY00100025"},{"code":"04","name":"所有者权益","id":"G001ZM0000DEFAULTACCPROPERTY00100030"},{"code":"05","name":"成本","id":"G001ZM0000DEFAULTACCPROPERTY00100033"},{"code":"06","name":"收入","id":"G001ZM0000DEFAULTACCPROPERTY00100036"},{"code":"07","name":"费用","id":"G001ZM0000DEFAULTACCPROPERTY00400008"}],
            flag : "G001ZM0000DEFAULTACCPROPERTY00100001"
        }
    }

    componentDidMount() {
        // let typeData = globalStore.getCache("accSubjectType")
        // if (!typeData || typeData.length <= 0) {
        //     this.balanceAjaxStore.queryAccSubjectType(()=>{
        //         typeData = globalStore.getCache("accSubjectType")
        //         this.setState({tabData:typeData})
        //     });
        // }

        window.addEventListener("scroll", this.scrollToFix, false);

    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollToFix, false);
    }

   scrollToFix() {
       var nav = $(".tabs-bar");
       if($(document).scrollTop() >= 100) {
           nav.addClass("container stick");
       } else {
           nav.removeClass("container stick");
       }
   }

    scrollToAnchor= (anchorName, flag) =>{
        // let anchorName = this.props.location.hash;
        if (anchorName) {
            // anchorName = anchorName.replace("#","");
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
        var _this = this;
        if(_this.state.flag != flag){
            _this.setState({
                flag: flag
            })
        }
    }

    render() {
        return (
            <div className="tabs-bar">
                <ul className="nav nav-tabs fl">
                    {this.state.tabData.map((val, index) => {
                        return (
                            <li className={this.state.flag==val.id ? "active":""} role="presentation" key={"button" + index} onClick={this.scrollToAnchor.bind(this, "tab-" + val.id, val.id)}>
                                <a href="javascript:;">{val.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default TableTabs;