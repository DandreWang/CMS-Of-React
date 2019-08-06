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

    this.admin_account_get();

  }


  admin_account_get = () => {

    this.setState({ loading: true });
    request(urls.admin_account_get, {
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
      pathname: `/role/staff-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
      } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    const {account_name,account_pwd,account_mobile,role_id_name,true_name,id_card,notify_count,edu_levelName,sexName,marriage_typeName,department_id_name,create_time_str} = items;
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="人员详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="账户名">{account_name||'无'}</Description>
            <Description className={styles.infoItem} term="真实姓名">{true_name||'无'}</Description>
            <Description className={styles.infoItem} term="账户密码">{account_pwd||'无'}</Description>
            <Description className={styles.infoItem} term="账户手机号">{account_mobile||'无'}</Description>
            <Description className={styles.infoItem} term="身份证号">{id_card||'无'}</Description>
            <Description className={styles.infoItem} term="教育程度">{edu_levelName||'无'}</Description>
            <Description className={styles.infoItem} term="性别">{sexName||'无'}</Description>
            <Description className={styles.infoItem} term="婚姻状况">{marriage_typeName||'无'}</Description>
            <Description className={styles.infoItem} term="所属角色名">{role_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="所属科室">{department_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="未读消息数">{notify_count||0}</Description>
            <Description className={styles.infoItem} term="创建时间">{create_time_str||'无'}</Description>
            {/*<Description className={styles.infoItem} term="创建人">{create_worker_account_id_account_name}</Description>*/}
            {/*<Description className={styles.infoItem} term="创建时间">{create_time_str}</Description>*/}
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


