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
  message,
} from 'antd';
import { connect } from 'dva/index';
import { validateValues } from '../../../utils/validate';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { urls } from '../../../utils/urls';

import { tableHandler } from '../../../utils/tableHandler';
import moment from 'moment';
import styles from './Edit.less';
import request from '../../../utils/request';
import { router } from '../../../utils/router';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
let id;
@connect(() => ({
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    detail:{},
    loading:true,
  };

  componentDidMount() {
    const {params={}} = this.props.match;
    id = params.id;
    this.admin_device_category_get();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.admin_device_category_save,{
          body:{
            ...fieldsValue,id,
          },
          success:()=>{
            message.success('保存成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/parameter/category-list`,
              })
            },900);
          },
          fail:(errMsg)=>{
            message.error(errMsg||'保存失败');
          },
        })
      }
    });
  };

  admin_device_category_get = () => {

    this.setState({loading:true});

    request(urls.admin_device_category_get, {
      body: {id},
      success: detail => {
        this.setState({ detail });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { loading, detail:{code='',name='',price=''}={} } = this.state;
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
              label={'设备分类编码'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: code,
              })(
                <Input />,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'设备分类名称'}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: name,
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'价格'}
            >
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: price,
              })(
                <InputNumber min={1} precision={0} style={{width:'100%'}} />,
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


