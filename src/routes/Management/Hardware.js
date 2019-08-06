import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  Button,
  DatePicker,
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
    sm: { span: 11 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 10 },
  },
};

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

  renderForm() {
    return this.state.visible ? this.formContent() : this.formContent1();
  }

  render() {
    const { success: { data }, loading, form } = this.props;
    const { isRead } = this.state;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderLayout>
        <Card bordered={false} className={styles.con}>

          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="硬件名称:">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })( <span>经磁颅刺激治疗1</span> )}
            </FormItem>
            <FormItem {...formItemLayout} label="硬件编号:">
              {getFieldDecorator('ID', {
                rules: [
                  {
                    message: '请选择起止日期',
                  },
                ],
              })(<span>2017001</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="硬件种类:">
              {getFieldDecorator('species', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<span>物理治疗</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="所属科室:">
              {getFieldDecorator('department', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<span>心内科</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="所属医院:">
              {getFieldDecorator('hospital', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<span>演示医院</span>)}
            </FormItem>
            <FormItem {...formItemLayout} label="负责人:">
              {getFieldDecorator('principal', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<span>姚佳华</span>)}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
