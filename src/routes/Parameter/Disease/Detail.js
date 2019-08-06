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

    this.admin_disease_get();

  }


  admin_disease_get = () => {

    this.setState({ loading: true });
    request(urls.admin_disease_get, {
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
      pathname: `/parameter/disease-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
    } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    const {code,name,category_id_name,department_id_name,create_time_str,create_worker_account_id_account_name,bind_treatment_flow_template_id_name} = items;
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="疾病详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="疾病编码">{code||'无'}</Description>
            <Description className={styles.infoItem} term="疾病名称">{name||'无'}</Description>
            {/*<Description className={styles.infoItem} term="分类">{category_id_name||'无'}</Description>*/}
            <Description className={styles.infoItem} term="所属科室">{department_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="绑定测评流程模板名">{bind_treatment_flow_template_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="创建时间">{create_time_str||'无'}</Description>
            <Description className={styles.infoItem} term="创建人">{create_worker_account_id_account_name||'无'}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


