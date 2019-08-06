import { queryFakeList,submitAnswer,getList,getSuccessList } from '../services/api';
import {routerRedux} from "dva/router";

export default {
  namespace: 'list',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
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
    *submit({ payload }, { call, put }) {
      const response = yield call(submitAnswer, payload);

      if (response.status === 'ok') {
        yield put(routerRedux.push('/patient/detection-success'));
      }
    },
    *getList({ payload,callback }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });

      if(callback) callback(response);
    },
    *getSuccessList({ payload,callback }, { call, put }) {
      const response = yield call(getSuccessList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });

      if(callback) callback(response);
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
