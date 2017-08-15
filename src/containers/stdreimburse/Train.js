/*
* 火车报销标准组件
* */
import React from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import globalStore from '../../stores/GlobalStore';
import TrainStore from '../../stores/stdreimburse/StdReimburseTrainStore';
import TrainAddorEdit  from '../../components/stdreimburse/TrainAddorEdit';

@observer
class Train extends React.Component {

    constructor (props){
        super(props);
        this.trainStore  = new TrainStore();
        this.state = {
            mockColumnsData:[
                {type: 'string', id: 'id', 'label': 'id',hidden:true},
                {type: 'string', id: 'code', 'label': 'code',hidden:true},
                {type: 'string', id: 'name', 'label': '标准名称'},
                {type: 'string', id: 'policyexpensetype', 'label': '标准类型',formatter:{
                    type: 'custom',
                    callback:value => {return value.name}
                }},
                {type: 'string', id: 'seattype', 'label': '坐席',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                }},
                {type: 'string', id: 'posts', 'label': '职务',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                 }
                },
                {type: 'string', id: 'ranks', 'label': '职级',formatter:{
                    type: 'custom',
                    callback:value => this.JsonToList(value)
                  }
                }
            ],
            tabPage:1,
            totalPage:1,
            pageData:[]
        }

    }

    JsonToList = ( value )=>{
        let result = [] ;
        if(!value || value.length == 0){
            return "";
        }
        value.map((v , i )=>{
            result.push(v.name);
        })
        return result ;
    }

    componentWillMount () {
        this.trainStore.queryTrain();
    }


    handlePagination =( page ) =>{

        this.trainStore.queryStandardDataParam.page = page  ;
        this.trainStore.queryTrain();

    }


    updateAndAdd = () =>{
        this.setState({
            tabPage:1
        },()=>{
            this.trainStore.queryTrain();
            this.initGrid();
        })
    }

    addTrain = () =>{
        // this.trainStore.getEditData([]);
        this.setState({
            tabPage:2,
            pageData:[]
        })

    }

    initGrid = () =>{
        let _this = this ;
        let tableData = this.trainStore.queryStandardDataList ;
        let num =1 ;
        let pageNum = this.trainStore.getTrainPageNum;
        if(tableData && tableData.length != 0 ){
            num =  Math.ceil(pageNum / this.trainStore.queryStandardDataParam.pagenum ) ;
        }
        const CustomComponent  = React.createClass({
            editTrain ()  {
                // _this.trainStore.getEditData( this.props.rowObj);
                _this.setState({
                    pageData:this.props.rowObj,
                    tabPage:2
                })
             },

            deleteTrain (){
               globalStore.showCancelModel("您确认要删除吗？",()=>{
                        // 取消
                    },()=>{
                        // 确定
                        let param = [];
                        param.push(this.props.rowObj.id)
                        _this.trainStore.deleteTrain({"standardids" :param} , ()=>{
                            _this.trainStore.queryTrain();
                            _this.initGrid()
                        });
                    });
                },

            render(){
                return (
                    <td>
                        <span className="mr15" onClick={this.editTrain}>编辑</span>
                        <span className="" onClick={this.deleteTrain}>删除</span>
                    </td>
                )
            }
        })



        return (
            <Grid
                tableData={tableData} columnsModel={this.state.mockColumnsData}
                operationColumn={{
                      className: 'operation',
                      text: ' '
                    }}
                operationColumnClass={CustomComponent}
                paging
                totalPage={num}
                activePage={this.trainStore.queryStandardDataParam.page}
                className="standard-grid"
                onPagination={this.handlePagination}

            />
        )
    }





    render(){
      let that = this;
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className={this.state.tabPage==1 ? "nav nav-tabs flights-nav" : "nav nav-tabs flights-nav hide"}>
                        <ul>
                            <li ><Link to="stdreimburse/flights">机票</Link></li>
                            <li className="active"><Link to="stdreimburse/train">火车票</Link></li>
                            <li><Link to="stdreimburse/hotel">住宿</Link></li>
                            <li><Link to="stdreimburse/ship">轮船票</Link></li>
                        </ul>
                    </div>
                    <div className={this.state.tabPage==1 ?"flights-body" : "flights-body hide"}>
                        <div className="row">
                            <div className="col-md-12">
                                <a  className="btn btn-primary flights-btnadd" href="javascript:;"  onClick={this.addTrain}>新增</a>
                            </div>
                        </div>
                        {this.initGrid() }
                     </div>

                    <div className={this.state.tabPage==2 ? "" : "hide"}>
                        <TrainAddorEdit
                        fuserColumn={this.trainStore.fuserColumn}
                        getfilternodeexpensestandarduser={that.getUserList.bind(this)}
                        fuserList={this.trainStore.fuserDataList}
                        pageData = {this.state.pageData}
                        updateAndAdd = {this.updateAndAdd}
                        tabPage = {this.state.tabPage}/>
                    </div>

                </div>
            </div>)
    }
    getUserList(data){
      this.trainStore.getfilternodeexpensestandarduser(data)
    }
}

export  default Train ;
