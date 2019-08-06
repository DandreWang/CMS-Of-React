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

    loading:true,

    role_list:[],
    department_list:[],
    role_level:'',
    edu_list:[],
    marriage_list:[],
  };

  componentDidMount() {

    this.admin_role_list();

    this.department_listAll();

    this.common_status_detail('分类-文化水平');

    this.common_status_detail('分类-婚姻类型');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.admin_account_save,{
          body:{
            ...fieldsValue,
          },
          success:()=>{
            message.success('保存成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/role/staff-list`,
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


  department_listAll = () => {

    request(urls.department_listAll, {
      body: {},
      success: department_list => {
        this.setState({ department_list });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {

      },
    });
  };


  admin_role_list = () => {

    request(urls.admin_role_list, {
      body: { },
      success: data => {
        if(data&&data.list&&data.list.length){
          this.setState({ role_list:data.list,role_level:data.list[0].level });
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  common_status_detail = (name) => {
    request(urls.common_status_detail, {
      body: {name},
      method:'get',
      success: list => {
        if(name==='分类-文化水平'){
          this.setState({ edu_list:list });
        }else if(name==='分类-婚姻类型'){
          this.setState({ marriage_list:list });
        }

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {

        this.setState({ loading: false });


      },
    });
  };


  onChangeOfRole = (role_level)=>{
    this.setState({role_level})
  };



  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {role_list,department_list,role_level,edu_list,marriage_list} = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;

    return (
      <PageHeaderLayout title="">
        <Card
          bordered={false}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label='角色'
            >
              {getFieldDecorator('role_id', {
                initialValue: role_list&&role_list[0]?role_list[0].id:'',
              })(
                <Select placeholder="请选择" style={{width:'100%'}} onChange={this.onChangeOfRole}>
                  {
                    role_list.map((v,i) => {
                      return (
                        <Option key={`role_list${v.id}`} value={v.id}>{v.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>


            {
              role_level-0!==1?(
                <FormItem
                  {...formItemLayout}
                  label='科室'
                >
                  {getFieldDecorator('department_id', {
                    initialValue: department_list&&department_list[0]?department_list[0].id:'',
                  })(
                    <Select placeholder="请选择" style={{width:'100%'}}>
                      {
                        department_list.map((v,i) => {
                          return (
                            <Option key={`department_list${v.id}`} value={v.id}>{v.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              ):null
            }


            <FormItem
              {...formItemLayout}
              label={'账号名称'}
            >
              {getFieldDecorator('account_name', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'账号密码'}
            >
              {getFieldDecorator('account_pwd', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'手机号'}
            >
              {getFieldDecorator('account_mobile', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'真实姓名'}
            >
              {getFieldDecorator('true_name', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'身份证号'}
            >
              {getFieldDecorator('id_card', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='性别'
            >
              {getFieldDecorator('sex', {
                initialValue: 1,
              })(
                <Select placeholder="请选择" style={{width:'100%'}}>
                  <Option key='sex1' value={1}>男</Option>
                  <Option key='sex2' value={2}>女</Option>
                </Select>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='教育程度'
            >
              {getFieldDecorator('edu_level', {
                initialValue: edu_list&&Object.keys(edu_list)&&Object.keys(edu_list)[0]?Object.keys(edu_list)[0]:'',
              })(
                <Select placeholder="请选择" style={{width:'100%'}}>
                  {
                    Object.keys(edu_list).map((v,i) => {
                      return (
                        <Option key={`edu_list${v}`} value={v}>{edu_list[v]}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='婚姻状况'
            >
              {getFieldDecorator('marriage_type', {
                initialValue: marriage_list&&Object.keys(marriage_list)&&Object.keys(marriage_list)[0]?Object.keys(marriage_list)[0]:'',
              })(
                <Select placeholder="请选择" style={{width:'100%'}}>
                  {
                    Object.keys(marriage_list).map((v,i) => {
                      return (
                        <Option key={`marriage_list${v}`} value={v}>{marriage_list[v]}</Option>
                      );
                    })
                  }
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


