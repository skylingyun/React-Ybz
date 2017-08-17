import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router';
import Config from './config';
import GlobalStore from './stores/GlobalStore';

import App from './containers/App';

import StdReimburse from './containers/stdreimburse/StdReimburse' ;
import Flights from './containers/stdreimburse/Flights' ;
import Hotel from './containers/stdreimburse/Hotel' ;
import Ship from './containers/stdreimburse/Ship' ;
import Train from './containers/stdreimburse/Train' ;

import StandardReimburse from './containers/StandardReimburse/StandardReimburse';

import Validation from './containers/validation/Validation' ;
import CrossValidation from './containers/validation/CrossValidation' ;

import BillDetails from './containers/bill/Details' ;
import BillEdit from './containers/webreimburse/BillEdit' ;
import WebImport from './containers/webreimburse/WebImport' ;
import Travel from './containers/webreimburse/Travel';
import Other from './containers/webreimburse/Other';
import Hotels from './containers/webreimburse/Hotel';
import Restaurant from './containers/webreimburse/Restaurant';
import Communication from './containers/webreimburse/Communication';
import Web from './containers/webreimburse/WebReimburse';
import Lead from './containers/systemIntegration/Lead';
import SqRules from './containers/sqrules/SqRules';
import NodeTravel from "./containers/datastatssystem/Travel";
import NodeHotel from "./containers/datastatssystem/Hotel";
import Tenant from "./containers/datastatssystem/Tenant";
import Notes from "./containers/datastatssystem/Notes";
import User from "./containers/datastatssystem/User";
import TenantInfo from "./containers/datastatssystem/TenantInfo";
import NotesDetails from "./containers/datastatssystem/NotesDetails";
import Bills from "./containers/datastatssystem/Bills";

const requireAuth = (nextState, replace, next) => {
  //切换路由时初始化环境
  GlobalStore.hideAlert();

  // 本地调试环境不进行auth
  if (process.env.NODE_ENV === 'development' || process.env.PROD_SERVER === "172.20.4.220:8080") {
    next();
    return;
  }

  //验证权限
  $.ajax({
    type: "GET",
    url: Config.base.islogin,
    success: data => {
      if (data.success) {
        next();
      } else {
        window.location = Config.base.index;
      }
    }
  });
}

ReactDom.render(
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <Route path="/stdreimburse" component={StdReimburse}>
          <Route path="flights" component={Flights}/>
          <Route path="hotel" component={Hotel}/>
          <Route path="ship" component={Ship}/>
          <Route path="train" component={Train}/>
        </Route>
        <Route path="/StandardReimburse" component={StandardReimburse} />
        <Route path="/validation" component={Validation}>
          <Route path="crossValidation" component={CrossValidation}/>
        </Route>
        <Route path="/billdetails/:type/:pk/:audit" component={BillDetails} />
        <Route path="/billedit/:pk" component={BillEdit} />
        <Route path="/billimport" component={WebImport} />
        {/*<Route path="/datastatssystem" component={DataStatsSystem}>*/}
        {/*</Route>*/}
        <Route path="/travel" component={NodeTravel}/>
        <Route path="/hotel" component={NodeHotel}/>
        {/*<Route path="/other" component={NodeOther}/>*/}
        {/*<Route path="/eating" component={NodeEating}/>*/}

        <Route path="/tenant" component={Tenant}/>
        <Route path="/tenantInfo" component={TenantInfo}/>
        <Route path="/notes" component={Notes}/>
        <Route path="/notesDetails/:tenantId/:businessTripCount/:expenseCount/:loanBillCount" component={NotesDetails}/>
        <Route path="/bills" component={Bills}/>
        <Route path="/user" component={User}/>
        <Route path="/lead" component={Lead}/>
        <Route path="/web" component={Web}>
          <Route path="travel/:pk" component={Travel}/>
          <Route path="communication/:pk" component={Communication}/>
          <Route path="hotel/:pk" component={Hotels}/>
          <Route path="other/:pk" component={Other}/>
          <Route path="restaurant/:pk" component={Restaurant}/>
        </Route>
        <Route path="sqrules" component={SqRules} />
      </Route>
    </Router>,
    document.getElementById('root')
);
