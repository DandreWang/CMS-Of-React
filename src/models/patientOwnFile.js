import { routerRedux } from 'dva/router';
import {urls} from '../utils/urls';
import {commonService} from '../services/common';

export default {
  namespace: 'patientOwnFile',

  state: {
    functions: undefined,
    stats: undefined,
  },

  effects: {
    *get_disease_list_by_card({ payload={}, success=()=>{}, fail=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.get_disease_list_by_card,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response.errmsg);
      }
    },
    *save_new_patient({ payload={}, success=()=>{}, fail=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.save_new_patient,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response.errmsg);
      }
    },
  },
  reducers: {
    // updateStaff(state, { payload:{functions,stats}={} }) {
    //   return {
    //     ...state,
    //     functions,
    //     stats,
    //   };
    // },
  },
};
