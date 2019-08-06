import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Input,
  Radio,
  Divider
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import doctorCard from '../../assets/doctorCard.jpeg';

import styles from './Person.less';

@connect(({ success, loading }) => ({
  success,
  loading: loading.models.success,
}))
@Form.create()
export default class PatientOwnFile extends PureComponent {
  state = {
    isRead: false,
    visible: false,
  };

  // 组件加载完成
  componentDidMount() {
    this.props.dispatch({
      type: 'success/fetch',
    });
  }

  componentWillReceiveProps() {


  }

  onChange = e => {
    this.setState({
      visible: e.target.checked,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('表单信息', values);
        // this.props.dispatch({
        //   type: 'form/submitRegularForm',
        //   payload: values,
        // });
      }
    });
  };

  renderForm() {
    return this.state.visible ? this.formContent() : this.formContent1();
  }

  render() {
    const { success: { data }, loading, form } = this.props;

    return (
      <PageHeaderLayout>
        <Card title='用户信息详情'>
          <div className={styles.userDetail}>
            <Row gutter={8}>
              <Col span={8}>
                <label>姓名: </label>
                <span>杨天宇</span>
              </Col>
              <Col span={8}>
                <label>性别: </label>
                <span>男</span>
              </Col>
              <Col span={8}>
                <label>年龄: </label>
                <span>28</span>
              </Col>
              <Col span={8}>
                <label>身份证: </label>
                <span>310113199809020392</span>
              </Col>
              <Col span={8}>
                <label>电话: </label>
                <span>18617190992</span>
              </Col>
              <Col span={8}>
                <label>文化水平: </label>
                <span>本科</span>
              </Col>
              <Col span={8}>
                <label>婚姻状况: </label>
                <span>未婚</span>
              </Col>
            </Row>
          </div>
          <Divider/>
          <div className={styles.userDetail}>
            <Row gutter={8}>
              <Col span={8}>
                <label>角色: </label>
                <span>测评师</span>
              </Col>
              <Col span={8}>
                <label>账号: </label>
                <span>admin1</span>
              </Col>
              <Col span={8}>
                <label>密码: </label>
                <span>666666</span>
              </Col>
              <Col span={8}>
                <label>医生资格证编号: </label>
                <span>yszg93820193</span>
              </Col>
              <Col span={24}>
                <label>医生资格证照片: </label>
                <span><img src={doctorCard} alt=""/></span>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
