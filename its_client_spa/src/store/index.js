import Vue from "vue" ;
import Vuex from "vuex";
import Raven from "raven-js";
import _ from "lodash";

Vue.use(Vuex);

import LocationModule from "./modules/location";
import AccountModule from "./modules/account";
import SmartSearchModule from "./modules/smartSearch";
import AreaModule from "./modules/area";
import SearchModule from "./modules/search";
import TagModule from "./modules/tag"
import PlanModule from "./modules/plan"
import GroupModule from "./modules/group"
import RequestModule from "./modules/request"
import UserModule from "./modules/user"
import {
  AuthenticateModule,
  TagDialogModule
} from "../common/store";


const store = new Vuex.Store({
  state: {
    searchContext: {
      plan: undefined,
      planDay: undefined,
      areaId: undefined,
      answers: undefined
    },
    createPlanContext: {
      returnRoute: undefined,
    },
    signinContext: {
      returnRoute: undefined
    },
    previousSearchAreaId: undefined,
    previousSearchAnswers: undefined
  },
  getters: {
    searchContext(state) {
      return state.searchContext;
    },
    createPlanContext(state) {
      return state.createPlanContext;
    },
    previousSearchAreaId(state) {
      return state.previousSearchAreaId;
    },
    signinContext(state) {
      return state.signinContext;
    }
  },
  mutations: {
    searchContext(state, payload) {
      state.searchContext = _.assign(state.searchContext, payload.context);
    },
    createPlanContext(state, payload) {
      state.createPlanContext = _.assign(state.createPlanContext, payload.context);
    },
    signinContext(state, payload) {
      state.signinContext = _.assign(state.signinContext, payload.context);
    },
    previousSearchAreaId(state, payload) {
      state.previousSearchAreaId = payload.areaId;
    },
    previousSearchAnswers(state, payload){
      state.previousSearchAnswers = payload.answers;
    },
    consumeSearchContext(state) {
      state.searchContext = {};
    },
    consumeCreatePlanContext(state) {
      state.createPlanContext = {};
    },
    consumeSigninContext(state) {
      state.signinContext = {};
    }
  },
  actions:{
    resetUserData(context){
      context.commit('plan/setMyVisiblePlans',{plans: null});
    },
  },
  modules: {
    account: AccountModule,
    authenticate: AuthenticateModule,
    location: LocationModule,
    smartSearch: SmartSearchModule,
    area: AreaModule,
    search: SearchModule,
    tag: TagModule,
    tagDialog: TagDialogModule,
    plan: PlanModule,
    group: GroupModule,
    request: RequestModule,
    user: UserModule,
  },
});

store.subscribe((mutation, state) => {
  Raven.captureBreadcrumb({
    message: mutation.type,
    category: 'mutation',
    payload: _.keys(mutation.payload)
  })
});

export default store;
