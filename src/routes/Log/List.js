import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Menu,
  Divider,
  Popconfirm,
  Dropdown,
  message,
  Form,
  Modal,
  Input,
  Select,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  Badge,
  Avatar,
} from 'antd';
import TableDiy from 'components/TableDiy';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './List.less';
import { dataHandler } from '../../utils/dataHandler';
import { tableHandler } from '../../utils/tableHandler';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import lodash from 'lodash';
import { router } from '../../utils/router';
import { storageHandler } from '../../utils/storageHandler';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option } = Select;

const moreThan2SearchItems = false;
const formItemLayout = tableHandler.styles.formItemLayoutOfListPage;

let defaultParams;
const filterStatusMap = ['全部','待治疗','治疗中'];
let queryParamForExport;

@connect(() => ({
}))
@Form.create()
export default class AnyClass extends PureComponent {

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '操作模块',
        dataIndex: 'module',
        align: 'center',
      },
      {
        title: '操作类型',
        dataIndex: 'action',
        align: 'center',
      },
      {
        title: '操作用户',
        dataIndex: 'worker_account_id_account_name',
        align: 'center',
      },
      {
        title: '操作科室',
        dataIndex: 'department_id_name',
        align: 'center',
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        align: 'center',
      },
      {
        title: '操作时间',
        dataIndex: 'create_time_str',
        align: 'center',
        // render (text) {
        //   return (
        //     <span>{text-0===1?'男':text-0===2?'女':'未知'}</span>
        //   );
        // },
      },
      {
        title: '操作状态',
        dataIndex: 'status',
        align: 'center',
        render:(text)=>{
          const {states} = this.state;
          return states[text];
        },
      },

      {
        title: '操作描述',
        dataIndex: 'description',
        align: 'center',
        width:360,
      },

    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    consume_records:[],

    loading:true,
  };

  componentDidMount() {

    defaultParams = {current:1,pageSize:20};

    this.common_status_detail('状态-操作日志状态');

    this.get_data();

  }

  get_data = (params) => {

    this.setState({loading:true});

    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });

    payload = Object.assign({},defaultParams,payload);

    if(payload.range_picker&&payload.range_picker.length===2){
      try{
        const {range_picker} = payload;
        const from_date = moment(range_picker[0]).format('YYYY-MM-DD');
        const to_date = moment(range_picker[1]).format('YYYY-MM-DD');
        payload.from_date = from_date;
        payload.to_date = to_date;
        delete payload.range_picker;
      }catch (e) {

      }
    }
    queryParamForExport = payload;

    request(urls.admin_action_log_list,{
      body:{...payload},
      success:consume_records=>{
        this.setState({consume_records});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取信息失败');
      },
      complete:()=>{
        this.setState({loading:false})
      },
    });

  };

  common_status_detail = (name,callback=()=>{}) => {

    this.setState({loading:true});

    request(urls.common_status_detail, {
      body: {name},
      method:'get',
      success: states => {
        this.setState({ states});
        callback && callback();
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {



      },
    });
  };




  handleTableChange = (pagination, filtersArg, sorter) => {

    const { formValues } = this.state;

    const params = {
      ...formValues,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    this.get_data(params);

  };

  handleFormReset = () => {
    const { form,dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {range_picker:[]},
    });
    this.get_data();
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = (event) => {
    event.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      let params = lodash.pickBy(fieldsValue, (value)=>{
        return value!==undefined && value!=='';
      });

      this.setState({
        formValues: params,
      });

      this.get_data(params);

    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="时间筛选">
              {getFieldDecorator('range_picker',{
                rules: [{ type: 'array'}],
              })(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>
              <a href={`${urls.admin_action_log_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历编号">
              {getFieldDecorator('case_no')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历状态">
              {getFieldDecorator('status', {
                initialValue: 0,
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  {
                    filterStatusMap.map((v,i) => {
                      return (
                        <Option key={v} value={i}>{v}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="患者姓名">
              {getFieldDecorator('patient_name')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.advancedBtnWrap}>
          <span className={styles.advancedBtns}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>
            <a href={`${urls.patient_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>
            <a className={styles.openBtn} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    if (moreThan2SearchItems) {
      return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    } else {
      return this.renderSimpleForm();
    }
  }

  render() {
    const {loading,consume_records} = this.state;
    const {columns} = this;
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <TableDiy
              rowKey='create_time'
              loading={loading}
              data={consume_records}
              columns={columns}
              onChange={this.handleTableChange}
              scroll={{ x: '130%' }} /* todo */ // 列数很多时才设置
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
