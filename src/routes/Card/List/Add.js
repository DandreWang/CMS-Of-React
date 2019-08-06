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
import styles from './Add.less';
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
    detail:{},
    loading:true,
    template_list:[],
    department_list:[],
  };

  componentDidMount() {
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.admin_card_save,{
          body:{
            ...fieldsValue,
          },
          success:()=>{
            message.success('操作成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/card/list`,
              })
            },900);
          },
          fail:(errMsg)=>{
            message.error(errMsg||'操作失败');
          },
        })
      }
    });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { loading,template_list,department_list, detail:{code='',manager_name='',manager_mobile='',name='',bind_treatment_flow_template_id,department_id,category_id_name,department_id_name}={} } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;

    return (
      <PageHeaderLayout title="">
        <Card
          bordered={false}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label={'卡号'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input style={{width:'200px'}} />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'卡面额'}
            >
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入1到99999的数' }],
              })(
                <InputNumber style={{width:'200px'}} min={1} max={99999} precision={0} />,
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


