/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class TravelAjaxStore {
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
        {type: 'string', id: 'travelWay', label: '出行方式'},
        {type: 'string', id: 'fromCity', label: '出发城市'},
        {type: 'string', id: 'toCity', label: '到达城市'},
        {type: 'string', id: 'money', label: '金额'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param , callback) {
        var that = this;
        that.globalStore.showWait();
        that.globalStore.hideAlert();
        var params =JSON.stringify(param)
        // var params = {};
        // params.tenantId= tenantId;
        // params.currentTime= currentTime;
        $.ajax({
            type: "POST",
            url: Config.allNotes.getTravelList,
            contentType: "application/json",
            // dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (JSON.parse(data).success) {
                    if(typeof callback == "function")
                        callback(data);
                    that.queryStandardDataList = Object.assign([], JSON.parse(data).data.list.map((item) => {
                        let userId = item.userid ? item.userid : [];
                        let travelWay = item.travelWay ? item.travelWay : [];
                        let fromCity = item.fromCity ? item.fromCity : [];
                        let toCity = item.toCity ? item.toCity : [];
                        let money = item.money ? item.money : [];
                        item.userid = userId;
                        item.travelWay = travelWay;
                        item.fromCity = fromCity;
                        item.toCity = toCity;
                        item.money = money;
                        return item;
                    }))

                    console.log(that.queryStandardDataList);
                    // that.items = JSON.parse(data).data.totalCount
                    // console.log(that.items);
                    // that.activePage = JSON.parse(data).data.totalPage
                    // console.log(that.activePage);
                } else {
                    that.globalStore.showError(data.msg ? data.msg : "查询失败")
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