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

let id;

@connect(() => ({
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    status:'0',
    name:'',
    code:'',
    dep:'',
    departments:[],
  };


  handleSubmit = (event) => {

    event && event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    this.get_data();
  }

  onSelectOfDepartment = (dep)=>{
    this.setState({dep});
  };

  onSearchOfDepartment = (dep)=>{
    this.onSelectOfDepartment(dep);
  };

  onChangeOfDepartment = (dep)=>{
    this.onSelectOfDepartment(dep);
  };


  get_data = ()=>{
    this.setState({loading:true});
    request(urls.admin_config_doctor_list_departments,{
      body:{},
      success:(departments)=>{
        this.setState({departments})
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        this.setState({loading:false});
      },
    });
  };




  save_data = (event) => {

    event&&event.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        try{
          const {dep,departments} = this.state;
          const res = departments.find(v=>v.name === dep);
          if(res){
            const config_department_id = res.id;
            request(urls.admin_config_doctor_save,{
              body:{...fieldsValue,config_department_id},
              success:()=>{
                message.success('保存成功');

                setTimeout(()=>{
                  router.jump({
                    dispatch,
                    pathname:`/basics/doctor-list`,
                    operator:'replace',
                  })
                },900);
              },
              fail:errmsg=>{
                message.error(errmsg || '获取失败');
              },
              complete:()=>{
              },
            });
          }else{
            message.error('科室不存在');
          }


        }catch (e) {
          message.error('操作失败');
        }

      }else{
        message.error('操作失败');
      }
    });




  };




  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {  loading,code,name,status,departments=[],dep='' } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    let dataSource = [];
    if(!dep){
      dataSource = departments.map(v=>v.name);
    }else{
      dataSource = departments.filter(v=>v.name.indexOf(dep)===0).map(v=>v.name)
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
              label={'医生名称'}
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
              label={'医生编码'}
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
              label={'来源科室'}
              required
            >
              <AutoComplete
                dataSource={dataSource}
                style={{ width: '100%' }}
                onSelect={this.onSelectOfDepartment}
                onSearch={this.onSearchOfDepartment}
                onChange={this.onChangeOfDepartment}
                placeholder=""
                value={dep}
              />
            </FormItem>



            <FormItem {...formItemLayout} label="状态">
              {
                getFieldDecorator('status', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:status+'',
                })(
                  <Select placeholder="请选择">
                    <Option value="0">正常</Option>
                    <Option value="4">逻辑删除</Option>
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


