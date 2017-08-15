// 常量
const DEV_SERVER = 'http://127.0.0.1:8080'//'http://172.20.13.230:8082';

//调用java api的url
let protocol = "http";
if (process.env.PROD_SERVER === "ybz.yonyoucloud.com")
    protocol = "https";
var serverHost = protocol + "://" + process.env.PROD_SERVER + "";
var serverUrl = protocol + "://" + process.env.PROD_SERVER + "";
var httpHostUrl = "http://" + process.env.PROD_SERVER + "";

if (process.env.NODE_ENV === 'development') {//开发调试
    serverUrl = DEV_SERVER;
    serverHost = "http://172.20.4.222/";
    httpHostUrl = serverUrl;
}
//portal的url
var localUrl = "http://" + location.host;

if (process.env.PROD_SERVER === "fi.yonyoucloud.com") {
    var loginIndexUrl = 'http://uas.yyuap.com/cas/login?sysid=yonyoufi&verify_code=usercenter&service=' + httpHostUrl + '/login/index';
} else {
    var loginIndexUrl = 'http://uastest.yyuap.com/cas/login?sysid=yonyoufi&verify_code=usercenter&service=' + httpHostUrl + '/login/index';
}

//var requestHeader = "?phone=13920170000" ;
var requestHeader = "";

//友报账

var Config = {
    serverUrl: "http://127.0.0.1:8080",
    localUrl: localUrl,
    serverHost: serverHost,
    refer: {
        referDataUrl: serverUrl + '/refbase_ctr/queryRefJSON', //refer 其他参照，调用refbase_ctr/queryRefJSON 10.3.14.240
        referDataUserUrl: serverUrl + '/refbase_ctr/queryRefUserJSON' //人员参照API
    },
    stdreimburse: {
        querystandarddata: serverUrl + '/nodeexpensestandard/querystandarddata' + requestHeader, // 查询报销标准数据接口
        savestandarddata: serverUrl + '/nodeexpensestandard/savestandarddata' + requestHeader,   //保存
        delstandarddata: serverUrl + '/nodeexpensestandard/deletestandarddata' + requestHeader,  //删除
        updatestandarddata: serverUrl + '/nodeexpensestandard/updatestandarddata' + requestHeader,  //更新 or  编辑
        referranksUrl: serverUrl + '/dutyLevel/findAll',   // 职级参照
        referpostsUrl: serverUrl + '/duty/findAll',        // 职务参照
        filternodeexpensestandarduser: serverUrl + '/filternodeexpensestandard/user' //用户查询
    },
    stdreimburse2: {
        querystandarddata2: serverUrl + '/nodeexpensestandard2/querystandarddata2' + requestHeader, // 查询报销标准数据接口
        savestandarddata2: serverUrl + '/nodeexpensestandard2/savestandarddata2' + requestHeader,   //保存
        delstandarddata2: serverUrl + '/nodeexpensestandard2/deletestandarddata2' + requestHeader,  //删除
        updatestandarddata2: serverUrl + '/nodeexpensestandard2/updatestandarddata2' + requestHeader,  //更新 or  编辑
        referusersUrl: serverUrl + '/userCenter/query2', // 用户参照
        referreimbursebillsUrl: serverUrl + '/billtype2/query2?type=bx' // 报销单参照
    },
    validation: {
        savevalidationdata: serverUrl + '/validation/savevalidationdata' + requestHeader,   //保存
        queryvalidationdata: serverUrl + '/validation/queryvalidationdata' + requestHeader,   //保存
        updatevalidationdata: serverUrl + '/validation/updatevalidationdata' + requestHeader,  //更新 or  编辑
        deletevalidationdata: serverUrl + '/validation/deletevalidationdata' + requestHeader,
        referbillsUrl: serverUrl + '/nodeBilltype2/findAll',      // 职务参照
        refertypesUrl: serverUrl + '/nodedoctype/findAll',   // 类型
        refercodesUrl: serverUrl + '/nodevalidacodes/findAll'
    }, // 项目编码
    // refercodesUrl:'https://ybz.yonyoucloud.com/feeitem/query' ,
    stdreimburse: {
        querystandarddata: serverUrl + '/nodeexpensestandard/querystandarddata' + requestHeader, // 查询报销标准数据接口
        savestandarddata: serverUrl + '/nodeexpensestandard/savestandarddata' + requestHeader,   //保存
        delstandarddata: serverUrl + '/nodeexpensestandard/deletestandarddata' + requestHeader,  //删除
        updatestandarddata: serverUrl + '/nodeexpensestandard/updatestandarddata' + requestHeader,  //更新 or  编辑
        referranksUrl: serverUrl + '/dutyLevel/findAll?phone=13920171111',   // 职级参照
        referpostsUrl: serverUrl + '/duty/findAll?phone=13920171111'        // 职务参照
    },
    bill: {
        queryDetailsData: serverUrl + '/billinfo/getBillInfo' + requestHeader,
        WFHISBYBUSINESSKEY: serverUrl + '/bpm/wfhisByBusinessKey',  // 我的单据流程历史
        approve: serverUrl + '/bpm/approve' //审批 批准
    },
    systemIntegration: {
        getOsType: serverUrl + '/userCenter/getRegisterInfo', // 获取用户信息
        saveErpRegister: serverUrl + '/userCenter/saveErpRegister', // U8/9 /nc 注册
        syncDept: serverUrl + '/basicFile/syncDept', //门同
        syncProject: serverUrl + '/basicFile/syncProject', //项目
        syncProjectClass: serverUrl + '/basicFile/syncProjectClass', //
        cancelSync: serverUrl + '/basicFile/cancelSync'
    },
    webreimburse: {
        saveTravelNode: serverUrl + '/nodeTravel/saveTravelNode' + requestHeader, //交通新增
        updateTravelNode: serverUrl + '/nodeTravel/updateTravelNode' + requestHeader, // 交通修改
        saveHotelNode: serverUrl + '/nodeHotel/saveHotelNode' + requestHeader, // 住宿新增
        updateHotelNode: serverUrl + '/nodeHotel/updateHotelNode' + requestHeader, //住宿修改
        saveEatingNode: serverUrl + '/nodeEating/saveEatingNode' + requestHeader, // 餐饮新增
        updateEatingNode: serverUrl + '/nodeEating/updateEatingNode' + requestHeader, // 餐饮修改
        saveCommunicateNode: serverUrl + '/nodeCommunicate/saveCommunicateNode' + requestHeader, // 通讯新增
        updateCommunicateNode: serverUrl + '/nodeCommunicate/updateCommunicateNode' + requestHeader, //通讯修改
        saveOtherNode: serverUrl + '/nodeOther/saveOtherNode' + requestHeader, // 其他新增
        updateOtherNode: serverUrl + '/nodeOther/updateOtherNode' + requestHeader, //其他修改
        getNodeRefs: serverUrl + '/node/getNodeRefs' + requestHeader, //查询标明哪类记事包含哪个参照类型参数的接口
        queryRefItem: serverUrl + '/node/queryRefJSON' + requestHeader, //查询参照值的接口
        getBillType: serverUrl + '/common/getBillType' + requestHeader, //获取全部单据类型
        getLoanBillItemInformation: serverUrl + '/node/getLoanBillItemInformation' + requestHeader, // 获取表头信息
        getNodesByDateWithTemplatePk: serverUrl + '/node/getNodesByDateWithTemplatePk' + requestHeader, //导入列表接口
        getSaveExpenseKey: serverUrl + '/node/getSaveExpenseKey' + requestHeader, //获取提交Key
        getSeat: serverUrl + '/bookkeeping/getSeat' + requestHeader, //获取座次信息
        saveNodeExpense1: serverUrl + '/node/saveNodeExpense1' + requestHeader, // 提交单据
        checkStandard: serverUrl + '/bookkeeping/checkStandard' + requestHeader, //超标验证
        webReferUrl: serverUrl + '/node/queryRefJSON' + requestHeader,
        updateFile: serverUrl + '/node/updateFile' + requestHeader, //文件上传
        uploadWebFile: serverUrl + '/node/uploadWebFile', // 文件上传 2
        getPhone: serverUrl + '/node/getPhone',  //获取电话号码
    },
    sqrules: {
        query: serverUrl + '/nodeControlRules/query',
        save: serverUrl + '/nodeControlRules/save',
        getBillType: serverUrl + '/nodeControlRules/getBillType',
        queryRefJSON: serverUrl + '/nodeControlRules/queryRefJSON',
        getUserBank: serverUrl + '/node/getUserBank', // 获取个人银行账号
        saveTravelNode: serverUrl + '/nodeTravel/saveTravelNode' + requestHeader, //交通新增
        updateTravelNode: serverUrl + '/nodeTravel/updateTravelNode' + requestHeader, // 交通修改
        saveHotelNode: serverUrl + '/nodeHotel/saveHotelNode' + requestHeader, // 住宿新增
        updateHotelNode: serverUrl + '/nodeHotel/updateHotelNode' + requestHeader, //住宿修改
        saveEatingNode: serverUrl + '/nodeEating/saveEatingNode' + requestHeader, // 餐饮新增
        updateEatingNode: serverUrl + '/nodeEating/updateEatingNode' + requestHeader, // 餐饮修改
        saveCommunicateNode: serverUrl + '/nodeCommunicate/saveCommunicateNode' + requestHeader, // 通讯新增
        updateCommunicateNode: serverUrl + '/nodeCommunicate/updateCommunicateNode' + requestHeader, //通讯修改
        saveOtherNode: serverUrl + '/nodeOther/saveOtherNode' + requestHeader, // 其他新增
        updateOtherNode: serverUrl + '/nodeOther/updateOtherNode' + requestHeader, //其他修改
        getNodeRefs: serverUrl + '/node/getNodeRefs' + requestHeader, //查询标明哪类记事包含哪个参照类型参数的接口
        queryRefItem: serverUrl + '/node/queryRefJSON' + requestHeader, //查询参照值的接口
        getBillType: serverUrl + '/common/getBillType' + requestHeader, //获取全部单据类型
        getLoanBillItemInformation: serverUrl + '/node/getLoanBillItemInformation' + requestHeader, // 获取表头信息
        getNodesByDateWithTemplatePk: serverUrl + '/node/getNodesByDateWithTemplatePk' + requestHeader, //导入列表接口
        getSaveExpenseKey: serverUrl + '/node/getSaveExpenseKey' + requestHeader, //获取提交Key
        getSeat: serverUrl + '/bookkeeping/getSeat' + requestHeader, //获取座次信息
        saveNodeExpense1: serverUrl + '/node/saveNodeExpense1' + requestHeader, // 提交单据
        checkStandard: serverUrl + '/bookkeeping/checkStandard' + requestHeader, //超标验证
        webReferUrl: serverUrl + '/node/queryRefJSON' + requestHeader,
        updateFile: serverUrl + '/node/updateFile' + requestHeader, //文件上传
        uploadWebFile: serverUrl + '/node/uploadWebFile', // 文件上传 2
        getPhone: serverUrl + '/node/getPhone',  //获取电话号码
    },
    allNotes: {
        getTravelList: serverUrl + '/travel/getTravelList' + requestHeader,
        getHotelList: serverUrl + '/hotel/getHotelList' + requestHeader,
        getNotesList: serverUrl + '/notes/getNotesList' + requestHeader,
    },
    allBills:{
        getBillsList:serverUrl+'/bills/getBillsList'+ requestHeader,
    },
    tenant: {
        getTenantListByMobile: serverUrl + '/tenant/getTenantListByMobile' + requestHeader,
        addToTenant: serverUrl + '/tenant/addToTenant' + requestHeader,
        getDataBasesList: serverUrl + '/tenant/getDataBasesList' + requestHeader,
        deleteSingleRelation: serverUrl + '/tenant/deleteSingleRelation' + requestHeader,
        queryUserListByValid: serverUrl + '/tenant/queryUserListByValid' + requestHeader,
        queryTenantInfoByTenantId: serverUrl + '/tenant/queryTenantInfoByTenantId' + requestHeader,
        queryTenantInfoList: serverUrl + '/tenant/queryTenantInfoList' + requestHeader,
    }

};

export default Config;
