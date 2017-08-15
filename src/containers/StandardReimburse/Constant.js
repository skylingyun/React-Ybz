var constant = {
    // 政策性标准类型
    policyexpensetypeList: [
        {code: "0001", name: "通讯费"},
        {code: "0002", name: "会议费"},
        {code: "0003", name: "杂费"}
    ],
    // 控制规则
    controlruleList: [
        {code: "by_year", name: "按年度总额控制"},
        {code: "by_quarter", name: "按季度总额控制"},
        {code: "by_month", name: "按月度总额控制"},
        {code: "by_times", name: "按次控制"}
    ],
    // 控制力度
    controlpowerList: [
        {code: "by_rigid", name: "刚性控制"},
        {code: "by_flexible", name: "柔性控制"}
    ],
    // 权限类型
    roletypeList: [
        {code: "by_duty", name: "按职务、职级设置"},
        {code: "by_user", name: "按用户设置"}
    ]
}

export default constant;