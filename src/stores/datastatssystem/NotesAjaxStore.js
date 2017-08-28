/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class NotesAjaxStore {
    globalStore = GlobalStore;

    @observable queryStandardDataList = [];
    @observable queryStandardDataListSum = [];

    @observable DataListColumn = [
        {type: 'string', id: 'tenantId', label: '租户ID'},
        {type: 'string', id: 'travel', label: '出行记事'},
        {type: 'string', id: 'travelMoney', label: '出行总金额'},
        {type: 'string', id: 'hotel', label: '住宿记事'},
        {type: 'string', id: 'hotelMoney', label: '住宿总金额'},
        {type: 'string', id: 'other', label: '其它记事'},
        {type: 'string', id: 'otherMoney', label: '其它总金额'},
        {type: 'string', id: 'eating', label: '餐饮记事'},
        {type: 'string', id: 'eatingMoney', label: '餐饮总金额'},
        {type: 'string', id: 'gather', label: '销售记事'},
        {type: 'string', id: 'gatherMoney', label: '销售总金额'},
        {type: 'string', id: 'totalMoney', label: '总金额'},
    ]

    @observable DataListColumnSum = [
        {type: 'string', id: 'travelSum', label: '出行记事合计'},
        {type: 'string', id: 'travelMoneySum', label: '出行金额合计'},
        {type: 'string', id: 'hotelSum', label: '住宿记事合计'},
        {type: 'string', id: 'hotelMoneySum', label: '住宿金额合计'},
        {type: 'string', id: 'otherSum', label: '其它记事合计'},
        {type: 'string', id: 'otherMoneySum', label: '其它总金额合计'},
        {type: 'string', id: 'eatingSum', label: '餐饮记事合计'},
        {type: 'string', id: 'eatingMoneySum', label: '餐饮总金额合计'},
        {type: 'string', id: 'gatherSum', label: '销售记事合计'},
        {type: 'string', id: 'gatherMoneySum', label: '销售总金额合计'},
        {type: 'string', id: 'totalMoneySum', label: '总金额合计'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param , callback) {
        var that = this;
        var sumItem = null;
        var travelSum = 0;
        var travelMoneySum = 0;
        var hotelSum = 0;
        var hotelMoneySum = 0;
        var otherSum = 0;
        var otherMoneySum = 0;
        var eatingSum = 0;
        var eatingMoneySum = 0;
        var gatherSum = 0;
        var gatherMoneySum = 0;
        var totalMoneySum = 0;
        that.globalStore.showWait();
        that.globalStore.hideAlert();
        var params =JSON.stringify(param)
        $.ajax({
            type: "POST",
            url: Config.allNotes.getNotesList,
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardDataList = Object.assign([], data.data.map((item) => {
                        for (var value of item) {
                            let tenantId = value.tenantId ? value.tenantId : [];
                            let travel = value.travel ? value.travel : 0;
                            let travelMoney = value.travelMoney ? value.travelMoney : 0.0;
                            let hotel = value.hotel ? value.hotel : 0;
                            let hotelMoney = value.hotelMoney ? value.hotelMoney : 0.0;
                            let other = value.other ? value.other : 0;
                            let otherMoney = value.otherMoney ? value.otherMoney : 0.0;
                            let eating = value.eating ? value.eating : 0;
                            let eatingMoney = value.eatingMoney ? value.eatingMoney :0.0;
                            let gather = value.gather ? value.gather : 0;
                            let gatherMoney = value.gatherMoney ? value.gatherMoney : 0.0;
                            let totalMoney = value.totalMoney ? value.totalMoney : 0.0;

                            value.tenantId = tenantId;
                            value.travel = travel;
                            value.travelMoney = travelMoney;
                            value.hotel = hotel;
                            value.hotelMoney = hotelMoney;
                            value.other = other;
                            value.otherMoney = otherMoney;
                            value.eating = eating;
                            value.eatingMoney = eatingMoney;
                            value.gather = gather;
                            value.gatherMoney = gatherMoney;
                            value.totalMoney = totalMoney;

                            travelSum += travel;
                            travelMoneySum += travelMoney;
                            hotelSum += hotel;
                            hotelMoneySum += hotelMoney;
                            otherSum += other;
                            otherMoneySum += otherMoney;
                            eatingSum += eating;
                            eatingMoneySum += eatingMoney;
                            gatherSum += gather;
                            gatherMoneySum += gatherMoney;
                            totalMoneySum += totalMoney;
                            sumItem = value;
                            return value;
                        }
                    }))
                    if(typeof callback == "function")
                        callback(data);
                    console.log(that.queryStandardDataList);
                    if(sumItem != null){
                        sumItem.travelSum = travelSum;
                        sumItem.travelMoneySum = travelMoneySum.toFixed(2);
                        sumItem.hotelSum = hotelSum;
                        sumItem.hotelMoneySum = hotelMoneySum.toFixed(2);
                        sumItem.otherSum = otherSum;
                        sumItem.otherMoneySum = otherMoneySum.toFixed(2);
                        sumItem.eatingSum = eatingSum;
                        sumItem.eatingMoneySum = eatingMoneySum.toFixed(2);
                        sumItem.gatherSum = gatherSum;
                        sumItem.gatherMoneySum = gatherMoneySum.toFixed(2);
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