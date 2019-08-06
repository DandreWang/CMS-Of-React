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

const item_properties_map = {
  '1': '单选框',
  '2': '数字输入框',
  '3': '单行文本',
  '4': '多行文本',
  '5': '图片',
};

let id;

@connect(() => ({}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    items: [

    ],

    code:'',
    name:'',
    price:'',
    description:'',
    // item_properties:'',
    item_type:'',
    item_typeName:'',

  };


  componentDidMount() {

    const {params={}} = this.props.match;
    id = params.id;

    this.admin_treatment_item__get();

  }


  admin_treatment_item__get = () => {

    this.setState({ loading: true });

    request(urls.admin_treatment_item__get, {
      body: { id },
      success: admin_treatment_item => {
        const {item_properties_array=[]} = admin_treatment_item;
        const treat = lodash.omit(admin_treatment_item,['item_properties_array']);
        this.setState({ items:item_properties_array,...treat });

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
      pathname: `/treatment-manage/item-edit/${id}`,
    });
  };

  render() {
    const {  loading, items,
      code,name,price,description,item_type,item_typeName,status} = this.state;
    const { styles: { formItemLayout, tailFormItemLayout, } } = tableHandler;
    const statusMap = {'0':'正常','4':'已删除'};

    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="治疗项目详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="项目编码">{code||'无'}</Description>
            <Description className={styles.infoItem} term="项目名称">{name||'无'}</Description>
            <Description className={styles.infoItem} term="价格（元）">{price||'无'}</Description>
            <Description className={styles.infoItem} term="描述">{description||'无'}</Description>
            <Description className={styles.infoItem} term="治疗项目类型">{item_typeName||'无'}</Description>
            <Description className={styles.infoItem} term="状态">{statusMap[status+'']||'无'}</Description>
          </DescriptionList>

          <FormItem className={styles.items} {...formItemLayout} label="治疗项目属性">
            <div>
              {
                items&&items.length&&items.map((value,i)=>{
                  let ele;
                  const {property_options=[]} = value;
                  const title = item_properties_map[value.property_type+''];
                  switch (value.property_type-0){
                    case 1:
                      ele = property_options&&property_options.length?(
                        <div className={styles.one} key={`${value.property_name}${value.property_type}${i}`}>
                          <div className={styles.titleWrap}>
                            <div className={styles.title}>{title}</div>
                          </div>
                          <div className={styles.content}>
                            <div className={styles.title}>
                              <span className={styles.desc}>描述</span>
                              <span className={styles.input}>{value.property_name}</span>
                            </div>
                            {
                              property_options.map((item,j)=>{
                                return (
                                  <div className={styles.option} key={`one${i}${j}`}>
                                    <span className={styles.desc}>{`选项${j+1}`}</span>
                                    <span className={styles.input}>{item.value}</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      ):null;
                      break;
                    case 2:
                    case 3:
                    case 4:
                      ele = value?(
                        <div className={styles.two} key={`${value.property_name}${value.property_type}${i}`}>
                          <div className={styles.titleWrap}>
                            <div className={styles.title}>{title}</div>
                          </div>
                          <div className={styles.content}>
                            <div className={styles.title}>
                              <span className={styles.desc}>描述</span>
                              <span className={styles.input}>{value.property_name}</span>
                            </div>
                          </div>
                        </div>
                      ):null;
                      break;
                    // case 3:
                    //   break;
                    // case 4:
                    //   break;
                    case 5:
                      ele = value?(
                        <div className={styles.five} key={`${value.property_name}${value.property_type}${i}`}>
                          <span>图片</span>
                          <span className={styles.imgPlaceHolder} />
                        </div>
                      ):null;
                      break;
                    default:
                      ele = null;
                      break;
                  }
                  return ele;
                })
              }
            </div>
          </FormItem>

        </Card>
      </PageHeaderLayout>
    );
  }
}


