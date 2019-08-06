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

@connect(() => ({}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    form_ids: [],
    list: [],
    department_list:[],
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        this.save_data(fieldsValue);

      }
    });



  };

  componentDidMount() {

    const { params = {} } = this.props.match;
    id = params.id;


    this.evaluate_form_list_simple();

  }


  department_listAll = () => {


    request(urls.department_listAll, {
      body: {id},
      success: department_list => {
        this.setState({ department_list });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };




  evaluate_form_list_simple = () => {

    this.setState({loading:true});

    request(urls.evaluate_form_list_simple, {
      body: {},
      success: list => {
        this.setState({ list },this.department_listAll.bind(this));
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });

  };

  save_data = (fieldsValue) => {

    const { dispatch } = this.props;
    request(urls.admin_evaluate_subject_category_save, {
      body: { ...fieldsValue },
      success: () => {
        message.success('保存成功');

        setTimeout(()=>{
          router.jump({
            dispatch,
            pathname:`/scale/plain-list`,
            operator:'replace',
          })
        },900);
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });

  };

  handleChange = (value) => {
    // console.log(value);
    this.setState({ form_ids: value });
  };


  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { list, loading, form_ids,department_list } = this.state;
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
              label="名称"
            >
              {
                getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="状态"
            >
              {getFieldDecorator('status', {
                initialValue: 0,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key='statusOption1' value={0}>正常</Option>
                  <Option key='statusOption2' value={4}>已删除</Option>
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


