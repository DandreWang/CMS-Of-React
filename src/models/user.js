import {  commonService } from '../services/common';
import {urls} from '../utils/urls';
import * as routerRedux from 'react-router-redux';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *get_user_info({ payload={},success=()=>{}, fail=()=>{}}, { call, put }) {
      const response = yield call(commonService,{url:urls.get_user_info,payload});
      if(response&&response.errcode === 0){
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }else{
        yield put(routerRedux.push(`/user/login`));
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
