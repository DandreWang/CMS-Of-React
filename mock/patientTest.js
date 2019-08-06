import { parse } from 'url';

const personalDataSource = [];
for (let i = 0; i < 46; i += 1) {
  personalDataSource.push({
    key: i,
    id: `201800${i}`,
    status: Math.floor(Math.random() * 10) % 4,
    height: 170 + i % 7,
    weight: 56 + i % 7,
    name: ['刘天宇', '张三', '李四'][i % 3],
    sex: ['男', '女'][i % 2],
    age: i,
    typeName: ['常规', '严重'][i % 2],
    department: ['眼科', '内科', '中医科'][i % 3],
    doctor: ['张医生', '郭医生', '李医生'][i % 3],
  });
}
export function getPatientTestData(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;

  const dataSource = personalDataSource.filter(data => data.id === params.id);

  const result = {
    personalDetail: dataSource[0],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getPatientTestData,
};
