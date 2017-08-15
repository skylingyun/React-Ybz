/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class HotelAjaxStore {
    globalStore = GlobalStore;

    @observable queryDataParams= {
        tenantId: "efgf8xd9",
        currentTime:"2016-10-13 00:00:00",
        page: 1, //不支持分页可以先设置为空。
        pagenum: 20
    }
    @observable queryStandardDataList = [];

    @observable DataListColumn = [
        {type: 'string', id: 'userId', label: '用户ID'},
        {type: 'string', id: 'startDate', label: '入住时间'},
        {type: 'string', id: 'endDate', label: '离开时间'},
        {type: 'string', id: 'city', label: '所在城市'},
        {type: 'string', id: 'hotel', label: '酒店名称'},
        {type: 'string', id: 'money', label: '金额'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData() {
        var that = this;
        var tenantId= "efgf8xd9";
        var currentTime="2016-10-13 00:00:00";
        that.globalStore.showWait();
        var params = {};
        params.tenantId= tenantId;
        params.currentTime= currentTime;
        $.ajax({
            type: "POST",
            url: Config.allNotes.getHotelList,
            // contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardDataList = Object.assign([], data.data.map((item) => {
                        let userId = item.userid ? item.userid : [];
                        let startDate = item.startDate ? item.startDate : [];
                        let endDate = item.endDate ? item.endDate : [];
                        let city = item.city ? item.city : [];
                        let hotel = item.hotel ? item.hotel : [];
                        let money = item.money ? item.money : [];
                        item.userid = userId;
                        item.startDate = startDate;
                        item.endDate = endDate;
                        item.city = city;
                        item.hotel = hotel;
                        item.money = money;
                        return item;
                    }))

                    console.log(that.queryStandardDataList);
                    that.items = Math.ceil(data.totalnum / data.pagenum)
                    console.log(that.items);
                    that.activePage = data.page
                    console.log(that.activePage);
                } else {
                    that.globalStore.showError(data.message ? data.message : "查询失败")
                }
            },
            error: (xhr, status, err) => {
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
            }
        })
    }

    //删除接口
    @action
    deleteStandardData(data) {
        var that = this;
        that.globalStore.showWait();
        $.ajax({
            type: "POST",
            url: Config.stdreimburse.delstandarddata,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            // contentType: "application/x-www-form-urlencoded",
            // data: data, //{standardids:[pk1]}
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardData();
                } else {
                    that.globalStore.showError(data.message ? data.message : "查询失败")
                }
            },
            error: (xhr, status, err) => {
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
            }
        })
    }

    //保存
    @action
    saveStandardData(data, callback) {
        var that = this;
        that.globalStore.showWait();
        $.ajax({
            type: "POST",
            url: Config.stdreimburse.savestandarddata,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardData();
                    callback(1)
                } else {
                    that.globalStore.showError(data.message ? data.message : "保存失败")
                    callback(0)
                }
            },
            error: (xhr, status, err) => {
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
                callback(0)
            }
        })
    }

    //更新
    @action
    updateStandardData(data, callback) {
        var that = this;
        that.globalStore.showWait();
        $.ajax({
            type: "POST",
            url: Config.stdreimburse.updatestandarddata,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardData();
                    callback(1)
                } else {
                    that.globalStore.showError(data.message ? data.message : "更新失败")
                    callback(0)
                }
            },
            error: (xhr, status, err) => {
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
                callback(0)
            }
        })
    }

    //仓位
    /*@action
     getList(data){
     var that =this;
     that.globalStore.showWait();
     $.ajax({
     type: "POST",
     url: Config.bx.FlightsGetList,
     dataType: "json",
     contentType: "application/json",
     data: JSON.stringify(data),
     success: data => {
     that.globalStore.hideWait();
     if (data.success) {
     that.FlightsList=Object.assign([],data.data);
     }else{
     that.globalStore.showError(data.message?data.message:"获取失败")
     }
     },
     error: (xhr, status, err) => {
     that.globalStore.hideWait();
     this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
     }
     })
     }*/

}