import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { commonConfig } from './mock/commonConfig';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData, getProfileAdvancedData } from './mock/profile';
import { getPatientTestData } from './mock/patientTest';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { getTableDemo, postTableDemo,getTableDemoInfo } from './mock/tableDemo';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2333,
      },
    },
    $body: postRule,
  },
  'POST /api/detection/answer': (req, res) => {
    res.send({ status: 'ok' });
  },
  'POST /api/detection/getSuccessList': (req, res) => {
    res.send([
      {
        name: '焦虑心情',
        value: '严重',
      },
      {
        name: '紧张',
        value: '中等',
      },
      {
        name: '害怕',
        value: '轻微',
      },
    ]);
  },
  'POST /api/detection/getList': (req, res) => {
    res.send([
      {
        title: '焦虑心情',
        state: '严重',
        mark: '0',
        options: [
          { label: '无症状', value: '无症状' },
          { label: '轻微', value: '轻微' },
          { label: '中等', value: '中等' },
          { label: '严重', value: '严重' },
        ],
      },
      {
        title: '紧张',
        state: '严重',
        mark: '1',
        options: [
          { label: '无症状', value: '无症状' },
          { label: '轻微', value: '轻微' },
          { label: '中等', value: '中等' },
          { label: '严重', value: '严重' },
        ],
      },
      {
        title: '害怕',
        state: '1',
        mark: '2',
        options: [
          { label: '无症状', value: '无症状' },
          { label: '轻微', value: '轻微' },
          { label: '中等', value: '中等' },
          { label: '严重', value: '严重' },
        ],
      },
    ]);
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /commonConfig/fetch' : (req, res) => {
    res.send(commonConfig);
  },
  'GET /table_demo/list' : getTableDemo,
  'GET /table_demo/info' : getTableDemoInfo,
  'GET /api/scale/patientTest' : getPatientTestData,
  'POST /table_demo/submit': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postTableDemo,
  },
  'POST /table_demo/remove': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postTableDemo,
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  // 'GET /api/scale_list': getScaleList,
  // 'GET /api/create_list': getCreateList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    //治疗师
    if (password === '111111' && userName === 'zls') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'therapist',
      });
      return;
    }
    //测评师
    if (password === '111111' && userName === 'cps') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'tester',
      });
      return;
    }
    //医生
    if (password === '111111' && userName === 'ys') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'doctor',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    console.log(res);
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
