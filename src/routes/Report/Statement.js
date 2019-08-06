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
  Avatar, AutoComplete,
} from 'antd';
import TableDiy from 'components/TableDiy';
import TableDiy2 from 'components/TableDiy2';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './Statement.less';
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
        title: '时间',
        dataIndex: 'create_time',
        align: 'center',
      },
      {
        title: '卡号',
        dataIndex: 'card_no',
        align: 'center',
      },
      {
        title: '卡类别',
        dataIndex: 'card_category_name',
        align: 'center',
      },
      {
        title: '卡面额(元)',
        dataIndex: 'card_category_price',
        align: 'center',
      },
      {
        title: '卡用途',
        dataIndex: 'card_category_use_type',
        align: 'center',
      },
      {
        title: '病历编号',
        dataIndex: 'case_no',
        align: 'center',
      },
      {
        title: '患者姓名',
        dataIndex: 'patient_name',
        align: 'center',
      },
      {
        title: '患者性别',
        dataIndex: 'patient_sex',
        align: 'center',
      },
      {
        title: '患者生日',
        dataIndex: 'patient_birthday',
        align: 'center',
      },
      {
        title: '临床医生',
        dataIndex: 'from_doctor_name',
        align: 'center',
      },
      {
        title: '来源科室',
        dataIndex: 'from_department_name',
        align: 'center',
      },


    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    consume_records:[],

    loading:true,
    departments: [],
    dep: '',
    doctors: [],
    doc: '',
  };

  componentDidMount() {

    // const {params={}} = this.props.match;

    // console.log(this.props.location.payload);
    // console.log(this.props.location);

    // const {payload={}} = this.props.location;
    // filter_type = payload.filter_type||0;

    defaultParams = {current:1,pageSize:20};

    this.get_doctors_of_department(-1);

    this.get_departments();

    this.get_data();

  }

  get_doctors_of_department = (id) => {
    request(urls.admin_config_doctor_list_department_doctors, {
      body: { config_department_id:id },
      success: doctors => {
        this.setState({ doctors, doc: '' });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  get_departments = (callback) => {
    request(urls.admin_config_doctor_list_departments, {
      body: {},
      success: departments => {

        try {
          this.setState({ departments, dep: '' });
          callback && callback();

        } catch (e) {
          message.error('获取失败');
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  onSelectDepartment = (value) => {
    this.setState({ dep: value });
  };

  onSearchDepartment = (value) => {
    this.setState({ dep: value });
  };


  onChangeDepartment = (value) => {

    const { dep, departments } = this.state;

    this.setState({ dep: value });

    if(!value){
      this.get_doctors_of_department(-1);
    }else{
      try {
        const id = departments.find(v => v.name === value).id;
        this.get_doctors_of_department(id);
      } catch (e) {
        this.setState({ doctors: [], doc: '' });
      }
    }

  };

  onInputDoctor = (value) => {
    this.setState({ doc: value });
  };


  get_data = (params) => {


    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });

    payload = Object.assign({},defaultParams,payload);

    if(payload.range_picker&&payload.range_picker.length===2){
      try{
        const {range_picker} = payload;
        const start_date = moment(range_picker[0]).format('YYYY-MM-DD');
        const end_date = moment(range_picker[1]).format('YYYY-MM-DD');
        payload.start_date = start_date;
        payload.end_date = end_date;
        delete payload.range_picker;
      }catch (e) {
        return message.error('操作失败');
      }
    }
    queryParamForExport = payload;

    this.setState({loading:true});

    request(urls.get_consume_records,{
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
      doc:'',
      dep:'',
    });
    this.get_doctors_of_department(-1);
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

      const { dep, doc, departments, doctors } = this.state;

      if(dep){
        const depRes = departments.find(v=>v.name===dep);
        if(depRes){
          params.from_department_id = depRes.id;
        }else{
          params.from_department_id = -1;
        }
      }



      if(doc){
        const docRes = doctors.find(v=>v.name===doc);
        if(docRes){
          params.from_doctor_id = docRes.id;
        }else{
          params.from_doctor_id = -1;
        }
      }

      this.setState({
        formValues: params,
      });

      this.get_data(params);

    });
  };




  expandedRowRender = (record)=>{
    let com = null;
    const columns = [
      {
        title: '明细类型',
        dataIndex: 'item_type',
        align: 'center',
      },
      {
        title: '明细名称',
        dataIndex: 'item_name',
        align: 'center',
      },
      {
        title: '明细金额(元)',
        dataIndex: 'item_price',
        align: 'center',
      },
    ];
    try{
      const {details=[]} = record||{};
      com = (
        <div className={styles.expandedRowRender}>
          <TableDiy2
            rowKey='item_name'
            data={details}
            columns={columns}
          />
        </div>

      )
    }catch (e) {
      com = null;
    }

    return com;
  };


  renderSimpleForm() {

    const { form: { getFieldDecorator } } = this.props;

    const { dep, departments, doc, doctors } = this.state;

    let dataSourceDepartment = [];
    let dataSourceDoctor = [];
    if (!dep) {
      dataSourceDepartment = departments.map(v => v.name);
    } else {
      dataSourceDepartment = departments.filter(v => v.name.indexOf(dep) === 0).map(v => v.name);
    }

    if (!doc) {
      dataSourceDoctor = doctors.map(v => v.name);
    } else {
      dataSourceDoctor = doctors.filter(v => v.name.indexOf(doc) === 0).map(v => v.name);
    }

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
            <FormItem {...formItemLayout} label="来源科室">
              <AutoComplete
                dataSource={dataSourceDepartment}
                style={{ width: '100%' }}
                onSelect={this.onSelectDepartment}
                onSearch={this.onSearchDepartment}
                onChange={this.onChangeDepartment}
                placeholder=""
                value={dep}
              />
            </FormItem>

          </Col>

          <Col md={8}>
            <FormItem {...formItemLayout} label="临床医生">
              <AutoComplete
                dataSource={dataSourceDoctor}
                style={{ width: '100%' }}
                onSelect={this.onInputDoctor}
                onSearch={this.onInputDoctor}
                onChange={this.onInputDoctor}
                placeholder=""
                value={doc}
              />
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a href={`${urls.admin_card_consume_export_detail}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down"/>
            </a>
          </span>
        </div>

      </Form>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;

    const { dep, departments, doc, doctors } = this.state;

    let dataSourceDepartment = [];
    let dataSourceDoctor = [];
    if (!dep) {
      dataSourceDepartment = departments.map(v => v.name);
    } else {
      dataSourceDepartment = departments.filter(v => v.name.indexOf(dep) === 0).map(v => v.name);
    }

    if (!doc) {
      dataSourceDoctor = doctors.map(v => v.name);
    } else {
      dataSourceDoctor = doctors.filter(v => v.name.indexOf(doc) === 0).map(v => v.name);
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 15 }}>
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
            <FormItem {...formItemLayout} label="来源科室">
              <AutoComplete
                dataSource={dataSourceDepartment}
                style={{ width: '100%' }}
                onSelect={this.onSelectDepartment}
                onSearch={this.onSearchDepartment}
                onChange={this.onChangeDepartment}
                placeholder=""
                value={dep}
              />
            </FormItem>

          </Col>

          <Col md={8}>
            <FormItem {...formItemLayout} label="临床医生">
              <AutoComplete
                dataSource={dataSourceDoctor}
                style={{ width: '100%' }}
                onSelect={this.onInputDoctor}
                onSearch={this.onInputDoctor}
                onChange={this.onInputDoctor}
                placeholder=""
                value={doc}
              />
            </FormItem>
          </Col>

        </Row>

        <Row>
          <Col md={8}>
            <FormItem {...formItemLayout} label="卡类型">
              {
                getFieldDecorator('use_type', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value="1">测评卡</Option>
                    <Option value="2">治疗卡</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
        </Row>


        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a href={`${urls.admin_card_consume_export_detail}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} >
              <Button type="primary">
                导出
              </Button>
            </a>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
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
              expandedRowRender={(record)=>{return this.expandedRowRender(record)}}
              loading={loading}
              data={consume_records}
              columns={columns}
              onChange={this.handleTableChange}
              expandRowByClick
              scroll={{ x: '130%' }} /* todo */ // 列数很多时才设置
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
