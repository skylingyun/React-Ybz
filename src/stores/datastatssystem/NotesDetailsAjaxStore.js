/**
 * Created by zhangybt on 2017/8/5.
 */
import {observable, action, computed} from 'mobx';
import Config from '../../config'
import  GlobalStore from '../GlobalStore';
import React from 'react';

export default class NotesDetailsAjaxStore {
    globalStore = GlobalStore;

    @observable queryStandardDataList = [];

    @observable DataListColumn = [
        {type: 'string', id: 'userName', label: '用户名称'},
        {type: 'string', id: 'userMobile', label: '用户手机号'},
        {type: 'string', id: 'userPassword', label: '用户密码'},
        {type: 'string', id: 'userEmail', label: '用户邮箱'},
        {type: 'string', id: 'deptName', label: '部门名称'},
        {type: 'string', id: 'ts', label: '时间'},
    ]

    @observable items = 1;

    @observable activePage = 1;

    //查询接口
    @action
    queryStandardData(param , callback) {
        var that = this;
        that.globalStore.showWait();
        var params =JSON.stringify(param)
        $.ajax({
            type: "POST",
            url: Config.tenant.queryUserListByValid,
            contentType: "application/json",
            // dataType: "json",
            data: params,
            success: data => {
                that.globalStore.hideWait();
                if (JSON.parse(data).success) {
                    if(typeof callback == "function")
                        callback(data);
                    that.queryStandardDataList = Object.assign([], JSON.parse(data).data.list.map((item) => {
                        let userName = item.userName ? item.userName : [];
                        let userMobile = item.phone ? item.phone : [];
                        let userPassword = item.password ? item.password : [];
                        let userEmail = item.email ? item.email : [];
                        let deptName = item.deptname ? item.deptname : [];
                        let ts = item.ts ? item.ts : [];
                        item.userName = userName;
                        item.userMobile = userMobile;
                        item.userPassword = userPassword;
                        item.userEmail = userEmail;
                        item.deptName = deptName;
                        item.ts = ts;
                        return item;
                    }))

                    console.log(that.queryStandardDataList);
                    // that.items = JSON.parse(data).data.totalCount
                    // console.log(that.items);
                    // that.activePage = JSON.parse(data).data.totalPage
                    // console.log(that.activePage);
                } else {
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

    @action selectOptions(callback) {
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

    @action selectValid(callback) {
        let data = [{"name":"有效","value":"true"},{"name":"无效","value":"false"}]
        if(typeof callback == "function")
            callback(data);
    }

}