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
    this.department_listAll();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        request(urls.admin_disease_save,{
          body:{
            ...fieldsValue,id,
          },
          success:()=>{
            message.success('保存成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/parameter/disease-list`,
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

  admin_disease_get = () => {


    request(urls.admin_disease_get, {
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

  admin_test_flow_template_listAll = () => {


    request(urls.admin_test_flow_template_listAll, {
      body: {},
      success: template_list => {
        this.setState({ template_list },this.admin_disease_get.bind(this));
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {

      },
    });
  };

  department_listAll = () => {

    this.setState({loading:true});

    request(urls.department_listAll, {
      body: {},
      success: department_list => {
        this.setState({ department_list }, this.admin_test_flow_template_listAll.bind(this));
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {

      },
    });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { loading,template_list,department_list, detail:{code='',name='',bind_treatment_flow_template_id,department_id,category_id_name,department_id_name}={} } = this.state;
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
              label={'疾病编码'}
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
              label={'疾病名称'}
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
              label={'绑定测评流程模板'}
            >
              {getFieldDecorator('bind_treatment_flow_template_id', {
                initialValue: bind_treatment_flow_template_id-0,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  {
                    lodash.isArray(template_list)&&template_list.length?template_list.map((v,i) => {
                      return (
                        <Option key={v.id} value={v.id}>{v.name}</Option>
                      );
                    }):null
                  }
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'所属科室'}
            >
              {getFieldDecorator('department_id', {
                initialValue: department_id-0,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  {
                    lodash.isArray(department_list)&&department_list.length?department_list.map((v,i) => {
                      return (
                        <Option key={v.id} value={v.id}>{v.name}</Option>
                      );
                    }):null
                  }
                </Select>
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


