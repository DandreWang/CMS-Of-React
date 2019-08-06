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

    this.admin_device_category_get();

  }


  admin_device_category_get = () => {

    this.setState({ loading: true });
    request(urls.admin_device_category_get, {
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
      pathname: `/parameter/category-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
      } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    const {code,name,create_worker_account_id_account_name,price,create_time_str} = items;
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="设备分类详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="设备分类编码">{code}</Description>
            <Description className={styles.infoItem} term="设备分类名称">{name}</Description>
            <Description className={styles.infoItem} term="价格(元)">{price}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


