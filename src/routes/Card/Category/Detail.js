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
    loading:true,
    use_type:'',
    use_type_obj:[],
    code:'',
    name:'',
    price:'',
    status:'',
  };


  componentDidMount() {

    const {params={}} = this.props.match;
    id = params.id;

    this.common_status_detail();

  }


  get_data = () => {

    request(urls.admin_consume_card_category_get, {
      body: { id },
      success: items => {
        this.setState({ ...items });

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
      pathname: `/card/category-edit/${id}`,
    });
  };

  common_status_detail = () => {

    this.setState({loading:true});

    request(urls.common_status_detail, {
      body: {name:'分类-卡类用途'},
      method:'get',
      success: use_type_obj => {
        this.setState({ use_type_obj },()=>this.get_data());
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  render() {

    const {loading,
      code,name,price,use_type,use_type_obj={}, status,
    } = this.state;
    const statusMap = {'0':'正常','4':'已删除'};
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="消费卡分类详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="分类编码">{code||'无'}</Description>
            <Description className={styles.infoItem} term="分类名称">{name||'无'}</Description>
            <Description className={styles.infoItem} term="面额(元)">{price||'无'}</Description>
            <Description className={styles.infoItem} term="用途类型">{use_type_obj[use_type]||'无'}</Description>
            <Description className={styles.infoItem} term="状态">{statusMap[status+'']||'无'}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


