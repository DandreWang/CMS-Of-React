import { routerRedux } from 'dva/router';
import {urls} from '../utils/urls';
import {commonService} from '../services/common';

export default {
  namespace: 'patientTest',

  state: {
    functions: undefined,
    stats: undefined,
  },

  effects: {
    *save_device_test_flow({ payload={},success=()=>{}, fail=()=>{},complete=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.save_device_test_flow,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response&&response.errmsg);
      }
      complete();
    },
    *save_chielf_test_flow({ payload={},success=()=>{}, fail=()=>{},complete=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.save_chielf_test_flow,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response&&response.errmsg);
      }
      complete();
    },
    *get_patient_case_test_flow({ payload={},success=()=>{}, fail=()=>{},complete=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.get_patient_case_test_flow,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response&&response.errmsg);
      }
      complete();
    },
    *get_patient_case_basic_info({ payload={}, success=()=>{}, fail=()=>{},complete=()=>{}  }, { call, put }) {
      const response = yield call(commonService, {url:urls.get_patient_case_basic_info,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response&&response.errmsg);
      }
      complete();
    },
  },
  reducers: {
    update(state, { payload:{functions,stats}={} }) {
      return {
        ...state,
        functions,
        stats,
      };
    },
  },
};
