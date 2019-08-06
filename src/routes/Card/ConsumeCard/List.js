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
      // id、code、name、create_time_str、create_worker_account_id_name
      {
        title: '卡编码',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        // fixed: 'right',
        // width: 180,
        render: (text, record) => {
          return (
            <div className="editable-row-operations">
              <Fragment>
                <a onClick={() => this.jump({ type:'查看', record })}>查看</a>

              </Fragment>
            </div>
          );

        },
      },

      {
        title: '分类名称',
        dataIndex: 'category_id_name',
        align: 'center',
      },

      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        // className:'column-description',
        render:(text,record)=>{
          const statusMap = {'0':'未使用','1':'已使用'};
          return <span>{statusMap[text+'']}</span>
        },
      },
      {
        title: '批次前缀',
        dataIndex: 'batch_prefix',
        align: 'center',
      },
    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    list:[],

    loading:true,


    name:'',
    departments:[],
    cate:'',
  };

  componentDidMount() {

    defaultParams = {current:1,pageSize:20};

    this.get_departments();

    this.get_data();

  }

  onInputMatch = (value)=>{

    this.onInputSelect(value);

  };

  onInputChange = (value)=>{
    this.onInputSelect(value);
  };

  onInputSelect = (value)=>{

    this.setState({cate:value})

  };

  get_departments = (callback=()=>{})=>{


    request(urls.admin_consume_card_list_categories,{
      body:{},
      success:(categories)=>{
        this.setState({categories})
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
        callback && callback();
      },
    });
  };



  get_data = (params) => {

    this.setState({loading:true});

    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });

    payload = Object.assign({},defaultParams,payload);
    queryParamForExport = payload;

    request(urls.admin_consume_card_list,{
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
        pathname: `/card/consume-card-edit/${id}`,
      });
    }else if(type==='查看'){
      router.jump({
        dispatch,
        pathname: `/card/consume-card-detail/${id}`,
      });
    }
  };

  remove = ({record})=>{
    this.setState({loading:true});

    const {id} = record||{};
    request(urls.admin_config_doctor_delete,{
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
      cate:'',
    });
    this.get_data();
  };

  handleSearch = (event) => {
    event && event.preventDefault();

    const { form } = this.props;

    const {cate='',categories=[]} = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      let params = lodash.pickBy(fieldsValue, (value)=>{
        return value!==undefined && value!=='';
      });

      if(cate){
        try {
          params.category_id = categories.find(v=>v.name === cate).id;
        }catch (e) {
          params.category_id = -1;
        }

      }

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
      pathname: '/card/consume-card-add',
    });
  };

  batchCreate = ()=>{
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: '/card/consume-card-batch-add',
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {categories=[],cate='' } = this.state;
    let dataSource = [];
    if(!cate){
      dataSource = categories.map(v=>v.name);
    }else{
      dataSource = categories.filter(v=>v.name.indexOf(cate)===0).map(v=>v.name)
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="卡编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="分类名称">
              <AutoComplete
                dataSource={dataSource}
                style={{ width: 200 }}
                onSelect={this.onInputSelect}
                onSearch={this.onInputMatch}
                onChange={this.onInputChange}
                placeholder=""
                value={cate}
              />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  <Option key='statusOption0' value=''>全部</Option>
                  <Option key='statusOption1' value={0}>未使用</Option>
                  <Option key='statusOption2' value={1}>已使用</Option>
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
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.batchCreate}>批量新建</Button>
            <a href={`${urls.admin_consume_card_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </span>
        </div>

      </Form>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {categories=[],cate='' } = this.state;
    let dataSource = [];
    if(!cate){
      dataSource = categories.map(v=>v.name);
    }else{
      dataSource = categories.filter(v=>v.name.indexOf(cate)===0).map(v=>v.name)
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="卡编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="分类名称">
              <AutoComplete
                dataSource={dataSource}
                style={{ width: 200 }}
                onSelect={this.onInputSelect}
                onSearch={this.onInputMatch}
                onChange={this.onInputChange}
                placeholder=""
                value={cate}
              />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" className={styles.selectForm}>
                  <Option key='statusOption0' value=''>全部</Option>
                  <Option key='statusOption1' value={0}>未使用</Option>
                  <Option key='statusOption2' value={1}>已使用</Option>
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>

        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="批次前缀">
              {getFieldDecorator('prefix')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.create}>新建</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.batchCreate}>批量新建</Button>
            <a href={`${urls.admin_consume_card_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`} style={{ marginLeft: 8 }} ><Button type="primary">导出</Button></a>

            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>

      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };


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
