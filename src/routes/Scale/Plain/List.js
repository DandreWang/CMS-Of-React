import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  AutoComplete,
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

let defaultParams,category_id;
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
        title: '名称',
        dataIndex: 'name',
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
                <Divider type="vertical" />
                <a onClick={() => this.jump({ type:'编辑', record })}>编辑</a>
                {/*<Divider type="vertical" />*/}
                {/*<Popconfirm title="是否要删除？" onConfirm={() => this.remove({ record })}>*/}
                  {/*<a>删除</a>*/}
                {/*</Popconfirm>*/}
              </Fragment>
            </div>
          );

        },
      },

      {
        title: '所属分类名称',
        dataIndex: 'category_id_name',
        align: 'center',
      },

      {
        title: '价格(元)',
        dataIndex: 'price',
        align: 'center',
      },
    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
    list:[],

    categoryOptionsData:[],

    categoryOptionValue:'',

    loading:true,
  };

  componentDidMount() {

    defaultParams = {current:1,pageSize:20};

    this.get_categoryOptionsData();

    this.get_data();


  }

  get_data = (params) => {

    this.setState({loading:true});

    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });

    payload = Object.assign({},defaultParams,payload);

    queryParamForExport = payload;

    request(urls.admin_evaluate_subject_list,{
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

  get_categoryOptionsData = (callback=()=>{})=>{


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

  jump = ({ type, record }) => {
    const {id} = record;
    const {dispatch} = this.props;

    if(['编辑'].indexOf(type)!==-1){
      router.jump({
        dispatch,
        pathname: `/scale/plain-edit/${id}`,
      });
    }else if(type==='查看'){
      router.jump({
        dispatch,
        pathname: `/scale/plain-detail/${id}`,
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
    const { form,dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      categoryOptionValue:'',
    });

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

      let params = lodash.pickBy(fieldsValue, (value)=>{
        return value!==undefined && value!=='';
      });

      params.category_id = category_id;

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
      pathname: '/scale/plain-add',
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {categoryOptionsData,categoryOptionValue} = this.state;
    let dataSource = [];
    if(!categoryOptionValue){
      dataSource = categoryOptionsData.map(v=>v.name);
    }else{
      dataSource = categoryOptionsData.filter(v=>v.name.indexOf(categoryOptionValue)===0).map(v=>v.name)
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
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
          </Col>
          <Col md={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>
              <a
                href={`${urls.admin_evaluate_subject_export}/?${dataHandler.obj2queryString({...queryParamForExport,...storageHandler.getCurrentUserInfo()})}`}
                style={{ marginLeft: 8 }}
              >
                <Button type="primary">
                导出
                </Button>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  onInputMatch = (value)=>{

    this.onInputSelect(value);

  };

  onInputChange = (value)=>{
    this.onInputSelect(value);
  };

  onInputSelect = (value)=>{

    const {categoryOptionsData} = this.state;
    const result = categoryOptionsData.find(v=>v.name === value);
    const {id} = result||{};
    category_id = id||-1;

    this.setState({categoryOptionValue:value})


  };


  renderForm() {
    return this.renderSimpleForm();
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
              rowKey='id'
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
