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

class InputTextDiy extends Component {
  render() {
    const { onChange, styles, data: { property_name, property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={4}>
          <Input onChange={onChange} value={property_value} />
        </Col>
      </Row>
    );
  }
}

export default InputTextDiy;
