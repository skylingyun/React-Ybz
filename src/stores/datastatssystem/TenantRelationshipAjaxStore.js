/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class TenantRelationshipAjaxStore {
    globalStore = GlobalStore;

    @observable queryDataParams= {
        tenantId: "ft9fbcrw",
        currentTime:"2016-10-13 00:00:00",
        page: 1, //不支持分页可以先设置为空。
        pagenum: 20
    }
    @observable queryStandardDataList = [];

    @observable DataListColumn = [
        {type: 'string', id: 'tenantId', label: '租户ID'},
        {type: 'string', id: 'tenantName', label: '租户名称'},
        {type: 'string', id: 'mobile', label: '用户电话'},
        {type: 'string', id: 'company', label: '用户所在单位'},
        {type: 'string', id: 'deptName', label: '用户所在部门'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param, callback) {
        var that = this;
        that.globalStore.showWait();
        that.globalStore.hideAlert();
        var params = JSON.stringify(param);
        $.ajax({
            type: "POST",
            url: Config.tenant.queryTenantUserRelation,
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    if(typeof callback == "function")
                        callback(data);
                    that.queryStandardDataList = Object.assign([], data.data.list.map((item) => {
                        let tenantId = item.tenantId ? item.tenantId : [];
                        let tenantName = item.tenantName ? item.tenantName : [];
                        let mobile = item.mobile ? item.mobile : [];
                        let company = item.company ? item.company : [];
                        let deptName = item.deptName ? item.deptName : [];
                        item.tenantId = tenantId;
                        item.tenantName = tenantName;
                        item.mobile = mobile;
                        item.company = company;
                        item.deptName = deptName;
                        return item;
                    }))

                    console.log(that.queryStandardDataList);
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
    @action
    syncStandardData(param, callback) {
        var that = this;
        that.globalStore.showWait();
        that.globalStore.hideAlert();
        var params = JSON.stringify(param);
        $.ajax({
            type: "POST",
            url: Config.tenant.updateTenantUserRelation,
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    if(typeof callback == "function")
                        callback(data);
                    /*that.queryStandardDataList = Object.assign([], data.data.list.map((item) => {
                        let tenantId = item.tenantId ? item.tenantId : [];
                        let tenantName = item.tenantName ? item.tenantName : [];
                        let mobile = item.mobile ? item.mobile : [];
                        let company = item.company ? item.company : [];
                        let deptName = item.deptName ? item.deptName : [];
                        item.tenantId = tenantId;
                        item.tenantName = tenantName;
                        item.mobile = mobile;
                        item.company = company;
                        item.deptName = deptName;
                        return item;
                    }))*/
                } else {
                    that.globalStore.showError(data.message ? data.message : "同步失败")
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