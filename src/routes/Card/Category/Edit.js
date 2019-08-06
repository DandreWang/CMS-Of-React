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
    price:'',
    use_type_obj:{},
    use_type:'',

  };
  handleSubmit = (event) => {
    event && event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    const {params={}} = this.props.match;

    id = params.id;

    this.common_status_detail();


  }

  common_status_detail = () => {

    this.setState({loading:true});

    request(urls.common_status_detail, {
      body: {name:'分类-卡类用途'},
      method:'get',
      success: use_type_obj => {
        this.setState({ use_type_obj },()=>{
          this.get_data();
        });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };


  get_data = () => {

    request(urls.admin_consume_card_category_get, {
      body: { id },
      success: items => {
        this.setState({ ...items });

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
        const {  use_type='' } = this.state;
        request(urls.admin_consume_card_category_save,{
          body:{id,...fieldsValue,use_type},
          success:()=>{
            message.success('保存成功');

            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/card/category-list`,
                operator:'replace',
              })
            },900);
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



  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {  loading,code,name,status,price,use_type_obj={},use_type='', } = this.state;
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
              label={'分类名称'}
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
              label={'分类编码'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
                initialValue:code,
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'面额(元)'}
            >
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入' }],
                initialValue:price,
              })(
                <InputNumber min={1} precision={0} style={{width:'100%'}}/>,
              )}
            </FormItem>

            {/*卡用途 先不要删，等需求稳定*/}

            {/*<FormItem {...formItemLayout} label="卡用途">*/}
              {/*{*/}
                {/*getFieldDecorator('use_type', {*/}
                  {/*rules: [{*/}
                    {/*required: true,*/}
                    {/*message: '请输入',*/}
                  {/*}],*/}
                  {/*initialValue:use_type+'',*/}
                {/*})(*/}
                  {/*<Select disabled placeholder="请选择">*/}
                    {/*{*/}
                      {/*use_type_obj&&Object.keys(use_type_obj).length?(*/}
                        {/*Object.keys(use_type_obj).map(v=>{*/}
                          {/*return <Option key={v} value={v}>{use_type_obj[v]}</Option>*/}

                        {/*})*/}
                      {/*):null*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*)*/}
              {/*}*/}
            {/*</FormItem>*/}


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

            <FormItem {...formItemLayout} label="卡用途">
              <span>{use_type_obj&&use_type_obj[use_type+'']?use_type_obj[use_type+'']:''}</span>
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


