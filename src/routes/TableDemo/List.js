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

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option } = Select;

const dirNameFirstLetterLower = 'tableDemo'/* todo */;
const moreThan2SearchItems = true;
const formItemLayout = tableHandler.styles.formItemLayoutOfListPage;


@connect(({ tableDemo/* todo */, commonConfig, loading }) => ({
  commonConfig,
  tableDemo/* todo */,
  loading: loading.models[dirNameFirstLetterLower],
}))
@Form.create()
export default class AnyClass extends PureComponent {

  constructor(props) {
    super(props);
    this.columns/* todo */ = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
        /* todo */
        // 入参为sorter: no_descend或no_ascend
        // sorter:true
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
      },
      {
        title: '测评师',
        dataIndex: 'doctor',
        align: 'center',
      },
      {
        title: '来访时间',
        dataIndex: 'visitAt',
        align: 'center',
        // sorter:true
      },
      {
        title: '描述',
        dataIndex: 'description',
        align: 'left',
        className: `${dirNameFirstLetterLower}-description ${styles.description}`, /* todo */
        render (text) {
          return (
            <span className={`${dirNameFirstLetterLower}-text`} title={text}>{text}</span>
          );
        },
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (text, record) => {
          return (
            <div className="editable-row-operations">
              <Fragment>
                <a onClick={() => this.jump({ page: 'detail', record })}>查看</a>
                <Divider type="vertical" />
                <a onClick={() => this.jump({ page: 'edit', record })}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove({ record })}>
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
            </div>
          );
        },
      },
    ];
  }

  state = {
    expandForm: false,
    // 场景：分页、排序
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    tableHandler.list({
      dirNameFirstLetterLower,
      dispatch,
    });

    dispatch({
      type: `commonConfig/fetch`,
    });
  }

  jump = ({ page, record }) => {
    tableHandler.jump({
      page,
      record,
      dirNameFirstLetterLower,
      dispatch: this.props.dispatch,
    });
  };

  remove = ({ record }) => {
    tableHandler.remove({
      record,
      dirNameFirstLetterLower,
      dispatch: this.props.dispatch,
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    tableHandler.handleTableChange({ pagination, filtersArg, sorter, page: this, dirNameFirstLetterLower });
  };

  handleFormReset = () => {
    tableHandler.handleFormReset({ page: this, dirNameFirstLetterLower });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = (event) => {
    tableHandler.handleSearch({
      event, page: this, dirNameFirstLetterLower, dataHandler: function(fieldsValue) {
        // 日期范围 开始
        /* todo */
        // 特殊搜索项
        const rangeDate = tableHandler.handleDateRange({
          fieldsValue,
          key: 'search-date',
          startDateKey: 'startDate',
          endDateKey: 'endDate',
        });
        // 日期范围 结束
        return {
          ...rangeDate,
        };
      },
    });
  };

  renderSimpleForm() {
    /* todo */
    const { form: { getFieldDecorator }, commonConfig } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="编号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          {
            commonConfig&&commonConfig.sex&&Object.keys(commonConfig.sex)&&Object.keys(commonConfig.sex).length?(
              <Col md={8}>
                <FormItem {...formItemLayout} label="性别">
                  {getFieldDecorator('sex')(
                    <Select allowClear placeholder="请选择" className={styles.selectForm}>
                      {
                        Object.keys(commonConfig.sex).map(v => {
                          return (
                            <Option key={v} value={v}>{commonConfig.sex[v]}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            ):null
          }
          <Col md={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>
              {
                moreThan2SearchItems ? (
                  <a className={styles.openBtn} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </a>
                ) : null
              }
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    /* todo */
    const { form: { getFieldDecorator },commonConfig } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24 }}>
          <Col md={8}>
            <FormItem {...formItemLayout} label="编号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          {
            commonConfig&&commonConfig.sex&&Object.keys(commonConfig.sex)&&Object.keys(commonConfig.sex).length?(
              <Col md={8}>
                <FormItem {...formItemLayout} label="性别">
                  {getFieldDecorator('sex')(
                    <Select allowClear placeholder="请选择" className={styles.selectForm}>
                      {
                        Object.keys(commonConfig.sex).map(v => {
                          return (
                            <Option key={v} value={v}>{commonConfig.sex[v]}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            ):null
          }
          <Col md={8}>
            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem {...formItemLayout} label="来访时间">
              {getFieldDecorator('search-date')(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.advancedBtnWrap}>
          <span className={styles.advancedBtns}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>
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
    const { tableDemo/* todo */: { data }, loading } = this.props;
    const {columns} = this;
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  this.jump({ page: 'add' });
                }}
              >
                新建
              </Button>
            </div>
            <TableDiy
              loading={loading}
              data={data}
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
