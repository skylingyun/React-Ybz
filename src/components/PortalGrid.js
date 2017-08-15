import React from 'react';
import { Link } from 'react-router';

class PortalGrid extends React.Component{
    constructor(props) {
        super(props);
        props;
        this.state = {
            cols: {},
            rows: []
        }
    }


    setMeta = (data) => {
        this.setState({
            cols: data
        });
    }

    setData = (data) => {
        this.setState({
            rows: data
        });
    }

    //单据
    optionBill = (id,option) => {
       this.props.optionBillHandler(id,option)
    }


    render () {
        let _this = this;
        let cols = this.state.cols;
        let rows = this.state.rows;
        let isCommonGrid =pasreString2Boolean(this.props.isCommonGrid);
        //var onRow = this.props.onRow;

        function pasreString2Boolean(value){
            return /^true$/i.test( value);
        }

        function toArray(data) {
            var result = [];
            for (let col in cols) {
                result.push(data[col]);
            }
            return result;
        }


        function toDeepArray(data) {
            //alert(JSON.stringify(data));return;
            var result = [];
            for (let col in cols) {
                if (col.indexOf('.') == -1) {
                    if(typeof(data[col]) === "boolean")
                          data[col]=data[col].toString();
                    result.push(data[col]);
                } else {
                    var strs = col.split('.');
                    var temp = data[strs[0]];
                    for (var i = 1; i < strs.length; i++) {
                        temp = temp[strs[i]];
                    }
                    if(typeof(temp) === "boolean")
                        temp = temp.toString();
                    result.push(temp);
                }
            }
            return result;
        }
        let colArr = toArray(_this.props.cols);
        let tBody=(<div></div>);
        if(rows.length<=0){
            tBody = (<tbody><tr><td colSpan={colArr.length}>无数据</td></tr></tbody>);
        }
        else{


            tBody=( <tbody>
            {
                rows.map((row, idx) => {
                    var option=(<a href="javascript:void(0)" onClick={_this.optionBill.bind(this,row.id,"open")}>启用</a>);
                    if(row.enabled)
                        option = (<a href="javascript:void(0)" onClick={_this.optionBill.bind(this,row.id,"close")}>停用</a>);
                    var bodyButtons = (<td></td>);
                    if(!isCommonGrid)
                        bodyButtons = (
                        <td className="td-option">
                            <Link to={"/detail/"+row.id} activeClassName="active">查看详情</Link>
                            <Link to={"/edit/"+row.id} activeClassName="active">修改</Link>
                            <a href="javascript:void(0)" onClick={_this.optionBill.bind(this,row.id,"del")}>删除</a>
                            {option}
                        </td>
                    );
                    return (
                        <tr key={idx} >{
                            toDeepArray(row).map(function (item,i) {
                                if (i == 0) {
                                    return (
                                        <td key={"grid-idx"+i}>
                                            {idx + 1}
                                        </td>
                                    )
                                }else{
                                    return (
                                        <td key={"grid-idx"+i}>{item}</td>
                                    )
                                }

                            })
                        }
                            {bodyButtons}
                        </tr>
                    )
                })
            }
            </tbody>);
        }
        let head = (<th></th>);
        if(!isCommonGrid){
            head = (<th style={{whiteSpace:"nowrap"}}><span className="grid-table-title">操作</span></th>);
        }
        return (
                <table className="grid-table" id="process_table">
                    <thead>
                        <tr>
                            {
                                colArr.map(function (col,i) {
                                    return (
                                        <th key={"grid-c"+i} style={{whiteSpace:"nowrap"}}><span className="grid-table-title">{col}</span></th>
                                    )
                                })
                            }
                            {head}
                        </tr>
                    </thead>
                    {tBody}
                </table>

        );
    }
};

export default PortalGrid;
