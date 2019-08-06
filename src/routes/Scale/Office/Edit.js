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
import { validateValues } from '../../../utils/validate';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { tableHandler } from '../../../utils/tableHandler';
import moment from 'moment';
import styles from './Edit.less';
import { message } from 'antd/lib/index';
import lodash from 'lodash';
import { urls } from '../../../utils/urls';
import request from '../../../utils/request';
import { router } from '../../../utils/router';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;

let id,form_ids=[];

@connect(() => ({
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    list:[],
  };
  handleSubmit = (event) => {
    event.preventDefault();

    this.save_form_department_detail();

  };

  componentDidMount() {

    const {params={}} = this.props.match;
    id = params.id;

    this.admin_evaluate_subject_list();


  }

  get_form_department_detail = () => {

    request(urls.admin_evaluate_subject_department_auth_detail, {
      body: { department_id:id },
      success: items => {
        form_ids = items.form_ids;
        this.forceUpdate();

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };

  admin_evaluate_subject_list = () => {

    this.setState({ loading: true });

    request(urls.admin_evaluate_subject_list,{
      body:{pageSize:999999},
      success:data=>{
        const {list=[]} = data||{};
        this.setState({list},this.get_form_department_detail.bind(this));
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
      },
    });

  };

  save_form_department_detail = () => {

    const {dispatch} = this.props;
    request(urls.admin_evaluate_subject_department_auth_auth,{
      body:{department_id:id,form_ids:JSON.stringify(form_ids)},
      success:()=>{
        message.success('保存成功');

        setTimeout(()=>{
          router.jump({
            dispatch,
            pathname:`/scale/office-list`,
            operator:'replace',
          })
        },500);
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
      },
    });

  };

  handleChange = (value)=>{
    form_ids = value;
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { list , loading } = this.state;
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
              label="授权量表"
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择"
                defaultValue={form_ids||[]}
                onChange={this.handleChange}
              >
                {
                  lodash.isArray(list)?(
                      list.map((value,i)=>{
                        return (
                          <Option key={value.id} value={value.id}>{value.name}</Option>
                        )
                      })
                  ):null
                }
              </Select>
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


