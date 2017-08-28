/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class BillsAjaxStore {
    globalStore = GlobalStore;

    @observable queryStandardDataList = [];
    @observable queryStandardDataListSum = [];

    @observable DataListColumn = [
        {type: 'string', id: 'tenantId', label: '租户ID'},
        {type: 'string', id: 'businessTripCount', label: '申请单数据'},
        {type: 'string', id: 'businessTripMoney', label: '申请单总金额'},
        {type: 'string', id: 'expenseCount', label: '报销单数量'},
        {type: 'string', id: 'expenseMoney', label: '报销单总金额'},
        {type: 'string', id: 'loanBillCount', label: '借款单数据'},
        {type: 'string', id: 'loanBillMoney', label: '借款单总金额'},
        {type: 'string', id: 'totalMoney', label: '总金额'},
    ]

    @observable DataListColumnSum = [
        {type: 'string', id: 'businessTripCountSum', label: '申请单数量合计'},
        {type: 'string', id: 'businessTripMoneySum', label: '申请单金额合计'},
        {type: 'string', id: 'expenseCountSum', label: '报销单数量合计'},
        {type: 'string', id: 'expenseMoneySum', label: '报销单金额合计'},
        {type: 'string', id: 'loanBillCountSum', label: '借款单数量合计'},
        {type: 'string', id: 'loanBillMoneySum', label: '借款单金额合计'},
        {type: 'string', id: 'totalMoneySum', label: '总金额合计'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param , callback) {
        var that = this;
        var sumItem = null;
        var businessTripCountSum = 0;
        var expenseCountSum = 0;
        var loanBillCountSum = 0;
        var businessTripMoneySum = 0.0;
        var expenseMoneySum = 0.0;
        var loanBillMoneySum = 0.0;
        var totalMoneySum = 0.0;
        that.globalStore.showWait();
        that.globalStore.hideWait();
        var params =JSON.stringify(param)
        $.ajax({
            type: "POST",
            url: Config.allBills.getBillsList,
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardDataList = Object.assign([], data.data.map((item) => {
                        for (var value of item) {
                            let tenantId = value.tenantId ? value.tenantId : [];
                            let businessTripCount = value.businessTripCount ? value.businessTripCount : 0;
                            let businessTripMoney = value.businessTripMoney ? value.businessTripMoney : 0.0;
                            let expenseCount = value.expenseCount ? value.expenseCount : 0;
                            let expenseMoney = value.expenseMoney ? value.expenseMoney : 0.0;
                            let loanBillCount = value.loanBillCount ? value.loanBillCount : 0;
                            let loanBillMoney = value.loanBillMoney ? value.loanBillMoney : 0.0;
                            let totalMoney = value.totalMoney ? value.totalMoney : 0.0;

                            value.tenantId = tenantId;
                            value.businessTripCount = businessTripCount;
                            value.businessTripMoney = businessTripMoney;
                            value.expenseCount = expenseCount;
                            value.expenseMoney = expenseMoney;
                            value.loanBillCount = loanBillCount;
                            value.loanBillMoney = loanBillMoney;
                            value.totalMoney = totalMoney;

                            businessTripCountSum += businessTripCount;
                            businessTripMoneySum += businessTripMoney;
                            expenseCountSum += expenseCount;
                            expenseMoneySum += expenseMoney;
                            loanBillCountSum += loanBillCount;
                            loanBillMoneySum += loanBillMoney;
                            totalMoneySum += totalMoney;
                            sumItem = value;
                            return value;
                        }
                    }))
                    if(typeof callback == "function")
                        callback(data);
                    console.log(that.queryStandardDataList);
                    if(sumItem != null){
                        sumItem.businessTripCountSum = businessTripCountSum;
                        sumItem.businessTripMoneySum = businessTripMoneySum.toFixed(2);
                        sumItem.expenseCountSum = expenseCountSum;
                        sumItem.expenseMoneySum = expenseMoneySum.toFixed(2);
                        sumItem.loanBillCountSum = loanBillCountSum;
                        sumItem.loanBillMoneySum = loanBillMoneySum.toFixed(2);
                        sumItem.totalMoneySum = totalMoneySum.toFixed(2);
                        that.queryStandardDataListSum = [sumItem];
                    }
                } else {
                    that.queryStandardDataList=[]
                    that.globalStore.showError(data.msg ? data.msg : "查询失败")
                }
            },
            error: (xhr, status, err) => {
                that.queryStandardDataList=[]
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
            }
        })
    }


}