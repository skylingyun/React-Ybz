import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import globalStore from '../../stores/GlobalStore';
import WebreImburseStore  from '../../stores/webreimburse/WebreImburseStore';
const webStore = new WebreImburseStore();
@observer
class NavTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // ["travel", "hotel", "eating", "communicate", "other"]
            navInit:[
                    {name:"交通",active:true,url:"travel" ,nav:"travel"},{name:"住宿",active:false,url:"hotel",nav:"hotel"},
                    {name:"餐饮",active:false,url:"restaurant",nav:"eating"}, {name:"通讯",active:false,url:"communication",nav:"communicate"},
                    {name:"其他",active:false,url:"other",nav: "other"}
                ],
            nav:[],
        }
    }

    componentWillMount (){
        this.getSystemNav();
    }

    componentWillReceiveProps(nextProps){
    }

    getSystemNav = ()=>{
        webStore.getBillType({},this.props.pk ,(data)=>{
            if(!data||!data.nodetypes){return ;}
            let result = data.nodetypes ;
            let navInit = this.state.navInit;
            let nav = [] ;
            navInit.map((valueInit , indexInit )=>{
                result.map((value , index )=>{
                    if(valueInit.nav  == value )
                        nav.push(valueInit)
                })
            });
            this.setState({
                nav:nav      //tab页数组
            } , ()=>{
                this.setTab(this.props.tab)
            })
        } , false );

    }

    // 动态渲染， tab 不能放在props
    setTab =( tab ) =>{
        let nav = this.state.nav ;
        nav.map(( value ,index )=>{
            value.active = false ;
            if( tab == value.nav ){
                value.active = true ;
            }
        })
        this.setState({
            nav:nav
        })
    }

    render(){
        return (
            <div className="nav nav-tabs flights-nav">
                <ul>
                    {this.state.nav.map((value,index)=>{
                        return (
                            <li className={value.active ? "active":""} key={"nav-tabs-"+index} >
                                <Link to={"/web/"+value.url+"/"+this.props.pk}>{value.name}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
export default NavTab;