/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class TenantAjaxStore {
    globalStore = GlobalStore;

    @observable queryDataParams = {
        tenantId: "efgf8xd9",
        currentTime: "2016-10-13 00:00:00",
        page: 1, //不支持分页可以先设置为空。
        pagenum: 20
    }
    @observable queryStandardDataList = [];

    @observable DataListColumn = [
        {type: 'string', id: 'tenantId', label: '租户ID'},
        {type: 'string', id: 'tenantName', label: '租户名称'},
        {type: 'string', id: 'tenantAddress', label: '租户地址'},
        {type: 'string', id: 'tenantEmail', label: '租户邮箱'},
        {type: 'string', id: 'tenantFullname', label: '租户公司全称'},
        {type: 'string', id: 'tenantTel', label: '租户电话'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param, callback) {
        var that = this;
        that.globalStore.showWait();
        that.globalStore.hideAlert();
        var params = JSON.stringify(param)
        $.ajax({
            type: "POST",
            url: Config.tenant.getTenantListByMobile,
            contentType: "application/json",
            dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardDataList = Object.assign([], data.data.map((item) => {
                        let tenantId = item.tenantId ? item.tenantId : [];
                        let tenantName = item.tenantName ? item.tenantName : [];
                        let tenantAddress = item.tenantAddress ? item.tenantAddress : [];
                        let tenantEmail = item.tenantEmail ? item.tenantEmail : [];
                        let tenantTel = item.tenantTel ? item.tenantTel : [];
                        let tenantFullname = item.tenantFullname ? item.tenantFullname : [];
                        let isLocal = item.isLocal ?item.isLocal : 0;
                        item.tenantId = tenantId;
                        item.tenantName = tenantName;
                        item.tenantAddress = tenantAddress;
                        item.tenantEmail = tenantEmail;
                        item.tenantTel = tenantTel;
                        item.tenantFullname = tenantFullname;
                        item.isLocal = isLocal;
                        return item;
                    }))
                    if (typeof callback == "function")
                        callback(data);
                } else {
                    that.queryStandardDataList = [];
                    that.globalStore.showError(data.data ? data.data : "查询失败")
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
    deleteStandardData(data, callback) {
        var that = this;
        that.globalStore.showWait();
        var params = data;
        $.ajax({
            type: "POST",
            url: Config.tenant.deleteSingleRelation,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    // that.queryStandardData(params);
                    if (typeof callback == "function")
                        callback(data);
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
        var userMobile = {"userMobile": data.userMobile};
        $.ajax({
            type: "POST",
            url: Config.tenant.addToTenant,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: data => {
                that.globalStore.hideWait();
                if (data.success) {
                    that.queryStandardData(userMobile);
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
            }
        })
    }

    @action getDataBasesList(callback) {
        // let data = [{"name":"n1","value":"v1"},{"name":"n2","value":"v2"},{"name":"n3","value":"v3"}]
        var that = this;
        that.globalStore.hideWait();
        $.ajax({
            type: "POST",
            url: Config.tenant.getDataBasesList,
            dataType: "json",
            contentType: "application/json",
            success: data => {
                if (typeof callback == "function")
                    callback(data);
            },
            error: (xhr, status, err) => {
                that.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
                callback(0)
            }
        })
    }
}