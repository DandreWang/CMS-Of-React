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
@connect(() => ({
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    use_type_all:{},
    detail:{},
  };




  componentDidMount() {

    this.common_status_detail();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.admin_medicine_save,{
          body:{
            ...fieldsValue,
          },
          success:()=>{
            message.success('保存成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/diagnose/medicine-list`,
              })
            },1500);
          },
          fail:(errMsg)=>{
            message.error(errMsg||'保存失败');
          },
        })
      }
    });
  };

  common_status_detail = () => {

    request(urls.common_status_detail, {
      body: {name:'分类-药物服用方式'},
      method:'get',
      success: use_type_all => {
        this.setState({use_type_all})
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
    const { use_type_all={}, loading } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    let use_type_init_value = '';
    try {
      use_type_init_value = Object.keys(use_type_all)[0];
    }catch (e) {
      use_type_init_value = '';
    }
    return (
      <PageHeaderLayout title="">
        <Card
          bordered={false}
          loading={loading}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label={'药物编码'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'药物名称'}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="服用方式">
              {
                getFieldDecorator('use_type', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:use_type_init_value,
                })(
                  <Select placeholder="请选择">
                    {
                      Object.keys(use_type_all).map(v=>{
                        return (<Option key={`${v}`} value={v}>{use_type_all[v+'']}</Option>)
                      })
                    }
                  </Select>
                )
              }
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


