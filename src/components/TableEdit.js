/**
 * Created by liuyyg on 2017/4/27.
 */
import React from 'react';
import {OverlayTrigger,Tooltip,Button} from "react-bootstrap";
import numeral from "numeral";
// import editor from "../components/Editor";
import VoucherRefer from '../containers/voucher/VoucherRefer';
import { Refers } from 'ssc-refer';
import Config from "../config"
import {observer} from 'mobx-react';
import VoucherReferAjax from '../stores/VoucherReferAjax';
var voucherReferAjax = new VoucherReferAjax();

@observer
export default class TableEdit extends React.Component {
    constructor(props) {
        super(props);
        props;
        this.state = {
            id:"voucher",
            rows:[],
            cols: this.props.mockColumnsData,
            onFocus:{"rowIndex":0,"colIndex":0,field:"description"},
            hoverRowIndex:-1,
            sumdebit:0,
            sumcredit:0,
            sumDX:"",
            sumdebitError:{show:false,tips:""},
            sumcreditError:{show:false,tips:""}
        }
    }

    componentWillMount (){
      voucherReferAjax.queryVoucheRefer();
    }

    init = (accbook) => {
        voucherReferAjax.queryVoucheRefer(accbook);
    }
    updateRows = (rowsData) => {
        let _this = this;
        let rows=[];
        let cols = this.state.cols;
        if(Array.isArray(rowsData) && rowsData.length === 0){
            let num = 4;
            for (let i = 0; i < num; i++) {
                let row = {};
                cols.map((val,idx)=>{
                    let real=""
                    if(val.field=="clientauxiliary")
                        real = [];
                    row[val.field]={"disp":"","real":real,focus:false,editable:true};
                });
                rows.push(row);
                _this.refs['VoucherRefer'+i] ? _this.refs['VoucherRefer'+i].clearData() : ''
            }
            rows[0]["description"].focus = true;
            _this.setState({
                rows:rows,
                sumdebit:0,
                sumcredit:0,
                sumDX:""
            });
        }else if(Array.isArray(rowsData) && rowsData.length > 0){
            let sumdebit=0,sumcredit = 0;
            for (let i = 0,num = rowsData.length; i < num; i++) {
                let row = {},rowData=rowsData[i];
                let linkedValue = rowData["clientauxiliary"]?rowData["clientauxiliary"].slice(0):[];//linked value 是查询出来的值
                cols.map((val,idx)=>{
                    let value = rowData[val.field] ? rowData[val.field]:"";
                    if(val.field =="clientauxiliary"){
                        value =value==""?[]:value;
                        value.map((item,j)=>{
                            if(item!=null){
                                item = (item.helpvalue && item.helpvalue.id)?item.helpvalue.id:null;
                                value[j]=item;
                            }
                        })
                    }
                    let real= value;
                    let disp="";
                    if(val.format=="floatformat"){
                        disp=this.floatFormat(real);
                    }else if(val.format=="referformat"){
                        disp=this.referFormat(real)
                    }else{
                        disp=real;
                    }
                    //required
                    if(val.field=="accsubject"){
                        row[val.field]={"disp":disp,"real":real,requiredShow:!real.id?true:false,focus:false,editable:true,linked:linkedValue};
                    }else if(val.field == "clientauxiliary")
                        row[val.field]={"disp":"","real":value,focus:false,editable:true};
                    else{
                        if(val.required===true)
                        row[val.field]={"disp":disp,"real":real,requiredShow:!real?true:false,focus:false,editable:true};
                        else
                            row[val.field]={"disp":disp,"real":real,focus:false,editable:true};
                        if(val.field=="credit_original"&&(rowData["debit_original"]||rowData["credit_original"])){
                            row["debit_original"]["requiredShow"]=false;
                            row["credit_original"]["requiredShow"]=false;
                        }
                    }
                });
                rows.push(row);
            }
            let fakeRow = {};
            this.state.cols.map((val,idx)=>{
                let value="";
                if(val.field =="clientauxiliary")
                    value=[];
                fakeRow[val.field]={"disp":"","real":value,focus:false,editable:true};
            });
            rows.push(fakeRow);
            _this.setState({
                rows:rows
            },()=>{
                this.state.rows.map((item,i)=>{
                    _this.refs['VoucherRefer'+i] ? _this.refs['VoucherRefer'+i].clearData() : ''
                    if(item.accsubject.disp!=""){
                        this.refs['VoucherRefer'+i].setData(item)
                    }
                })
            });
            _this.setState({
                sumdebit:this.sum("debit_original"),
                sumcredit:this.sum("credit_original"),
            });
            if(this.state.sumdebit>this.state.sumcredit){
                _this.setState({
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额小于贷方金额"}
                });
            }else if(this.state.sumdebit<this.state.sumcredit){
                _this.setState({
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额大于贷方金额"}
                });
            }else
            _this.setState({
                sumDX:this.formatDX(this.state.sumdebit),
                sumdebitError:{show:false,tips:""},
                sumcreditError:{show:false,tips:""}
            });
            // _this.changeError(_this.validateError());//去掉禁止保存的限制
        }
    }
    insertRow =(e)=>{
        let rowIndex =$(e.target).parent().parent().parent()[0].rowIndex-1;
        // let rowIndex = this.state.hoverRowIndex;
        let fakeRow = {};
            this.state.cols.map((val,idx)=>{
                let value="";
                if(val.field =="clientauxiliary")
                    value=[];
                fakeRow[val.field]={"disp":"","real":value,focus:false,editable:true};
            });
        let rows = this.state.rows;
        rows.splice(rowIndex,0,fakeRow);
        this.setState({
            rows:rows
        },()=>{
            this.state.rows.map((item,i)=>{
                this.refs['VoucherRefer'+i] ? this.refs['VoucherRefer'+i].clearData() : ''
                if(item.accsubject.disp!=""){
                this.refs['VoucherRefer'+i].setData(item)
              }
            })
        })
    }
    deleteRow=(e)=>{
        let rowIndex =$(e.target).parent().parent().parent()[0].rowIndex-1;
        // let rowIndex = this.state.hoverRowIndex;
        let _this = this;
        let rows = this.state.rows;
        let delRow;
        if(rowIndex===rows.length-1){
            //最后一行的数据设置为空的
            let fakeRow = rows[rowIndex];
            delRow = rows.slice(rowIndex,rowIndex+1)[0];
            this.state.cols.map((val,idx)=>{
                let value="";
                if(val.field =="clientauxiliary")
                    value=[];
                fakeRow[val.field]={"disp":"","real":value,focus:false,editable:true};
            });
            this.refs['VoucherRefer'+rowIndex] ? this.refs['VoucherRefer'+rowIndex].clearData() : ''
            this.setState({
                rows:rows
            })
        } else{
            delRow = rows.slice(rowIndex,rowIndex+1)[0];
            rows.splice(rowIndex,1);
            this.setState({
                rows:rows
            },()=>{
                this.state.rows.map((item, i) => {
                    this.refs['VoucherRefer' + i] ? this.refs['VoucherRefer' + i].clearData() : ''
                    if (item.accsubject.disp != "") {
                        this.refs['VoucherRefer' + i].setData(item)
                    }
                })
            });
        }
        if(!delRow){
            return;
        }
        //删除行时，借贷不平衡判断，大写合计
        if(delRow["debit_original"].real!==""){//借不平衡
            let sum = _this.sum("debit_original");
            if(sum <_this.state.sumcredit){//借小于贷
                _this.setState({sumdebit:sum,
                    sumDX:"",
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额小于贷方金额"},
                    sumcreditError:{show:false,tips:""}
                })
            }else if(sum >_this.state.sumcredit){//借方大于贷
                _this.setState({
                    sumdebit:sum,
                    sumDX:"",
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额大于贷方金额"},
                    sumcreditError:{show:false,tips:""}
                })
            }else{
                _this.setState({sumdebit:sum,
                    sumDX:_this.formatDX(sum),
                    sumdebitError:{show:false,tips:""},
                    sumcreditError:{show:false,tips:""}
                })
            }
        }
        else if(delRow["credit_original"].real!==""){//贷不平衡
            let sum = _this.sum("credit_original");
            if(sum <_this.state.sumdebit){
                _this.setState({sumcredit:sum,sumDX:"",
                    sumcreditError:{show:true,tips:"借贷不平衡：贷方金额小于借方金额"},
                    sumdebitError:{show:false,tips:""}
                })
            }else if(sum >_this.state.sumdebit){
                _this.setState({sumcredit:sum,sumDX:"",
                    sumcreditError:{show:true,tips:"借贷不平衡：贷方金额大于借方金额"},
                    sumdebitError:{show:false,tips:""}
                })
            }else{
                _this.setState({sumcredit:sum,sumDX:_this.formatDX(sum),
                    sumdebitError:{show:false,tips:""},
                    sumcreditError:{show:false,tips:""}
                })
            }
        }

        //校验是否可以保存
        // this.changeError(_this.validateError());//去掉禁止保存的限制


    }
    onRowMouseOver=e=>{
        let that = e.target;
        let rowIndex=0;
        if (that.tagName !== 'TR'){
            that = $(that).closest("tr")[0]
            rowIndex=that.rowIndex-1
            // e.stopPropagation();
        }
        else{
            rowIndex = that.rowIndex-1;
        }
        $(that).children("td:eq(1)").children(".option-btn.hidden").removeClass("hidden")
        //由于会重绘rows,所以暂时不用state了
        // this.setState({
        //     hoverRowIndex:rowIndex
        // });
    }
    onRowMouseOut=e=>{
        let that = e.target;
        if (that.tagName !== 'TR'){
            that = $(that).closest("tr")[0]
        }
        $(that).children("td:eq(1)").children(".option-btn").addClass("hidden")
        //由于会重绘rows,所以暂时不用state了
        // this.setState({
        //     hoverRowIndex:-1
        // });
    }

    //单元格的点击事件
    handleClick = e => {
        let that = e.target;
        if ($(that).hasClass("form-control")&&$(that).parent().hasClass("bootstrap-typeahead-input")|| that.tagName == "BUTTON") {// || || that.tagName == "BUTTON"   || that.tagName == "LI"
            e.stopPropagation();
        }else{
            if (that.tagName !== 'TD'){
                that = $(e.target).closest("td")[0];
            }
            let rowIndex = that.parentElement.rowIndex-1;//表头有一行
            let colIndex= that.cellIndex-1;//有一列序号列
            let field = this.state.cols[colIndex]["field"];
            //console.log("handleclick",rowIndex,field)
            this.setInputFocus(rowIndex,colIndex,field)
        }
    }
     //设置某个单元格的聚焦状态
    setInputFocus = (rowIndex, colIndex, field) => {
        let rows = this.state.rows;
        rows[rowIndex][field].focus = true;
        this.setState({
                onFocus: {"rowIndex": rowIndex, "colIndex": colIndex, field: field},
                hoverRowIndex: rowIndex,
                rows: rows
            }
            , () => {
                if (field !== "accsubject")
                    this.setFocus(field, rowIndex)
            }
        );
    }
    //聚焦输入框
    setFocus = (field, rowIndex) => {
        if (field === "accsubject") {
            this.refs['VoucherRefer' + rowIndex] ? this.refs['VoucherRefer' + rowIndex].onFocusInput() : ''
        } else {
            setTimeout(() => {
                this.refs["input-" + field + rowIndex].autofocus = true;
                this.refs["input-" + field + rowIndex].focus();
            }, 10)
        }
    }
    //input值改变事件
    handleChangeInput=(field,idx,e)=>{
        let val = e.target.value.trim();
        if(field==="debit_original"||field==="credit_original"){
            if((isNaN(val)&&(val!=="-"))||!isNaN(val)&&(parseFloat(val)>999999999.99 || parseFloat(val)<-99999999.99)){
                val=this.state.rows[idx][field].real;
            }
        }
        this.setCellData({"disp":"",real:val,focus:true,editable:true}, idx, field);
    }
    //input的focus事件
    handleFocus=(e)=>{
        e.target.select();
    }
    //input的键盘事件
    handleKeyPress = e => {
        var _this = this;
        if (e.keyCode === 13||e.keyCode === 9) {
            // Pressed ENTER||TAB//光标进入下一个输入框
            let value =  e.currentTarget.value;
            e.stopPropagation();
            let focus = _this.state.onFocus;
            let values=_this.formatDisp(value,focus);
            value=values.value;
            let dispValue = values.dispValue;
            e.preventDefault();
            this.changeFocus(value,dispValue,focus,true)
        } else if (e.keyCode === 27) {
            //Pressed Esc//光标离开
            let value =  e.currentTarget.value;
            e.stopPropagation();
            let focus = _this.state.onFocus;
            let values=_this.formatDisp(value,focus);
            value=values.value;
            let dispValue = value.dispValue;
            _this.validateSetInput(value,dispValue,focus);
        }
    }
    //科目的键盘事件tab enter
    handleKeyPressAcc = e => {
        let rows = this.state.rows;
        let focus = this.state.onFocus;
        let rowIndex = focus.rowIndex;
        let field = "accsubject";
        rows[rowIndex][field].focus = false;
        field = "debit_original";
        rows[rowIndex][field].focus = true;
        //console.log("handleKeyPressAcc",rowIndex,field)

        this.setState({
                onFocus: {"rowIndex": rowIndex, "colIndex": 3, field: field},
                hoverRowIndex: rowIndex,
                rows: rows
            }
            , () => {
                this.setFocus(field, rowIndex)
            }
        );
    }
    //input的blur事件
    handleBlur = e => {
        // console.log(this.state.onFocus)
        var _this = this;
        e.stopPropagation();
        let value = e.currentTarget.value;
        let focus = _this.state.onFocus;
        let td = $(e.currentTarget).parent().parent()[0];
        let rowIndex = td.parentElement.rowIndex - 1;//表头有一行
        let colIndex = td.cellIndex - 1;//有一列序号列
        //console.log("blur",rowIndex, colIndex,focus)
        if (focus.rowIndex === rowIndex && focus.colIndex === colIndex) {
            let values = _this.formatDisp(value, focus);
            value = values.value;
            let dispValue = values.dispValue;
            //console.log("blur",focus);
            _this.validateSetInput(value, dispValue, focus);
        }
    }
    //参照的值改变事件
    handleChangeRefer = (field,idx,select) => {
        var _this = this;
        if(!select||select.length<=0){
            return;
        }
        var dispValue = this.referFormat(select[0]);
        _this.setCellData({"disp": dispValue, real: select[0],focus:false,editable:true}, _this.state.onFocus.rowIndex, _this.state.onFocus.field);
    }
    //参照的blur事件
    handleBlurRefer = (field,e) =>{
        var _this = this;
        let cell = this.state.rows[ _this.state.onFocus.rowIndex][_this.state.onFocus.field];
        let real = cell.real;
        let dispValue =cell.disp;
        _this.setCellData({"disp": dispValue, real: real,focus:false,editable:true}, _this.state.onFocus.rowIndex, _this.state.onFocus.field);
    }
    //设置科目和辅助核算数据
    getReferItem=(type,item)=>{
        let _this=this;
        let focus = _this.state.onFocus;
        let rowdata=this.state.rows[focus.rowIndex];
        //console.log("getreferItem",focus,type)
        //科目
        if(type == 1){
            let dispValue = item.name;
            rowdata[focus.field].real = item;
            rowdata[focus.field].disp = dispValue;
            rowdata[focus.field].focus = false;
            rowdata[focus.field].editable = true;
            rowdata[focus.field].requiredShow = false;
            if ((!rowdata["description"].real && !rowdata["debit_original"].real && !rowdata["credit_original"].real)) {
                rowdata["description"].requiredShow = true;
                rowdata["accsubject"].requiredShow = false;
                rowdata["debit_original"].requiredShow = true;
                rowdata["credit_original"].requiredShow = true
            } else {
                if (!rowdata["description"].real) {
                    rowdata["description"].requiredShow = true
                } else {
                    rowdata["description"].requiredShow = false
                }
                if (!rowdata["debit_original"].real && !rowdata["credit_original"].real) {
                    rowdata["debit_original"].requiredShow = true;
                    rowdata["credit_original"].requiredShow = true
                } else {
                    rowdata["debit_original"].requiredShow = false;
                    rowdata["credit_original"].requiredShow = false
                }
            }
            _this.setRowData(rowdata, focus.rowIndex);
            //校验是否可以保存
            // this.changeError(_this.validateError());//去掉禁止保存的限制
        }
        // clientauxiliary辅助核算
        if(type == 2){
            let field = this.state.cols[focus.colIndex].linked[0].field;
            let cellData = this.state.rows[focus.rowIndex][focus.field];
            _this.setCellData({"disp": cellData.disp, real: cellData.real,linked:item,focus:false,editable:true},focus.rowIndex,focus.field);
            //辅助核算
            let itemTemp =item.slice(0);
            itemTemp.map((val,j)=>{
                if(val!=null){
                    val = (val.helpvalue && val.helpvalue.id)?val.helpvalue.id:null;
                    itemTemp[j]=val;
                }
            })
            _this.setCellData({"disp": "", real: itemTemp,focus:false,editable:true}, focus.rowIndex, field);
            this.handleKeyPressAcc();
        }
    }
    onFocus=(value,test)=>{
        if (value != undefined) {
            var dispValue = this.referFormat(value);
            this.setCellData({"disp": dispValue, real: value,focus:false,editable:true}, this.state.onFocus.rowIndex, this.state.onFocus.field);
        }
    }
    //改变focus的单元格
    changeFocus=(value,dispValue,focus,needFocusNext)=>{
        let rows = this.state.rows;
        //校验，提示错误信息
        let rowIndex = focus.rowIndex;
        let colIndex = focus.colIndex;
        let field = this.state.cols[colIndex]["field"];
        let rowdata =this.state.rows[rowIndex];
        var linked =  this.state.cols[colIndex]["linked"];
        this.state.rows[rowIndex][field].real=value;
        this.state.rows[rowIndex][field].disp=dispValue;
        this.state.rows[rowIndex][field].focus=false;
        this.state.rows[rowIndex][field].editable=true;
        rowdata = this.checkError(focus, rowdata,value);

        // _this.setRowData(rowdata, focus.rowIndex);
        if (needFocusNext === true) {
            colIndex = focus.colIndex + 1;
            field = this.state.cols[colIndex]["field"];
            if (focus.field === "credit_original") {
                //判断是否是最后一行
                if(rowIndex === rows.length-1){
                    let fakeRow = {};
                    this.state.cols.map((val,idx)=>{
                        let value="";
                        if(val.field =="clientauxiliary")
                            value=[];
                        fakeRow[val.field]={"disp":"","real":value,focus:false,editable:true};
                    });
                    rows.splice(rowIndex+1,0,fakeRow);
                }
                rowIndex = focus.rowIndex + 1;
                colIndex = 0;
                field = this.state.cols[colIndex]["field"];
            }
            rows[rowIndex][field].focus=true;
        }
        //console.log("changefocus",rowIndex,field);
        this.setState({
                onFocus: {"rowIndex":rowIndex,"colIndex":colIndex,field:field},
                hoverRowIndex:rowIndex,
                rows:rows
            }
            ,()=>{
                if(needFocusNext===true){
                    this.setFocus(field,rowIndex)
                }
            }
        );
        this.checkSumError(focus);
        //校验是否可以保存
        // this.changeError(_this.validateError());//去掉禁止保存的限制

    }
    //校验单元格的数据是否符合会计凭证规则
    validateSetInput=(value,dispValue,focus)=>{
        //校验，提示错误信息
        let rowIndex = focus.rowIndex;
        let colIndex = focus.colIndex;
        let field = this.state.cols[colIndex]["field"];
        let rowdata =this.state.rows[rowIndex];
        this.state.rows[rowIndex][field].real=value;
        this.state.rows[rowIndex][field].disp=dispValue;
        this.state.rows[rowIndex][field].focus=false;
        rowdata = this.checkError(focus, rowdata,value);
        this.setRowData(rowdata, focus.rowIndex);
        this.checkSumError(focus);
        //校验是否可以保存
        // this.changeError(_this.validateError());//去掉禁止保存的限制

    }
    //获取表格数据
    getTableData=()=>{
        let rowsData = this.state.rows;
        let cols = this.state.cols;
        let rows = [],rowsDataTemp=[], length = rowsData.length;
        for (let j = 0; j < length; j++) {
            let flag=true;
            for(let idx=0;idx<cols.length;idx++){
                let field=cols[idx].field;
                let data = rowsData[j][field].real.id?rowsData[j][field].real.id:rowsData[j][field].real;
                if(data!=""&&data!=undefined&&data!= null){
                    flag=false;
                    break;
                }
            }
            if(!flag){
                rowsDataTemp.push(rowsData[j]);
            }
        }
        for (let j=0,length=rowsDataTemp.length;j<length;j++){
            let rowData = rowsDataTemp[j],row={};
            var colsLength=cols.length;
            cols.map((val,idx)=>{
                row[val.field]=rowData[val.field].real;
                if(val.format=="referformat"){
                    row[val.field]=rowData[val.field].real.id?rowData[val.field].real.id:"";
                }
                else{
                    row[val.field]=rowData[val.field].real;
                }
            });
            rows.push(row)
        }
        return rows
    }
    //获取当前聚焦的单元格数据
    getCellData=(field)=>{
        var currentData;
        if(field!=undefined)
            currentData=this.state.rows[this.state.onFocus.rowIndex][field];
        else
            currentData=this.state.rows[this.state.onFocus.rowIndex][this.onFocus.state.field];
        return currentData;
    }
    //设置某个单元格数据
    setCellData = (currentData,rowIndex,field)=>{
        let rowsData = this.state.rows;
        rowsData[rowIndex][field]=currentData;
        this.setState({rows:rowsData});
    }
    //设置某行数据
    setRowData = (rowData,rowIndex)=>{
        let rowsData = this.state.rows;
        rowsData[rowIndex]=rowData;
        //判断是否是最后一行
        if(rowIndex === rowsData.length-1){
            let fakeRow = {};
            this.state.cols.map((val,idx)=>{
                let value="";
                if(val.field =="clientauxiliary")
                    value=[];
                fakeRow[val.field]={"disp":"","real":value,focus:false,editable:true};
            });
            rowsData.splice(rowIndex+1,0,fakeRow);
        }
        this.setState({rows:rowsData});
    }
    //设置行数据
    setRowsData = (rows)=>{
        this.setState({rows:rows});
    }
    //校验当前数据是否符合会计凭证规则
    checkError=(focus,rowdata,value)=>{
        //这一堆需要优化
        if(focus["field"]=="description"){
            if((!value)&&(!rowdata["accsubject"].real &&!rowdata["debit_original"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=false;
                rowdata["accsubject"].requiredShow=false;
                rowdata["debit_original"].requiredShow=false;
                rowdata["credit_original"].requiredShow=false
            }else if(value&&(!rowdata["accsubject"].real &&!rowdata["debit_original"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=false;
                rowdata["accsubject"].requiredShow=true;
                rowdata["debit_original"].requiredShow=true;
                rowdata["credit_original"].requiredShow=true
            }else{
                if(!rowdata["description"].real){
                    rowdata["description"].requiredShow=true
                }else{
                    rowdata["description"].requiredShow=false
                }
                if(!rowdata["accsubject"].real){
                    rowdata["accsubject"].requiredShow=true
                }else{
                    rowdata["accsubject"].requiredShow=false
                }
                if(!rowdata["debit_original"].real&&!rowdata["credit_original"].real){
                    // _this.state.cols[focus.colIndex].requiredShow=true
                    rowdata["debit_original"].requiredShow=true;
                    rowdata["credit_original"].requiredShow=true
                }else {
                    rowdata["debit_original"].requiredShow=false;
                    rowdata["credit_original"].requiredShow=false
                }
            }
        }
        if(focus["field"]=="debit_original"){//借方金额
            if((!value)&&(!rowdata["accsubject"].real &&!rowdata["description"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=false;
                rowdata["accsubject"].requiredShow=false;
                rowdata["debit_original"].requiredShow=false;
                rowdata["credit_original"].requiredShow=false
            }else if(value&&(!rowdata["accsubject"].real &&!rowdata["description"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=true;
                rowdata["accsubject"].requiredShow=true;
                rowdata["debit_original"].requiredShow=false;
                rowdata["credit_original"].requiredShow=false
            }else{
                if(!rowdata["description"].real){
                    rowdata["description"].requiredShow=true
                }else{
                    rowdata["description"].requiredShow=false
                }
                if(!rowdata["accsubject"].real){
                    rowdata["accsubject"].requiredShow=true
                }else{
                    rowdata["accsubject"].requiredShow=false
                }

                if(!rowdata["debit_original"].real){//未输入借方金额
                    if(!rowdata["credit_original"].real){//未输入贷方金额
                        rowdata["credit_original"].requiredShow=true;
                        rowdata["debit_original"].requiredShow=true
                    }else {
                        rowdata["credit_original"].requiredShow=false;
                        rowdata["debit_original"].requiredShow=false;
                    }
                }else {
                    rowdata["debit_original"].requiredShow=false;
                    rowdata["credit_original"].requiredShow=false;
                    rowdata["credit_original"].real="";
                    rowdata["credit_original"].disp="";
                }
            }
        }
        if(focus["field"]=="credit_original"){//贷方金额
            if((!value)&&(!rowdata["accsubject"].real &&!rowdata["description"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=false;
                rowdata["accsubject"].requiredShow=false;
                rowdata["debit_original"].requiredShow=false;
                rowdata["credit_original"].requiredShow=false
            }else if(value&&(!rowdata["accsubject"].real &&!rowdata["description"].real&&!rowdata["credit_original"].real)){
                rowdata["description"].requiredShow=true;
                rowdata["accsubject"].requiredShow=true;
                rowdata["debit_original"].requiredShow=false;
                rowdata["credit_original"].requiredShow=false
            }else{
                if(!rowdata["description"].real){
                    rowdata["description"].requiredShow=true
                }else{
                    rowdata["description"].requiredShow=false
                }
                if(!rowdata["accsubject"].real){
                    rowdata["accsubject"].requiredShow=true
                }else{
                    rowdata["accsubject"].requiredShow=false
                }

                if(!rowdata["credit_original"].real){//未输入贷方金额
                    if(!rowdata["debit_original"].real){//未输入借方金额
                        rowdata["credit_original"].requiredShow=true;
                        rowdata["debit_original"].requiredShow=true
                    }else {
                        rowdata["credit_original"].requiredShow=false;
                        rowdata["debit_original"].requiredShow=false;
                    }
                }else {
                    rowdata["credit_original"].requiredShow=false;
                    rowdata["debit_original"].requiredShow=false;
                    rowdata["debit_original"].real="";
                    rowdata["debit_original"].disp="";
                }
            }
        }
        return rowdata;
    }
    //校验合计金额是否借贷平衡
    checkSumError=(focus)=>{
        let _this = this;
        if(focus.field == "debit_original"){//借不平衡
            let sum = _this.sum("debit_original");
            if(sum <_this.state.sumcredit){//借小于贷
                _this.setState({sumdebit:sum,
                    sumDX:"",
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额小于贷方金额"},
                    sumcreditError:{show:false,tips:""}
                })
            }else if(sum >_this.state.sumcredit){//借方大于贷
                _this.setState({
                    sumdebit:sum,
                    sumDX:"",
                    sumdebitError:{show:true,tips:"借贷不平衡：借方金额大于贷方金额"},
                    sumcreditError:{show:false,tips:""}
                })
            }else{
                _this.setState({sumdebit:sum,
                    sumDX:_this.formatDX(sum),
                    sumdebitError:{show:false,tips:""},
                    sumcreditError:{show:false,tips:""}
                })
            }
        }
        else if(focus.field == "credit_original"){//贷不平衡
            let sum = _this.sum("credit_original");
            if(sum <_this.state.sumdebit){
                _this.setState({sumcredit:sum,sumDX:"",
                    sumcreditError:{show:true,tips:"借贷不平衡：贷方金额小于借方金额"},
                    sumdebitError:{show:false,tips:""}
                })
            }else if(sum >_this.state.sumdebit){
                _this.setState({sumcredit:sum,sumDX:"",
                    sumcreditError:{show:true,tips:"借贷不平衡：贷方金额大于借方金额"},
                    sumdebitError:{show:false,tips:""}
                })
            }else{
                _this.setState({sumcredit:sum,sumDX:_this.formatDX(sum),
                    sumdebitError:{show:false,tips:""},
                    sumcreditError:{show:false,tips:""}
                })
            }
        }
    }
    //校验当前凭证录入是否有错误标记
    validateError=()=>{
        let hasError = false;
        // if(this.state.sumdebitError.show===true||this.state.sumcreditError.show===true){
        //     return true;
        // }
        let rows = this.state.rows;
        let cols = this.state.cols;
        for (let i = 0, length = rows.length; i < length; i++) {
            let row = rows[i];
            for (let j = 0, length = cols.length; j < length; j++) {
                let val = cols[j];
                if (row[val.field].requiredShow === true){
                    hasError = true;
                    break;
                }
            }
            if(hasError===true){
                break;
            }
        }
        return hasError;
    }
    //修改凭证错误flag
    changeError=(hasError)=>{
        if(this.props.checkError)
            this.props.checkError(!hasError);
    }
    //将真实值format为显示值
    formatDisp=(value,focus)=>{
        let _this= this;
        var dispValue = "";
        var format = _this.state.cols[focus.colIndex]["format"];
        var linked =  _this.state.cols[focus.colIndex]["linked"];
        if(format){
            if(format == "floatformat"){
                if(value!=="")
                    value = parseFloat(parseFloat(value).toFixed(2));
                if(isNaN(value))
                    value=""
                dispValue=this.floatFormat(value);
            }else if(format == "referformat"){
                dispValue=this.referFormat(value);
            }else if(format == "customer"){
                let func = _this.state.cols[focus.colIndex]["func"];
                if(typeof func =="function"){
                    dispValue = func(value);
                }
            }else{
                dispValue=value;
            }
        }else{
            dispValue=value;
        }
        return {value:value,dispValue:dispValue};
    };
    // 将float真实值format为显示值
    floatFormat=(cell)=>{
        let formatCell = "";
        if (!isNaN(cell) && cell !== ""){//&&(parseFloat(cell)<=999999999.99&&parseFloat(cell)>=-999999999.99)
            formatCell= `${Math.abs(parseFloat(cell)).toFixed(2).replace(".","")}`;
            let length =formatCell.length;
            if(length>11)
                formatCell = "‥"+formatCell.substr(length-10,10);//┇!·
        }
        return  formatCell
    };
    // 将refer真实值format为显示值
    referFormat=(cell)=>{
        let name = "";
        if(typeof cell =="string")
            name = cell;
        else if(cell.id){
            return cell.name?cell.name:cell.id;
        }
        return name;
    };
    //合计借贷金额
    sum = (field)=>{
        let sum =0;
        this.state.rows.map(function (val,idx) {
            sum += val[field].real==""?0:parseFloat(val[field].real);
        })
        return sum;
    }
    /** 数字金额大写转换(整数,小数,负数) */
    formatDX=(n)=>{
            var fraction = ['角', '分'];
            var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
            var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
            var head = n < 0? '负': '';
            n = Math.abs(n);

            var s = '';

            for (var i = 0; i < fraction.length; i++)
            {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);

            for (var i = 0; i < unit[0].length && n > 0; i++)
            {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++)
                {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }

    render() {
        let _this= this;
        if(!_this.state.cols){
            return (<p></p>);
        }else{
            const cellEditProp = {
                mode: 'click',
                blurToSave: true
            };
            const attr = {
                // ref: 'inputRef',
                onKeyDown: _this.handleKeyPress,
                onBlur: _this.handleBlur,
                onFocus:_this.handleFocus
            };

            return (
                <div>
                    <table id={this.state.id +"_table"} className=" table table-bordered table-hover">
                        <thead>
                        <tr><th className="hidden">序号</th>
                            {
                                _this.state.cols.map((val,idx)=>{
                                    let className=""
                                    if(val.columnClass)
                                        className+=val.columnClass;
                                    if(val.visible===false)
                                        className+=" hidden";
                                    if(!val.editable)
                                        className+=" disable";
                                    if(val.dataType==="float"){
                                        if(val.field=="debit_original") {
                                            let tooltip = (
                                                <Tooltip id={"tips-th"+val.field}>{this.state.sumdebitError.tips}</Tooltip>
                                            )
                                            return (<th key={"th-" + idx} title={val.title} className={className}>
                                                <p>{val.title}
                                                    <OverlayTrigger placement="top" overlay={tooltip}>
                                                        <Button bsStyle="default"
                                                                className={(this.state.sumdebitError.show === true) ? "" : "hidden"}><i
                                                            className={"option-btn-error"}></i></Button>
                                                    </OverlayTrigger>
                                                </p>
                                                <div className="v-table-th-bg">
                                                </div>
                                            </th>)
                                        }else{
                                                let tooltip = (
                                                    <Tooltip id={"tips-th"+val.field}>{this.state.sumcreditError.tips}</Tooltip>
                                                )
                                                return(<th key={"th-"+idx} title={val.title} className={className}>
                                                    <p>{val.title}
                                                        <OverlayTrigger placement="top" overlay={tooltip}>
                                                            <Button bsStyle="default" className = {(this.state.sumcreditError.show === true)?"":"hidden"}><i className={"option-btn-error"}></i></Button>
                                                        </OverlayTrigger>
                                                    </p>
                                                    <div className ="v-table-th-bg">
                                                    </div>
                                                </th>)
                                            }
                                    }else{
                                    return(<th key={"th-"+idx} title={val.title} className={className}>
                                        {val.title}
                                    </th>);
                                    }
                                })
                            }
                        </tr>
                        </thead>
                        <tbody id={this.state.id + "_tbody"}>
                        {
                            _this.state.rows.map((row, idx) => {
                                return (
                                    <tr key = {"tr-"+idx} onMouseOver={_this.onRowMouseOver} onMouseOut={_this.onRowMouseOut}>
                                        <td className="hidden"><span className="form-text">{idx+1}</span>
                                        </td>
                                        {
                                            _this.state.cols.map(function (val, i) {
                                                let className="";
                                                if(val.columnClass)
                                                    className+=val.columnClass;
                                                if(val.visible===false)
                                                    className+=" hidden";
                                                if(val.editable === false ||(val.editable === true && row[val.field].editable === false))
                                                    return (<td ref='td' key={"td-"+idx+"-"+i}
                                                                className={className+" disable"}>
                                                    <span key={"span-"+idx+"-"+i}
                                                          className={"form-text"}
                                                    >{row[val.field].disp==undefined?"":row[val.field].disp}</span>

                                                    </td>);
                                                else{
                                                    var fieldValue = row[val.field].real;
                                                    var format = false;
                                                    let cellEditor,cellSpan;
                                                    if (val.editType == "ReferEdit") {
                                                        let refCode = val.refCode?val.refCode:val.field;
                                                        let conditions={"refCode":refCode,"refType":"tree"}
                                                        cellEditor =(
                                                            <div className={(row[val.field].focus)?"edit-refer":"edit-refer hidden"}>
                                                                <Refers
                                                                    defaultSelected={[{"id":fieldValue.id,name:row[val.field].disp}]}
                                                                    labelKey="name"
                                                                    onChange={_this.handleChangeRefer.bind(this,val.field,idx)}
                                                                    onBlur={_this.handleBlurRefer.bind(this,val.field)}
                                                                    referConditions={conditions}
                                                                    referDataUrl={val.field ==="user"?Config.refer.referDataUserUrl:Config.refer.referDataUrl}
                                                                    referType="list"
                                                                />
                                                            </div>
                                                        );
                                                        cellSpan=(<span key={"span-"+idx+"-" + i}
                                                                        className={(row[val.field].focus)?"form-text hidden":"form-text"} >
                                                     {row[val.field].disp}
                                                            {
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip id={"tips-"+val.field+idx}>{val.title +"需输入"}</Tooltip>}>
                                                                        <Button bsStyle="default" className = {(row[val.field].requiredShow===true)?"":"hidden"}><i className={"option-btn-error"}></i></Button>
                                                                    </OverlayTrigger>
                                                            }
                                                     </span>)
                                                    } else if(val.editType == "customer"){
                                                        if(val.field=="accsubject")
                                                            fieldValue={"accsubject":fieldValue,"clientauxiliary":row[val.field].linked?row[val.field].linked:[]};
                                                            cellEditor =(<VoucherRefer ref={'VoucherRefer'+idx} handleKeyPressNext={_this.handleKeyPressAcc} referData={voucherReferAjax.voucheReferData} referDataForm={voucherReferAjax.voucheReferData2} value={fieldValue} getReferItem={_this.getReferItem} />);
                                                        cellSpan = (<span key={"span-" + idx + "-" + i}
                                                                          className={(row[val.field].focus) ? "form-text hidden" : "form-text"}>
                                                                {
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip
                                                                        id={"tips-" + val.field + idx}>{val.title + "需输入"}</Tooltip>}>
                                                                        <Button bsStyle="default"
                                                                                className={(row[val.field].requiredShow === true) ? "" : "hidden"}><i
                                                                            className={"option-btn-error"}></i></Button>
                                                                    </OverlayTrigger>
                                                                }
                                                     </span>);
                                                    }else {
                                                        fieldValue = fieldValue === 0 ? '0' : fieldValue;
                                                        cellEditor = (
                                                            <div className={(row[val.field].focus)?"edit-refer":"edit-refer hidden"}>
                                                            {
                                                                <input { ...attr } type={ "text" } autoFocus={(row[val.field].focus===true)?"autoFocus":""}
                                                                       ref={"input-" + val.field + idx} className="form-control" style={val.dataType==="float"?{"textAlign":"right"}:{}}  value={fieldValue} onChange={_this.handleChangeInput.bind(this,val.field,idx)}/>
                                                            }
                                                        </div>);
                                                        cellSpan = (<span key={"span-" + idx + "-" + i}
                                                                          className={(row[val.field].focus) ? "form-text hidden" : "form-text"} style={val.dataType=="float"&&fieldValue<0?{"color":"#d41717"}:{}}>
                                                     {row[val.field].disp}
                                                            {
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip
                                                                        id={"tips-" + val.field + idx}>{val.title + "需输入"}</Tooltip>}>
                                                                        <Button bsStyle="default"
                                                                                className={(row[val.field].requiredShow === true) ? "" : "hidden"}><i
                                                                            className={"option-btn-error"}></i></Button>
                                                                    </OverlayTrigger>
                                                            }
                                                     </span>);
                                                    }
                                                    let optionBtn=("")
                                                    if(val.field === "description")
                                                    optionBtn = ( <div className={"option-btn hidden"}>
                                                        <button className="option-btn-add" onClick={_this.insertRow}></button>
                                                        <button className="option-btn-del" onClick={_this.deleteRow}></button>
                                                    </div>)
                                                    return (<td ref='td' key={"td-"+idx+"-"+ i} className={className}
                                                                onClick={ _this.handleClick }>
                                                        {optionBtn}
                                                        {cellSpan}
                                                        { cellEditor }
                                                    </td>);
                                                }
                                            })
                                        }
                                    </tr>);
                            })
                        }
                        </tbody>
                        {
                            <tfoot>
                            <tr>
                                <td className="v-table-bottom-td-pl"colSpan={_this.state.cols.length-4}>合计：{this.state.sumDX}</td>
                                <td className="v-table-bottom-td v-table-td-bg" style={this.state.sumdebit<0?{"color":"#d41717"}:{}}><span title={numeral(this.state.sumdebit).format('0,0.00')} className="form-text">
                                    {
                                        this.floatFormat(this.state.sumdebit)
                                    }
                                </span></td>
                                <td className="v-table-bottom-td v-table-td-bg" style={this.state.sumcredit<0?{"color":"#d41717"}:{}}><span title={numeral(this.state.sumcredit).format('0,0.00')} className="form-text">
                                    {
                                        this.floatFormat(this.state.sumcredit)
                                    }
                                </span></td>
                            </tr>
                            </tfoot>
                        }

                    </table>
                </div>
            );
        }
    }
};
