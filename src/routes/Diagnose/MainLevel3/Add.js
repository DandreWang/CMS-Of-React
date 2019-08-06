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
    lv1:'',
    level2:[],
    lv2:'',

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
      this.setState({lv1:level1_name});
    }

    let level2_name='';
    try{
      level2_name = this.props.location.payload.level2_name;
    }catch (e) {
      level2_name = '';
    }

    if(level2_name){
      this.setState({lv2:level2_name});
    }


    this.list_level1_diagnosis();

    this.list_level2_diagnosis(-1);

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

  list_level2_diagnosis = (level1_diagnosis_id) => {

    request(urls.list_level2_diagnosis,{
      body:{level1_diagnosis_id},
      success:level2=>{
        this.setState({level2});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{

      },
    });

  };



  save_data = (event) => {

    event&&event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        try{
          const {lv1,level1,lv2,level2} = this.state;
          const res1 = level1.find(v=>v.name === lv1);
          const res2 = level2.find(v=>v.name === lv2);
          if(res1&&res2){
            const level1_diagnosis_id = res1.id;
            const level2_diagnosis_id = res2.id;
            request(urls.admin_config_diagnosis_level3_save,{
              body:{...fieldsValue,level1_diagnosis_id,level2_diagnosis_id},
              success:()=>{
                message.success('保存成功');

                setTimeout(()=>{
                  router.jump({
                    dispatch,
                    pathname:`/diagnose/main/level3-list`,
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
            message.error(!res1?'所属一级诊断参数不存在':!res2?'所属二级诊断参数不存在':'操作失败');
          }


        }catch (e) {
          message.error('操作失败');
        }

      }else{
        message.error('操作失败');
      }

    });




  };

  onSelectLevel1 = (value) => {
    this.setState({ lv1: value });
  };

  onSearchLevel1 = (value) => {
    this.setState({ lv1: value });
  };


  onChangeLevel1 = (value) => {

    const { lv1, level1 } = this.state;

    this.setState({ lv1: value });

    if(!value){
      this.list_level2_diagnosis(-1);
    }else{
      try {
        const id = level1.find(v => v.name === value).id;
        this.list_level2_diagnosis(id);
      } catch (e) {
        this.setState({ level2: [], lv2: '' });
      }
    }

  };

  onCommonActionLevel2 = (value) => {
    this.setState({ lv2: value });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {  loading,use_type_obj={},status } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;

    const {level1=[],lv1='',level2=[],lv2='' } = this.state;
    let dataSource1 = [];
    if(!lv1){
      dataSource1 = level1.map(v=>v.name);
    }else{
      dataSource1 = level1.filter(v=>v.name.indexOf(lv1)===0).map(v=>v.name)
    }

    let dataSource2 = [];
    if(!lv2){
      dataSource2 = level2.map(v=>v.name);
    }else{
      dataSource2 = level2.filter(v=>v.name.indexOf(lv2)===0).map(v=>v.name)
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

            <FormItem {...formItemLayout} label="所属一级诊断参数" required>
              <AutoComplete
                dataSource={dataSource1}
                style={{ width: '100%' }}
                onSelect={this.onSelectLevel1}
                onSearch={this.onSearchLevel1}
                onChange={this.onChangeLevel1}
                placeholder=""
                value={lv1}
              />
            </FormItem>


            <FormItem {...formItemLayout} label="所属二级诊断参数" required>
              <AutoComplete
                dataSource={dataSource2}
                style={{ width: '100%' }}
                onSelect={this.onCommonActionLevel2}
                onSearch={this.onCommonActionLevel2}
                onChange={this.onCommonActionLevel2}
                placeholder=""
                value={lv2}
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


