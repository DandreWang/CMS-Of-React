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
    request(urls.get_patient_case_basic_info, {
      body: { case_id:id },
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
      case_disease_name,
        case_id,
    case_no,
    patient_age,
    patient_birthday,
    patient_child_count,
    patient_child_index,
    patient_children_desc,
    patient_edu_level,
    patient_from_department,
    patient_from_doctor,
    patient_hand,
    patient_height,
    patient_home_index,
    patient_id,
    patient_job_id,
      patient_job_id_name,
    patient_marriage_type,
    patient_mobile,
    patient_name,
    patient_native_place,
    patient_parents_desc,
    patient_raise_type,
    patient_sex,
    patient_weight,
    } = items||{};
    const statusMap = {'0':'正常','4':'已删除'};
    const sexMap = {'1':'男','2':'女'};
    const handMap = {'1':'右手','2':'左手'};
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="病历详情"
          className={styles.infoWrap}
          bordered={false}
          // extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="病历编号">{case_no||'无'}</Description>
            <Description className={styles.infoItem} term="姓名">{patient_name||'无'}</Description>
            <Description className={styles.infoItem} term="生日">{patient_birthday||'无'}</Description>
            <Description className={styles.infoItem} term="性别">{patient_sex?sexMap[patient_sex]:'无'}</Description>
            <Description className={styles.infoItem} term="身高(cm)">{patient_height||'无'}</Description>
            <Description className={styles.infoItem} term="体重(kg)">{patient_weight||'无'}</Description>
            <Description className={styles.infoItem} term="左右手">{patient_hand?handMap[patient_hand]:'无'}</Description>
            <Description className={styles.infoItem} term="籍贯">{patient_native_place||'无'}</Description>
            <Description className={styles.infoItem} term="文化水平">{patient_edu_level||'无'}</Description>
            <Description className={styles.infoItem} term="家庭排行">{(patient_child_count&&patient_child_index)?(`${patient_child_index}/${patient_child_count}`):'无'}</Description>
            <Description className={styles.infoItem} term="婚姻状况">{patient_marriage_type||'无'}</Description>
            <Description className={styles.infoItem} term="养育方式">{patient_raise_type||'无'}</Description>
            <Description className={styles.infoItem} term="职业">{patient_job_id_name||'无'}</Description>
            <Description className={styles.infoItem} term="来源科室">{patient_from_department||'无'}</Description>
            <Description className={styles.infoItem} term="临床医生">{patient_from_doctor||'无'}</Description>
            <Description className={styles.infoItem} term="联系电话">{patient_mobile||'无'}</Description>
            <Description className={styles.infoItem} term="子女情况">{patient_children_desc||'无'}</Description>
            <Description className={styles.infoItem} term="父母情况">{patient_parents_desc||'无'}</Description>
            <Description className={styles.infoItem} term="疾病流程">{case_disease_name||'无'}</Description>
          </DescriptionList>

        </Card>
      </PageHeaderLayout>
    );
  }
}


