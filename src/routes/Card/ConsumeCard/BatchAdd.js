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
import styles from './BatchAdd.less';
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
    code:'',
    cate:'',
    category:[],
  };


  handleSubmit = (event) => {

    event && event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    this.get_data();
  }

  onSelectOfDepartment = (cate)=>{
    this.setState({cate});
  };

  onSearchOfDepartment = (cate)=>{
    this.onSelectOfDepartment(cate);
  };

  onChangeOfDepartment = (cate)=>{
    this.onSelectOfDepartment(cate);
  };


  get_data = ()=>{
    this.setState({loading:true});
    request(urls.admin_consume_card_list_categories,{
      body:{},
      success:(category)=>{
        this.setState({category})
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
          const {cate,category} = this.state;
          const res = category.find(v=>v.name === cate);
          if(res){
            const category_id = res.id;
            request(urls.admin_consume_card_batch_add,{
              body:{...fieldsValue,category_id},
              success:()=>{
                message.success('保存成功');

                setTimeout(()=>{
                  router.jump({
                    dispatch,
                    pathname:`/card/consume-card-list`,
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
          }else{
            message.error('分类不存在');
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
    const {  loading,name,category=[],cate='' } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    let dataSource = [];
    if(!cate){
      dataSource = category.map(v=>v.name);
    }else{
      dataSource = category.filter(v=>v.name.indexOf(cate)===0).map(v=>v.name)
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
              label={'批次前缀'}
            >
              {getFieldDecorator('prefix', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'个数'}
            >
              {getFieldDecorator('count', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <InputNumber min={1} max={9999} style={{width:'100%'}} />,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'分类名称'}
              required
            >
              <AutoComplete
                dataSource={dataSource}
                style={{ width: '100%' }}
                onSelect={this.onSelectOfDepartment}
                onSearch={this.onSearchOfDepartment}
                onChange={this.onChangeOfDepartment}
                placeholder=""
                value={cate}
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


