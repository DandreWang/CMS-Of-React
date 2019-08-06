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
import lodash from 'lodash';
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
    template_list:[],
    department_list:[],
  };

  componentDidMount() {
    const {params={}} = this.props.match;
    id = params.id;
    this.department_get();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.department_save,{
          body:{
            ...fieldsValue,id,
          },
          success:()=>{
            message.success('保存成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/role/office-list`,
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

  department_get = () => {

    this.setState({loading:true});

    request(urls.department_get, {
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
    const { loading,template_list,department_list, detail:{code='',manager_name,manager_mobile,name='',bind_treatment_flow_template_id,department_id,category_id_name,department_id_name}={} } = this.state;
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
              label={'科室编码'}
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
              label={'科室名称'}
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
              label={'负责人姓名'}
            >
              {getFieldDecorator('manager_name', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: manager_name,
              })(
                <Input />,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'负责人电话'}
            >
              {getFieldDecorator('manager_mobile', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: manager_mobile,
              })(
                <Input />,
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


