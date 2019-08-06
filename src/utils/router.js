import { routerRedux } from 'dva/router';
import {parse,stringify} from 'qs';

export const router = {
  jump: ({dispatch,pathname,operator='push',payload={},newTab=false}) => {

    if(newTab){
      const {href} = window.location;
      window.open([href.split('#')[0],pathname].join('#'),'_blank');
    }else{
      // operator：push、replace
      dispatch(routerRedux[operator]({
        // pathname: `/table-demo/${page}`+(no?`/${no}`:``), //刷新页面时，可得no
        pathname,
        payload,
        // state: {
        //   no,
        // },
      }));
    }

  },
  back: ({page}) => {
    page.props.history.go(-1);
  },
};
