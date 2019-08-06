import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Modal,
  DatePicker,
  Tooltip,
  Button,
  Menu,
  Dropdown, message, Input,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  TimelineChart,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableDiy from 'components/TableDiy';
import TableDiy2 from 'components/TableDiy2';

import styles from './Billing.less';
import moment from "moment/moment";
import {Form} from "antd/lib/index";
import lodash from 'lodash';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { tableHandler } from '../../utils/tableHandler';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const columns = [
  {
    title: '项目类型',
    dataIndex: 'type',
    align: 'center',
    // render: (text) => (<span className={styles.tit}>{text}</span>),
  },
  {
    title: '数量',
    dataIndex: 'count',
    align: 'center',
    // width:300,
  },
  {
    title: '合计',
    dataIndex: 'total_price',
    align: 'center',
  },
];
const FormItem = Form.Item;

const formItemLayout = tableHandler.styles.formItemLayoutOfListPage;

@connect(({  }) => ({
}))
@Form.create()
export default class MsgRecordManage extends Component {
  state = {
    records_summary:[],
    loading:true,
  };

  get_data = (params) => {

    this.setState({loading:true});

    let payload = lodash.pickBy(params, (value)=>{
      return value!==undefined && value!=='';
    });


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

    request(urls.get_consume_records_summary,{
      body:{...payload},
      success:records_summary=>{
        this.setState({records_summary});
      },
      fail:errmsg=>{
        message.error(errmsg || '获取信息失败');
      },
      complete:()=>{
        this.setState({loading:false})
      },
    });

  };


  componentDidMount() {

    this.get_data();

  }

  componentWillUnmount() {

  }

  handleFormReset = () => {
    const { form,dispatch } = this.props;
    form.resetFields();

    this.get_data();
  };


  handleSearch = (event) => {
    event.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.get_data(fieldsValue);

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
              {/*<Button className={styles.resetBtn} onClick={this.handleFormReset}>重置</Button>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  formatData = (data)=>{
    let ret = [];
    try{
      const {total_price,sub_list} = data;
      sub_list.forEach((value,index)=>{
        const {title,sub_total_price,details} = value;
        details.forEach((ele,j)=>{
          ret.push({
            title:j===0?title:'',
            name:ele.name,
            count:ele.count,
            price:ele.price,
            sub_total_price:j===0?sub_total_price:'',
            isBlock:j===details.length-1?1:0,
          })
        });
      });
      if(total_price>0){
        ret.push({
          title:'总计',
          sub_total_price:total_price,
          isBlock: 1,
        })
      }

    }catch (e) {

    }
    return ret;

  };

  expandedRowRender = (record)=>{
    let com = null;
    const expandedRowColumns = [
      {
        title: '名称',
        dataIndex: 'card_category_name',
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'count',
        align: 'center',
      },
      {
        title: '金额(元)',
        dataIndex: 'total_price',
        align: 'center',
      },
    ];
    try{
      const {details=[]} = record||{};
      com = (
        <div className={styles.expandedRowRender}>
          <TableDiy2
            rowKey='card_category_name'
            data={details}
            columns={expandedRowColumns}
          />
        </div>

      )
    }catch (e) {
      com = null;
    }

    return com;
  };

  render() {

    const {loading, records_summary=[]} = this.state;


    // const data = this.formatData(records_summary);

    return (
      <PageHeaderLayout>
        <Card bordered={false} className={styles.cardWrap}>
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
          <Table
            rowKey='type'
            columns={columns}
            loading={loading}
            expandedRowRender={(record)=>{return this.expandedRowRender(record)}}
            dataSource={records_summary}
            pagination={false}
            expandRowByClick
            // expandedRowKeys={['0','1']}
            rowClassName={(record) => {return (record.details && record.details.length)?'':'report-billing-canNotExpand'}}
            // className={styles.tabTop}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
