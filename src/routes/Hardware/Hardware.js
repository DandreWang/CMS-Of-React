import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  Button,
  Checkbox,
  Input,
  Radio,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Hardware.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ success, loading }) => ({
  success,
  loading: loading.models.success,
}))
@Form.create()
export default class Hardware extends PureComponent {
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

  formContent() {
    return (
      <div className={styles.linkAge}>
        <Checkbox onChange={this.onChange}>经颅磁刺激治疗</Checkbox>
        <Input /> 次
      </div>
    );
  }

  formContent1() {
    return (
      <div className={styles.linkAge}>
        <Checkbox onChange={this.onChange}>经颅磁刺激治疗</Checkbox>
      </div>
    );
  }

  editForm = () =>{
    this.setState({
      isRead: false,
    })
  };

  renderForm() {
    return this.state.visible ? this.formContent() : this.formContent1();
  }

  render() {
    const { loading, form } = this.props;
    const { isRead } = this.state;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>

          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="硬件名称:">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<Input placeholder="请输入" disabled={isRead} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="硬件编号:">
              {getFieldDecorator('ID', {
                rules: [
                  {
                    message: '请选择起止日期',
                  },
                ],
              })( <span>201763</span> )}
            </FormItem>
            <FormItem {...formItemLayout} label="硬件种类:">
              {getFieldDecorator('species', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={isRead}>
                  <Option value="1">种类1</Option>
                  <Option value="2">种类2</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属科室:">
              {getFieldDecorator('department', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={isRead}>
                  <Option value="1">科室1</Option>
                  <Option value="2">科室2</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属医院:">
              {getFieldDecorator('hospital', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={isRead}>
                  <Option value="1">医院1</Option>
                  <Option value="2">医院2</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="负责人:">
              {getFieldDecorator('principal', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled={isRead}>
                  <Option value="1">负责人1</Option>
                  <Option value="2">负责人2</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {/* <Button type="primary" htmlType="submit" loading={submitting}> */}
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
