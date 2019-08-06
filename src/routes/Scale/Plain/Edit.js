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
import DescriptionList from 'components/DescriptionList';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const {Description} = DescriptionList;

let id,category_id;

@connect(() => ({
}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    name:'',
    price:'',
    categoryOptionsData:[],
    categoryOptionValue:'',

  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.save_data();

  };

  componentDidMount() {

    const {params={}} = this.props.match;
    id = params.id;


    this.get_categoryOptionsData();

    this.get_data();


  }

  get_categoryOptionsData = (callback=()=>{})=>{


    this.setState({ loading: true });


    request(urls.admin_evaluate_subject_list_category,{
      body:{},
      success:categoryOptionsData=>{
        this.setState({categoryOptionsData});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        typeof callback === 'function' && callback();
      },
    });
  };

  get_data = () => {


    request(urls.admin_evaluate_subject_get,{
      body:{id},
      success:list=>{
        const {subject} = list||{};
        const {name='',price='',category_id:cat_id,category_id_name} = subject||{};
        category_id = cat_id;
        this.setState({name,price,categoryOptionValue:category_id_name||''});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        this.setState({loading:false});
      },
    });

  };



  save_data = () => {

    const {dispatch,form} = this.props;

    if(category_id){
      form.validateFieldsAndScroll((err, fieldsValue) => {

        if (!err) {
          request(urls.admin_evaluate_subject_save,{
            body:{subject_id:id,category_id,...fieldsValue},
            success:()=>{
              message.success('保存成功');

              setTimeout(()=>{
                router.jump({
                  dispatch,
                  pathname:`/scale/plain-list`,
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

    }else {
      message.error('所属分类不存在')
    }




  };


  onInputMatch = (value)=>{

    this.onInputSelect(value);

  };

  onInputChange = (value)=>{
    this.onInputSelect(value);
  };

  onInputSelect = (value)=>{

    const {categoryOptionsData} = this.state;
    const result = categoryOptionsData.find(v=>v.name === value);
    const {id=''} = result||{};
    category_id = id||'';

    this.setState({categoryOptionValue:value})


  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { loading,name,price } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;

    const {categoryOptionsData,categoryOptionValue} = this.state;
    let dataSource = [];
    if(!categoryOptionValue){
      dataSource = categoryOptionsData.map(v=>v.name);
      // dataSource = [];
    }else{
      dataSource = categoryOptionsData.filter(v=>v.name.indexOf(categoryOptionValue)===0).map(v=>v.name)
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
              label="名称"
            >
              <span>{name||'无'}</span>
            </FormItem>

            <FormItem {...formItemLayout} label="价格(元)">
              {getFieldDecorator('price',{initialValue:price})(<InputNumber min={1} precision={0} style={{ width: 200 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属分类">
              <AutoComplete
                dataSource={dataSource}
                style={{ width: 200 }}
                onSelect={this.onInputSelect}
                onSearch={this.onInputMatch}
                onChange={this.onInputChange}
                placeholder=""
                value={categoryOptionValue}
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


