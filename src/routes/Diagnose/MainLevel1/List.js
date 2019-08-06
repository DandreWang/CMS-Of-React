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
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './List.less';
import { dataHandler } from '../../../utils/dataHandler';
import { tableHandler } from '../../../utils/tableHandler';
import request from '../../../utils/request';
import { urls } from '../../../utils/urls';
import lodash from 'lodash';
import { router } from '../../../utils/router';
import { storageHandler } from '../../../utils/storageHandler';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = tableHandler.styles.formItemLayoutOfListPage;

let defaultParams,name;
let queryParamForExport;

@connect(() => ({
}))
@Form.create()
export default class AnyClass extends PureComponent {

  constructor(props) {
    super(props);
    this.columns = [


      // 编码（code）、名称（name）、面额（price，整数）、用途类型（use_type，数据来源：/common_status/detail，参数：分类-卡类用途）、状态（0，4）

      {
        title: '编码',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        // fixed: 'right',
        // width: 180,
        render: (text, record) => {
          const {status,id} = record||{};
          const menu = (
            <Menu onClick={(data)=>this.onClickOfMenu(data,record)}>
              <Menu.Item key='1'>
                所属二级诊断参数
              </Menu.Item>
              <Menu.Item key='2'>
                新增二级诊断参数
              </Menu.Item>
            </Menu>
          );
          return (
            <div className="editable-row-operations">
              <Fragment>
                <a onClick={() => this.jump({ type:'查看', record })}>查看</a>
                <Divider type="vertical" />
                <a onClick={() => this.jump({ type:'编辑', record })}>编辑</a>
                {
                  status-0===0?(
                    <Fragment>
                      <Divider type="vertical" />
                      <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove({ record })}>
                        <a>删除</a>
                      </Popconfirm>
                    </Fragment>
                  ):null
                }
                <Divider type="vertical" />
                <Dropdown overlay={menu}>
                  <a href="javascript:void(0);">
                    更多 <Icon type="down" />
                  </a>
                </Dropdown>

              </Fragment>
            </div>
          );

        },
      },

      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render:(text,record)=>{
          const statusMap = {'0':'正常','4':'已删除'};
          return <span>{statusMap[text+'']}</span>
        },
      },
    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    list:[],

    loading:true,

  };

  componentDidMount() {

    defaultParams = {current:1,pageSize:20};

    this.get_data();
  }

  onClickOfMenu = (data,record)=>{
    const { item, key, keyPath } = data||{};
    const {id,name} = record||{};

    const {dispatch} = this.props;
    if(key-0===1){
      dispatch(routerRedux.push({
        pathname:'/diagnose/main/level2-list',
        payload:{
          level1_id:id,
        },
      }));
    }else if(key-0===2){
      dispatch(routerRedux.push({
        pathname:'/diagnose/main/level2-add',
        payload:{
          level1_id:id,
          level1_name:name,
        },
      }));
    }

  };

  get_data = (params) => {

    this.setState({loading:true});

    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });

    payload = Object.assign({},defaultParams,payload);

    queryParamForExport = payload;

    request(urls.admin_config_diagnosis_level1_list,{
      body:{...payload},
      success:list=>{
        this.setState({list});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        this.setState({loading:false})
      },
    });

  };



  jump = ({ type, record }) => {
    const {id} = record;
    const {dispatch} = this.props;

    if(['编辑'].indexOf(type)!==-1){
      router.jump({
        dispatch,
        pathname: `/diagnose/main/level1-edit/${id}`,
      });
    }else if(type==='查看'){
      router.jump({
        dispatch,
        pathname: `/diagnose/main/level1-detail/${id}`,
      });
    }
  };

  remove = ({record})=>{
    this.setState({loading:true});

    const {id} = record||{};
    request(urls.admin_config_diagnosis_level1_delete,{
      body:{id},
      success:()=>{
        this.handleSearch();
      },
      fail:errmsg=>{
        message.error(errmsg || '操作失败');
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
      formValues: {},
    });
    this.get_data();
  };

  handleSearch = (event) => {
    event && event.preventDefault();

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

  create = ()=>{
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: '/diagnose/main/level1-add',
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  <Option key='statusOption0' value=''>全部</Option>
                  <Option key='statusOption1' value={0}>正常</Option>
                  <Option key='statusOption2' value={4}>已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.create}>新建</Button>
            <a href={`${urls.admin_config_diagnosis_level1_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>

          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  <Option key='statusOption0' value=''>全部</Option>
                  <Option key='statusOption1' value={0}>正常</Option>
                  <Option key='statusOption2' value={4}>已删除</Option>
                </Select>
              )}
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };


  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    const {loading,list= []} = this.state;
    const {columns} = this;
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <TableDiy
              rowKey='code'
              loading={loading}
              data={list}
              columns={columns}
              onChange={this.handleTableChange}
              // scroll={{ x: '130%' }} /* todo */ // 列数很多时才设置
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
