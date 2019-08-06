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
    parent_id_name:'',
    grand_parent_id_name:'',
    grand_parent_id:'',
    level2:[],
    lv2:'',

  };
  handleSubmit = (event) => {
    event && event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    const {params={}} = this.props.match;

    id = params.id;



    this.get_data();


  }



  get_data = () => {

    this.setState({ loading: true });

    request(urls.admin_config_diagnosis_level3_get, {
      body: { id },
      success: items => {
        const {parent_id_name,grand_parent_id} = items;
        this.setState({ ...items,lv2:parent_id_name });

        this.list_level2_diagnosis(grand_parent_id);


      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };



  save_data = (event) => {

    event&&event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const {grand_parent_id,parent_id} = this.state;

        // const {  lv2, level2 } = this.state;
        //
        // let level2_diagnosis_id = '';
        //
        // if(lv2){
        //   const lv2Res = level2.find(v=>v.name===lv2);
        //   if(lv2Res){
        //     level2_diagnosis_id = lv2Res.id;
        //   }
        // }

        // if(level2_diagnosis_id){
        //
        // }else{
        //   return message.error('所属二级诊断参数不存在');
        // }
        //

        request(urls.admin_config_diagnosis_level3_save,{
          body:{id,...fieldsValue,level1_diagnosis_id:grand_parent_id,level2_diagnosis_id:parent_id},
          success:()=>{
            message.success('保存成功');

            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/diagnose/main/level3-list`,
                operator:'replace',
              })
            },500);
          },
          fail:errmsg=>{
            message.error(errmsg || '操作失败');
          },
          complete:()=>{
          },
        });

      }
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

  onCommonActionLevel2 = (value) => {
    this.setState({ lv2: value });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {  loading,code,name,status,parent_id_name,grand_parent_id_name,lv2='',level2=[],price,use_type_obj={},use_type='', } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
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
                initialValue:name,
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
                initialValue:code,
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

            <FormItem {...formItemLayout} label="所属一级诊断参数">
              <span>{grand_parent_id_name}</span>
            </FormItem>

            <FormItem {...formItemLayout} label="所属二级诊断参数">
              <span>{parent_id_name}</span>
            </FormItem>

            {/*<FormItem {...formItemLayout} label="所属二级诊断参数" required>*/}
              {/*<AutoComplete*/}
                {/*dataSource={dataSource2}*/}
                {/*style={{ width: '100%' }}*/}
                {/*onSelect={this.onCommonActionLevel2}*/}
                {/*onSearch={this.onCommonActionLevel2}*/}
                {/*onChange={this.onCommonActionLevel2}*/}
                {/*placeholder=""*/}
                {/*value={lv2}*/}
              {/*/>*/}
            {/*</FormItem>*/}

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


