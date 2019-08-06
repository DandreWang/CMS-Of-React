import { queryFakeList,submitAnswer,getList,getSuccessList } from '../services/api';
import {routerRedux} from "dva/router";

export default {
  namespace: 'success',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSuccessList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {

      // console.log("response",state ,action);
      return {
        ...state,
        data: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        data: state.data.concat(action.payload),
      };
    },
  },
};
