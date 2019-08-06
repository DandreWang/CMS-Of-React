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

    level1:[],
    lv:'',

    use_type_obj:{},

    loading:false,

  };
  handleSubmit = (event) => {

    event && event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    let level1_name='';
    try{
      level1_name = this.props.location.payload.level1_name;
    }catch (e) {
      level1_name = '';
    }

    if(level1_name){
      this.setState({lv:level1_name});
    }


    this.list_level1_diagnosis();

  }

  list_level1_diagnosis = () => {

    this.setState({loading:true});

    request(urls.list_level1_diagnosis,{
      body:{},
      success:level1=>{
        this.setState({level1});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        this.setState({loading:false})
      },
    });

  };


  save_data = (event) => {

    event&&event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        try{
          const {lv,level1} = this.state;
          const res = level1.find(v=>v.name === lv);
          if(res){
            const level1_diagnosis_id = res.id;
            request(urls.admin_config_diagnosis_level2_save,{
              body:{...fieldsValue,level1_diagnosis_id},
              success:()=>{
                message.success('保存成功');

                setTimeout(()=>{
                  router.jump({
                    dispatch,
                    pathname:`/diagnose/main/level2-list`,
                    operator:'replace',
                  })
                },300);
              },
              fail:errmsg=>{
                message.error(errmsg || '操作失败');
              },
              complete:()=>{
              },
            });
          }else{
            message.error('所属一级诊断参数不存在');
          }


        }catch (e) {
          message.error('操作失败');
        }

      }else{
        message.error('操作失败');
      }

    });




  };

  onInputMatch = (value)=>{

    this.onInputSelect(value);

  };

  onInputChange = (value)=>{
    this.onInputSelect(value);
  };

  onInputSelect = (value)=>{

    this.setState({lv:value});

  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {  loading,use_type_obj={},status } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;

    const {level1=[],lv='' } = this.state;
    let dataSource = [];
    if(!lv){
      dataSource = level1.map(v=>v.name);
    }else{
      dataSource = level1.filter(v=>v.name.indexOf(lv)===0).map(v=>v.name)
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
              label={'名称'}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'编码'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
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

            <FormItem {...formItemLayout} label="一级诊断参数" required>
              <AutoComplete
                dataSource={dataSource}
                style={{ width: '100%' }}
                onSelect={this.onInputSelect}
                onSearch={this.onInputMatch}
                onChange={this.onInputChange}
                placeholder=""
                value={lv}
              />
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


