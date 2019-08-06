import { routerRedux } from 'dva/router';
import {urls} from '../utils/urls';
import {commonService} from '../services/common';

export default {
  namespace: 'staff',

  state: {
    functions: undefined,
    stats: undefined,
  },

  effects: {
    *get_user_index({ payload={},success=()=>{}, fail=()=>{},complete=()=>{}  }, { call, put }) {
      const response = yield call(commonService, {url:urls.get_user_index,payload});
      if(response&&response.errcode===0){
        success(response.data);
        yield put({
          type: 'update',
          payload: response.data,
        });
      }else{
        fail();
      }
      complete();
    },
    *get_card_detail({ payload={}, success=()=>{}, fail=()=>{},complete=()=>{}  }, { call, put }) {
      const response = yield call(commonService, {url:urls.get_card_detail,payload});
      if(response&&response.errcode===0){
        success(response.data);
      }else{
        fail(response&&response.errmsg)
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
