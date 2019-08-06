import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {urls} from '../utils/urls';
import {commonService} from '../services/common';

import {storageKeys} from '../utils/storageKeys';

// if (window.useProxyFlag_g) {
//   import ('../services/login')
//     .then((fakeAccountLogin) => {
//
//     });
// }

export default {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload={},success=()=>{}, fail=()=>{} }, { call, put }) {
      const response = yield call(commonService, {url:urls.login,payload});
      // Login successfully
      if (response&&response.errcode === 0){
        yield put({
          type: 'changeLoginStatus',
          payload: response.data,
        });
        reloadAuthorized();//更新CURRENT
        localStorage.setItem(storageKeys.login,JSON.stringify(response.data));
        const path = response.data.roleCode==='admin'?'/patient/list':'/workbench/staff';
        yield put(routerRedux.push(path));
      }else{
        fail(response.errmsg);
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            roleCode: 'guest',
          },
        });
        reloadAuthorized();
        localStorage.removeItem(storageKeys.login);
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      setAuthority(payload.roleCode);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
