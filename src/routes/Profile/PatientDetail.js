import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, Icon, Timeline, Button, List } from 'antd';
import DescriptionList from 'components/DescriptionList';
import { PieDiy } from 'components/Charts';
import lodash from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PatientDetail.less';
import {router} from "../../utils/router";

const { Description } = DescriptionList;

const colorSelect = ['selectRed', 'selectOrange', 'selectGreen'];

const diaData = [
  {
    id: 1,
    itemName: '复诊',
    time: '2018-03-05 10:03',
    items: [{
      key: '1',
      type: 1,
      name: '主诉',
      title: ['右侧肢体活动不利、言语困难1天。'],
    },{
      key: '2',
      type: 1,
      name: '仪器检测',
      title: ['脑电：脑功能状态中度偏离', '心电：副交感低活跃状态，心能量指数7.59 重度偏离'],
    },{
      key: '3',
      type: 1,
      name: '量表检测',
      title: ['scl-90: 躯体化:轻度', '偏执:轻度', '焦虑:轻度'],
    },{
      key: '4',
      type: 2,
      name: '诊断结果',
      title: ['抑郁症、焦虑症', '用药建议: 黛力新', '治疗建议: 经颅磁 x 10，心理安抚 x 10'],
    },{
      key: '5',
      type: 3,
      name: '治疗记录',
      title: ['经颅磁 使用: 1次 剩余: 5次', '心理安抚 使用: 1次 剩余: 5次'],
    }],
  },
  {
    id: 2,
    itemName: '治疗',
    time: '2018-03-04 11:17',
    items: [{
      key: '1',
      type: 3,
      name: '治疗记录',
      title: ['经颅磁 使用: 1次 剩余: 5次', '心理安抚 使用: 1次 剩余: 5次'],
    }],
  },
  {
    id: 3,
    itemName: '首访',
    time: '2018-03-04 09:38',
    items: [{
      key: '1',
      type: 1,
      name: '主诉',
      title: ['右侧肢体活动不利、言语困难1天。'],
    },{
      key: '2',
      type: 1,
      name: '仪器检测',
      title: ['脑电：脑功能状态中度偏离', '心电：副交感低活跃状态，心能量指数7.59 重度偏离'],
    },{
      key: '3',
      type: 1,
      name: '量表检测',
      title: ['scl-90: 躯体化:轻度', '偏执:轻度', '焦虑:轻度'],
    },{
      key: '4',
      type: 2,
      name: '诊断结果',
      title: ['抑郁症、焦虑症', '用药建议: 黛力新', '治疗建议: 经颅磁 x 10，心理安抚 x 10'],
    }],
  },
];

const columns = [
  {
    title: '仪器',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '检测时间',
    dataIndex: 'age',
    key: 'age',
    align: 'center',
  },
  {
    title: '操作',
    className: 'profile-tabTool',
    key: 'action',
    align: 'center',
    render: () => <span><a>查看</a></span>,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
  },
];

const columns1 = [
  {
    title: '量表',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '检测时间',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
  },
  {
    title: '得分',
    className: 'profile-tabTool',
    dataIndex: 'num',
    key: 'num',
    align: 'center',
    render: (text) => (
      <span className={colorSelect[window.parseInt(Math.random() * 3)]}>{text}</span>
    ),
  },
  {
    title: '操作',
    className: 'profile-tabTool',
    key: 'action',
    align: 'center',
    render: () => <span><a>查看</a></span>,
  },
];

const data1 = [
  {
    key: '1',
    name: '症状自评量表',
    time: '2018-02-12',
    num: 11,
  },
  {
    key: '2',
    name: '广泛性焦虑量表',
    time: '2018-02-12',
    num: 22,
  },
  {
    key: '3',
    name: '简易智能精神',
    time: '2018-02-12',
    num: 33,
  },
  {
    key: '4',
    name: '简易智能精神',
    time: '2018-02-12',
    num: 44,
  },
];

const pieData = [
  {
    x: '经磁颅刺激治疗',
    y: 3,
  },
  {
    x: '音乐放松治疗',
    y: 3,
  },
  {
    x: '生物反馈治疗',
    y: 1,
  },
  {
    x: '精神分析治疗',
    y: 2,
  },
  {
    x: '行为分析治疗',
    y: 1,
  },
  {
    x: '沙盘治疗',
    y: 1,
  },
];

const ListContent = ({ data: { title } }) => (
  <div className={styles.listContent}>
    {
      title.map((t,idx) => {
        return <span key={idx} className={styles.listContentItem}>{t}</span>
      })
    }
  </div>
);

const TimeTitle = ({ title }) => <div className={styles.timeTitle}>{title}</div>;

const btns = ['检测', '诊断', '治疗'];

const TimeItem = ({obj, children}) => (
  <Row gutter={{ md: 8, lg: 16 }}>
    <Col span={4}>
      <div>{obj.time.substr(0,10)}</div>
      {obj.time.substr(11,5)}
    </Col>
    <Col span={20} className={styles.mainCard}>
      <TimeTitle title={obj.itemName} />
      {children}
    </Col>
  </Row>
);

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchBasic'],
}))
export default class BasicProfile extends Component {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  jump = (type, id) => {
    const { dispatch } = this.props;
    const routes = ['','/patient/synthesis','/patient/diagnostic','/patient/treatment'];
    router.jump({
      dispatch,
      pathname: routes[type],
      payload: {
        id,
      },
    });
  };

  TimeCard = ({obj}) => (
    <Card key={obj.type} className={styles.cardItem}>
      <List
        size="large"
        rowKey="id"
        split={false}
        pagination={false}
        dataSource={obj.list}
        renderItem={item => (
          <List.Item>
            <div className={styles.cardConTit}>{`${item.name}：`}</div>
            <ListContent data={item} />
          </List.Item>
        )}
      />
      <div className={styles.cardBtn}>
        <Icon type="file" className={styles.icons}/>
        <a onClick={() => this.jump(obj.type, obj.id)}>{`${btns[obj.type - 1]}报告`}</a>
      </div>
    </Card>
  );

  render() {
    const { loading } = this.props;
    const timeData = lodash.map(diaData, d => ({
      ...d,
      items: lodash.map(lodash.groupBy(d.items, 'type'), (list, key) => ({
        type: key,
        list,
      })),
    }));

    return (
      <PageHeaderLayout>
        <div className={styles.topWrapper}>
          <div className={styles.topDetail}>
            <span className={styles.topNm}>张雪峰</span>
            <span className={styles.topImfor}>
              <span>性别：男</span>
              <Divider type="vertical" />
              <span>年龄：28</span>
              <Divider type="vertical" />
              <span>身高：170</span>
              <Divider type="vertical" />
              <span>体重：140</span>
            </span>
            <Button type="primary" className={styles.toBtn}>前往检测</Button>
          </div>
          <div className={styles.impression}>
            <span className={styles.hisTit}>历史症候：</span>
            <span className={styles.item}>抑郁症</span>
            <span className={styles.item}>躯体形式症状</span>
            <span className={styles.item}>抑郁症</span>
          </div>
        </div>
        <Row gutter={{ md: 8, lg: 16 }}>
          <Col span={15}>
            <Card bordered={false} className={styles.timeWrap}>
              <Timeline>
                {
                  timeData.map(d => (
                    <Timeline.Item key={d.id}>
                      <TimeItem obj={d}>
                        {
                          d.items.map( item => this.TimeCard({ obj: item }) )
                        }
                      </TimeItem>
                    </Timeline.Item>
                  ))
                }
              </Timeline>
            </Card>
          </Col>
          <Col span={9}>
            <Card className={styles.rCard} title="治疗记录" extra={<a href="#">查看详情</a>}>
              <PieDiy
                hasLegend
                animate={false}
                subTitle="治疗总次数"
                data={pieData}
                height={180}
                total={() => (
                  <span>{`${pieData.reduce((pre, now) => (now.y - 0) + pre, 0)}次`}</span>
                )}
                valueFormat={val => (<span>{`${val}次`}</span>)}
              />
            </Card>

            <Card className={styles.rCard} title="仪器监测记录" extra={<a href="#">查看详情</a>}>
              <Table columns={columns} dataSource={data} pagination={false} />
            </Card>

            <Card
              title="量表检测记录"
              className={styles.rCard}
              extra={<a href="#">查看详情</a>}
            >
              <Table columns={columns1} dataSource={data1} pagination={false} />
            </Card>

            <Card title="用药记录" className={styles.rCard}>
              <Table columns={columns} dataSource={data} pagination={false} />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
