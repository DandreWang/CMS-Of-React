import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Tooltip,
  InputNumber,
  Card,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker,
  TimePicker,
} from 'antd';
import { connect } from 'dva/index';
import { validateValues } from '../../utils/validate';
import { tableHandler } from '../../utils/tableHandler';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Add.less';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const dirNameFirstLetterLower = 'tableDemo';
@connect(({}) => ({}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        tableHandler.submit({
          dispatch,
          dirNameFirstLetterLower,
          payload:{...values,fullMatch:true}
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {styles:{formItemLayout,tailFormItemLayout}} = tableHandler;
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="日期选择器"
            >
              {getFieldDecorator('date-picker', {
                rules: [{ type: 'object', required: true, message: '请选择日期' }],
              })(
                <DatePicker className={styles.datePicker} />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="日期&时间选择器"
            >
              {getFieldDecorator('date-time-picker', {
                rules: [{ type: 'object', required: true, message: '请选择日期时间' }],
              })(
                <DatePicker className={styles.datetimePicker} showTime format="YYYY-MM-DD HH:mm:ss"/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="起止日期"
            >
              {getFieldDecorator('range-picker', {
                rules: [{ type: 'array', required: true, message: '请选择日期' }],
              })(
                <RangePicker className={styles.rangePicker} placeholder={['开始日期', '结束日期']}/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={validateValues.email.desc}
            >
              {getFieldDecorator('email', {
                rules: [{
                  pattern: validateValues.email.regex, message: validateValues.email.invalidMsg,
                }, {
                  required: false, message: validateValues.email.emptyMsg,
                }],
              })(
                <Input/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={validateValues.phone.desc}
            >
              {getFieldDecorator('phone', {
                rules: [
                  { pattern: validateValues.phone.regex, message: validateValues.phone.invalidMsg },
                  { required: true, message: validateValues.phone.emptyMsg },
                ],
              })(
                <Input/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'文本输入框-单行'}
            >
              {getFieldDecorator('input', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'文本输入框-多行'}
            >
              {getFieldDecorator('textarea', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入"
                  rows={4}
                />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="数字输入框"
            >
              {getFieldDecorator('input-number', {
                rules: [{ required: true, message: '请输入XXX' }],
              })(
                <InputNumber min={1}/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="下拉选择框"
            >
              {getFieldDecorator('select', {
                rules: [
                  { required: true, message: '请选择' },
                ],
              })(
                <Select allowClear={true} placeholder="请选择">
                  <Option value="1">选项1</Option>
                  <Option value="2">选项2</Option>
                </Select>,
              )}
            </FormItem>


            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => tableHandler.back(this)} className={styles.cancelBtn}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>

    );
  }
}


