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

    this.get_data();

  }


  get_data = () => {

    this.setState({ loading: true });
    request(urls.admin_consume_card_get, {
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

  render() {
    const {  loading, items,
      } = this.state;
    const {
      code,category_id_name, status,batch_prefix,
    } = items||{};
    const statusMap = {'0':'未使用','1':'已使用'};
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="卡详情"
          className={styles.infoWrap}
          bordered={false}
          // extra={}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="卡编码">{code||'无'}</Description>
            <Description className={styles.infoItem} term="分类名称">{category_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="状态">{statusMap[status]||'无'}</Description>
            <Description className={styles.infoItem} term="批次前缀">{batch_prefix||'无'}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}

