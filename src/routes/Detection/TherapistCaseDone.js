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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './DoctorCase.less';
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

const formItemLayout = tableHandler.styles.formItemLayoutOfListPage;

let defaultParams;

const filterStatusMap = ['全部','待治疗','治疗中'];


const listStatusMap = {
  '0': '待测评',
  '1': '测评中',
  '2': '测评完成',
  '3': '诊断完成',
  '4': '治疗中',
  '9': '治疗正常完成',
  '99': '治疗中断完成',
};
let queryParamForExport;

@connect(() => ({}))
@Form.create()
export default class AnyClass extends PureComponent {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '病历编号',
        dataIndex: 'case_no',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        // fixed: 'right',
        // width: 180,
        render: (text, record) => {
          const {case_status} = record;
          return (
            <div className="editable-row-operations">
              <Fragment>
                <a onClick={() => this.jump({ type:'查看治疗记录', record })}>查看治疗记录</a>
                <Divider type="vertical" />
                <a onClick={() => this.jump({ type:'查看报告', record })}>查看报告</a>
              </Fragment>
            </div>
          );
        },
      },
      {
        title: '患者姓名',
        dataIndex: 'patient_name',
        align: 'center',
      },
      {
        title: '患者ID',
        dataIndex: 'patient_id',
        align: 'center',
      },
      {
        title: '疾病名称',
        dataIndex: 'case_disease_name',
        align: 'center',
      },
      {
        title: '病历状态',
        dataIndex: 'case_status',
        align: 'center',
        render(text) {
          return (
            <span>{listStatusMap[text + '']}</span>
          );
        },
      },
      {
        title: '性别',
        dataIndex: 'patient_sex',
        align: 'center',
        render(text) {
          return (
            <span>{text - 0 === 1 ? '男' : text - 0 === 2 ? '女' : '未知'}</span>
          );
        },
      },
      {
        title: '年龄',
        dataIndex: 'patient_age',
        align: 'center',
      },
      {
        title: '来源科室',
        dataIndex: 'patient_from_department',
        align: 'center',
      },
      {
        title: '临床医生',
        dataIndex: 'patient_from_doctor',
        align: 'center',
      },
    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    patient_cases_for_doctor: [],

    departments: [],
    dep: '',
    doctors: [],
    doc: '',
    from_age:'',
    to_age:'',

    loading: true,
  };

  componentDidMount() {

    defaultParams = {type:6,status:0,current:1,pageSize:20};

    this.get_doctors_of_department(-1);

    this.get_departments();

    this.get_data();

  }

  get_data = (params) => {

    this.setState({ loading: true });

    let payload = lodash.pickBy(params, (value) => {
      return value !== undefined && value !== '';
    });

    payload = Object.assign({}, defaultParams, payload);
    queryParamForExport = payload;

    request(urls.get_patient_case_list, {
      body: { ...payload },
      success: patient_cases_for_doctor => {
        this.setState({ patient_cases_for_doctor });
      },
      fail: errmsg => {
        message.error(errmsg || '获取病例信息失败');
      },
      complete: () => {
        this.setState({ loading: false });
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

  get_departments = (callback=()=>{}) => {
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

  get_doctors_of_department = (config_department_id) => {
    request(urls.admin_config_doctor_list_department_doctors, {
      body: { config_department_id },
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


  jump = ({ type, record }) => {
    const {case_id} = record;
    const {dispatch} = this.props;
    if(type==='查看报告'){
      router.jump({
        dispatch,
        pathname: `/patient/synthesis/${case_id}`,
        newTab:true,
      });
    }else if(type==='查看治疗记录'){
      router.jump({
        dispatch,
        pathname: `/patient/treat-record/${case_id}`,
      });
    }
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      from_age:'',
      to_age:'',
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
    event && event.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      let params = lodash.pickBy(fieldsValue, (value) => {
        return value !== undefined && value !== '';
      });

      const { from_age, to_age } = fieldsValue;
      if (from_age > to_age) {
        return message.error('起始年龄不可大于结束年龄');
      }

      const { dep, doc, departments, doctors } = this.state;

      if(dep){
        const depRes = departments.find(v=>v.name===dep);
        if(depRes){
          params.config_department_id = depRes.id;
        }else{
          params.config_department_id = -1;
        }
      }



      if(doc){
        const docRes = doctors.find(v=>v.name===doc);
        if(docRes){
          params.config_doctor_id = docRes.id;
        }else{
          params.config_doctor_id = -1;
        }
      }



      this.setState({
        formValues: params,
      });

      this.get_data(params);

    });
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
        <Row gutter={{ md: 8, lg: 15 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历状态">
              <Input value='治疗正常完成' disabled/>
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历编号">
              {getFieldDecorator('case_no')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="患者姓名">
              {getFieldDecorator('patient_name')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.create}>新建</Button>

            <a href={`${urls.export_unfiled_cases}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>

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

    const { dep, departments, doc, doctors,from_age,to_age } = this.state;

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
            <FormItem {...formItemLayout} label="病历状态">
              <Input value='治疗正常完成' disabled/>
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历编号">
              {getFieldDecorator('case_no')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="患者姓名">
              {getFieldDecorator('patient_name')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 15 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="性别">
              {
                getFieldDecorator('sex', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value="1">男</Option>
                    <Option value="2">女</Option>
                  </Select>,
                )
              }
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="年龄范围">
              {
                getFieldDecorator('from_age', {
                  initialValue: from_age,
                })(
                  <InputNumber min={0} max={200}/>,
                )
              }
              <span>&nbsp;-&nbsp;</span>
              {
                getFieldDecorator('to_age', {
                  initialValue: to_age,
                })(
                  <InputNumber min={0} max={200}/>,
                )
              }
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

        </Row>
        <Row gutter={{ md: 8, lg: 15 }}>
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
          <Col md={8}>
            <FormItem {...formItemLayout} label="病历列表分类：">
              <Input disabled value='治疗结束列表'/>
            </FormItem>
          </Col>

        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.create}>新建</Button>

            <a href={`${urls.export_unfiled_cases}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>

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

  create = ()=>{
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: '/patient/therapist-create-doc',
    });
  };


  render() {
    const { loading, patient_cases_for_doctor } = this.state;
    const { columns } = this;
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <TableDiy
              rowKey='case_no'
              loading={loading}
              data={patient_cases_for_doctor}
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
