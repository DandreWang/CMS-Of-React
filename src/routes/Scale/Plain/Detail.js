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
    request(urls.admin_evaluate_subject_get, {
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
      pathname: `/scale/plain-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
      } = this.state;
    const {
      subject,questions = [],
    } = items||{};

    const {name='',price=''} = subject||{};

    const letterDigitArr = ['A','B','C','D','E','F','G','H','I','J','K','L'];

    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="普通量表管理详情页"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="名称">{name||'无'}</Description>
            <Description className={styles.infoItem} term="价格(元)">{price||'无'}</Description>
          </DescriptionList>

          {
            questions&&questions.length?(

              questions.map((value,index)=>{
                const {title='',selections=[]} = value||{};
                return (
                  <div className={styles.question} key={`${title}`}>
                    <div className={styles.title}>{`${index+1}、${title}`}</div>
                    {
                      selections&&selections.length?(
                        selections.map((item,key)=>{
                          return (
                            <div key={`option-${index}-${key}`} className={styles.option}>{`${letterDigitArr[key]}、${item}`}</div>
                          )
                        })
                      ):null
                    }
                  </div>
                )
              })
            ):null
          }

        </Card>
      </PageHeaderLayout>
    );
  }
}


