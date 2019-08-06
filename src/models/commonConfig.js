import { commonConfig } from '../services/api';

export default {
  namespace: 'commonConfig',

  state: {
  },

  effects: {
    *fetch({ payload={}, callback }, { call, put }) {
      const response = yield call(commonConfig);
      yield put({
        type: 'saveCommonConfig',
        payload: response||{},
      });
    },
  },

  reducers: {
    saveCommonConfig(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
