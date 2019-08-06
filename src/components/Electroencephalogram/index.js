import React, { Component } from 'react';
import { Row,Col } from 'antd';
import styles from './index.less';

export default class Electroencephalogram extends Component {
  state = {
    value: this.props.value,
    editable: false,
  };

  render() {
    return (
      <div className={styles.electroence}>
        <Row gutter={8}>
          <Col span={12}>
            编号：<span>201803001</span>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            姓名：刘云龙
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            性别：男
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            年龄：25
          </Col>
        </Row>
      </div>
    );
  }
}
