import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
    id: `201800${i}`,
    description: ['发作性胸痛3天,数据量很大，数据量很大数据量很大数据量很大数据量很大，数据量很大，，1233数据流很大，数据量很大数据量很大数据量很大，456', '发作性心肌18年', '反复气短3年'][i % 3],
    status: Math.floor(Math.random() * 10) % 4,
    visitAt: `2018-05-${('00'+(i%31+1)).slice(-2)}`,
    name: ['刘天宇', '张三', '李四'][i % 3],
    sex: ['男', '女'][i % 2],
    age: i,
    doctor: ['张医生', '郭医生', '李医生'][i % 3],
  });
}

export function getTableDemoInfo(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.id) {
    dataSource = dataSource.filter(data => data.id === params.id);
  }
  const result = {
    list: dataSource,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getTableDemo(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        if(s[0]==='visitAt'){
          return next[s[0]] > prev[s[0]]?1:-1;
        }else{
          return next[s[0]] - prev[s[0]];
        }
      }
      if(s[0]==='visitAt'){
        return prev[s[0]]>next[s[0]]?1:-1;
      }else{
        return prev[s[0]] - next[s[0]];
      }
    });
  }
  if (params.sex) {
    if(params.sex-0 ===1){
      params.sex = '男'
    }else if(params.sex-0 ===2){
      params.sex = '女'
    }
    dataSource = [...dataSource].filter(data => data.sex === params.sex);
  }

  if(params.name){
    dataSource = [...dataSource].filter(data => data.name.indexOf(params.name)!==-1);
  }

  if(params.startDate && params.endDate){
    dataSource = [...dataSource].filter(data => data.visitAt<=params.endDate&&data.visitAt>=params.startDate);
  }

  if (params.id) {
    if(params.fullMatch){
      dataSource = dataSource.filter(data => data.id === params.id);
    }else{
      dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
    }
  }

  // 接口仅返回pageSize条数据
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  let current = 1;
  if(params.current){
    current = params.current * 1;
  }
  const start = (current-1)*pageSize;
  const end = current*pageSize;

  const result = {
    list: dataSource.slice(start,end),
    pagination: {
      total: dataSource.length,
      pageSize,
      current,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postTableDemo(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  let { method, id, ...restData } = body;
  method = method==='remove'?method:id?'edit':'add';
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'remove':
      tableListDataSource = tableListDataSource.filter(item => id !== item.id);
      break;
    case 'add':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: `${i}${['a','b','c','d','e'][i%5]}`,
        avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
        id: `201900${i}`,
        description: ['发作性胸痛3天,数据量很大，数据量很大数据量很大数据量很大数据量很大，数据量很大，，1233数据流很大，数据量很大数据量很大数据量很大，456', '发作性心肌18年', '反复气短3年'][i % 3],
        status: Math.floor(Math.random() * 10) % 4,
        visitAt: `2019-01-${('00'+(i%31+1)).slice(-2)}`,
        name: ['刘天宇', '张三', '李四'][i % 3],
        sex: ['男', '女'][i % 2],
        age: i,
        doctor: ['张医生', '郭医生', '李医生'][i % 3],
      });
      break;
    case 'edit':
      const data = tableListDataSource.find(v=> v.id.toString()=== id.toString());
      for(const k in restData){
        data[k] = restData[k];
      }
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getTableDemo,
  postTableDemo,
  getTableDemoInfo,
};
