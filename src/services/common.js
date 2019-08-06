import request from '../utils/request';

export async function commonService({url,payload={}}) {

  return request(url,{
    method: 'POST',
    body:{
      ...payload,
    },
    useModel:true,
  });
}
