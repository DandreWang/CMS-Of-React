import {storageKeys} from './storageKeys';

export const storageHandler = {
  getCurrentUserInfo:()=>{
    let ret = {};
    try {
      const login = JSON.parse(localStorage.getItem(storageKeys.login));
      ret = {
        account_id:login.account_id,
        token:login.token,
      }

    }catch (e) {
      ret = {};
    }

    return ret;


  },
  getLogin:()=>{
    let ret = {};
    try {
      ret = JSON.parse(localStorage.getItem(storageKeys.login));
    }catch (e) {
      ret = {};
    }
    return ret;
  },
};
