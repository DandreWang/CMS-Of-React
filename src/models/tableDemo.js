import {common} from '../services/api';
import { dataHandler} from '../utils/dataHandler';

const namespace = 'tableDemo';

export default {
  namespace,

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *list({ payload={}, callback }, { call, put }) {
      payload.operator = 'list';
      payload.page = namespace;
      const response = yield call(common, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *info({ payload={}, callback }, { call, put }) {
      payload.operator = 'info';
      payload.page = namespace;
      const response = yield call(common, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *submit({ payload, callback }, { call, put }) {
      payload.operator = 'submit';
      payload.page = namespace;
      const response = yield call(common, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      payload.operator = 'remove';
      payload.page = namespace;
      const response = yield call(common, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
