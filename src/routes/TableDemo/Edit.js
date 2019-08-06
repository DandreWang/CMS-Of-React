import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Tooltip,
  InputNumber,
  Icon,
  Card,
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { tableHandler } from '../../utils/tableHandler';
import moment from 'moment';
import styles from './Edit.less';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const dirNameFirstLetterLower = 'tableDemo';
@connect(({ tableDemo, loading }) => ({
  tableDemo,
  loading: loading.models[dirNameFirstLetterLower],
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {};
  handleSubmit = (event) => {
    tableHandler.submit({
      event, page: this, dirNameFirstLetterLower, dataHandler: function(fieldsValue) {
        const { visitAt } = fieldsValue;
        return {
          visitAt: moment(visitAt).format('YYYY-MM-DD')
        };
      },
    });
  };

  componentDidMount() {
    const { location, dispatch, match: { params: { id } } } = this.props;
    tableHandler.info({
      dispatch,
      dirNameFirstLetterLower,
      payload: { id },
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { tableDemo: { data }, loading } = this.props;
    const { list = [] } = data;
    const { id, name, sex, doctor, visitAt, description } = list[0] || {};
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    return (
      <PageHeaderLayout title="">
        <Card
          bordered={false}
          loading={loading}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label={'姓名'}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: name,
              })(
                <Input/>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('sex', {
                rules: [
                  { required: true, message: '请选择' },
                ],
                initialValue: sex,
              })(
                <Select allowClear={true} placeholder="请选择">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'测评师'}
            >
              {getFieldDecorator('doctor', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: doctor,
              })(
                <Input/>,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="来访时间"
            >
              {getFieldDecorator('visitAt', {
                rules: [{ type: 'object', required: true, message: '请选择日期' }],
                initialValue: moment(visitAt),
              })(
                <DatePicker style={{ width: '100%' }}/>,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'描述'}
            >
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: description,
              })(
                <TextArea rows={4}/>,
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


