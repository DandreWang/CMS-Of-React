import { stringify } from 'qs';
import request from '../utils/request';
import {dataHandler} from '../utils/dataHandler';

export async function common(params) {
  const {operator='list',page='',...restParams} = params;
  let ret;
  const path = `/${dataHandler.upper2specialLower(page,'_')}/${operator}`;
  const isGet = ['list','info'].indexOf(operator)!==-1;
  if(isGet){
    ret = request(`${path}?${stringify(restParams)}`);
  }else{
    ret = request(`${path}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: operator,
      },
    });
  }
  return ret;
}

export async function commonConfig() {
  // return request(`/commonCong?${stringify(params)}`);
  return request(`/commonConfig/fetch`);
}






export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function submitAnswer(params) {
  return request('/api/detection/answer',{
    method: 'POST',
    body: params,
  });
}
export async function getList(params) {
  return request('/api/detection/getList',{
    method: 'POST',
    body: params,
  });
}
export async function getSuccessList(params) {
  return request('/api/detection/getSuccessList',{
    method: 'POST',
    body: params,
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryPatientTest(params) {
  return request(`/api/scale/patientTest?id=${params.id}`);
}
