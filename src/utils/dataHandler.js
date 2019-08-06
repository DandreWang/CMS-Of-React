export const dataHandler = {
  getValues: (obj) => {
    return Object.keys(obj).map(key => obj[key]).join(',');
  },
  upper2specialLower: (str,splitter='-') => {
    // 例如：tableDemo 转成 table-demo
    return str.replace(/[A-Z]/g, word => {
        return splitter + word.toLowerCase();
      }
    );
  },
  type:(value)=>{
    return Object.prototype.toString.call(value).slice(8,-1).toLowerCase();
  },
  obj2queryString:(obj)=>{
    try {
      return Object.keys(obj).map(v=>{
        return `${v}=${obj[v]}`
      }).join('&');
    }catch (e) {
      return '';
    }

  },
  deepClone:(obj)=>{
    let ret;
    const type = dataHandler.type(obj);
    try{
      if(type !== 'array' && type !== 'object'){
        ret = obj;
      } else{
        ret = JSON.parse(JSON.stringify(obj))
      }
    }catch (e) {
      ret = {};
    }

    return ret;
  },
};
