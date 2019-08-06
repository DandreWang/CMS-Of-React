import React, { PureComponent, Component, Fragment } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Row,
  Col,
  Collapse,
  Modal,
  Progress,
  Timeline,
  Upload,
  Icon,
  message,
  Input,
  Tooltip,
  Radio,
  InputNumber,
} from 'antd';
export default class TextareaDiy extends Component {
  render() {
    const { styles, onChange, data: { property_name, property_value } = {} } = this.props;
    return (
      <Row gutter={24} className={styles.timeLineItem}>
        <Col span={3}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={21}>
          <TextArea
            placeholder="请输入"
            autosize={{minRows:4,maxRows:12}}
            value={property_value}
            onChange={onChange}
          />
        </Col>
      </Row>
    );
  }
}
