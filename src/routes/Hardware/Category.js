import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Modal,
  DatePicker,
  Tooltip,
  Button,
  Menu,
  Dropdown,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Category.less';


@connect(({ }) => ({
}))
export default class MsgRecordManage extends Component {
  state = {

  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <PageHeaderLayout>
        <Row gutter={24}>
          <Col className={styles.success} span={24}>页面开发中...</Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
