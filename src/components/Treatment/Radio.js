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
const RadioGroup = Radio.Group;

export default class RadioDiy extends Component {
  render() {
    const { styles, onChange, data: { property_name, property_options = [], property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={20}>
          <RadioGroup onChange={onChange} value={property_value}>
            {
              property_options.map((item, i) => {
                const { value, text } = item;
                return <Radio key={`property_options${value}`} value={value}>{text}</Radio>;
              })
            }
          </RadioGroup>
        </Col>
      </Row>
    );
  }
}
