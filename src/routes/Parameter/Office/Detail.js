import React, { Fragment, PureComponent } from 'react';
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
  message,
} from 'antd';
import { connect } from 'dva/index';
import { validateValues } from '../../../utils/validate';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { urls } from '../../../utils/urls';
import lodash from 'lodash';
import { tableHandler } from '../../../utils/tableHandler';
import moment from 'moment';
import styles from './Detail.less';
import request from '../../../utils/request';
import { router } from '../../../utils/router';
import { dataHandler } from '../../../utils/dataHandler';
import DescriptionList from 'components/DescriptionList';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const { Description } = DescriptionList;

let id;

@connect(() => ({}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    items: {},
    loading:true,
  };


  componentDidMount() {

    const {params={}} = this.props.match;
    id = params.id;

    this.get_form_department_detail();

  }


  get_form_department_detail = () => {

    this.setState({ loading: true });
    request(urls.admin_config_department_get, {
      body: { id },
      success: items => {
        this.setState({ items });

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };

  edit = ()=>{
    const {dispatch} = this.props;
    router.jump({
      dispatch,
      pathname: `/parameter/office-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
      } = this.state;
    const {
      code,name,create_worker_account_id_account_name,
      category_id_name,form_names,create_time_str,
      manager_name,manager_mobile,status,
    } = items||{};
    const statusMap = {'0':'正常','4':'已删除'};
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="科室详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="科室编码">{code||'无'}</Description>
            <Description className={styles.infoItem} term="科室名称">{name||'无'}</Description>
            <Description className={styles.infoItem} term="负责人姓名">{manager_name||'无'}</Description>
            <Description className={styles.infoItem} term="负责人电话">{manager_mobile||'无'}</Description>
            <Description className={styles.infoItem} term="状态">{statusMap[status]||'无'}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


