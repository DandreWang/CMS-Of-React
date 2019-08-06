import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Select,
  Table,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Checkbox,
  Dropdown,
  InputNumber,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './Edit.less';
import moment from 'moment/moment';
import { routerRedux } from 'dva/router';
import { tableHandler } from '../../../utils/tableHandler';
import request from '../../../utils/request';
import { urls } from '../../../utils/urls';
import { message } from 'antd/lib/index';
import { dataHandler } from '../../../utils/dataHandler';
import lodash from 'lodash';
import { router } from '../../../utils/router';

const FormItem = Form.Item;
const Option = Select.Option;
let id;
@connect(({ }) => ({
}))
export default class MsgRecordManage extends Component {
  state = {
    name:'',
    code:'',
    price:'',

    detail:{},
    devices:[], // 仪器
    evaluate:[], // 量表
    questionnaire:[], // 首访
  };

  componentDidMount() {
    const {params={}} = this.props.match;
    id = params.id;

    this.admin_test_flow_template_get();
    this.admin_device_category_listAll();
    this.evaluate_form_list();
    this.questionnaire_form_list();
  }

  admin_test_flow_template_get = () => {

    request(urls.admin_test_flow_template_get, {
      body: {id},
      success: detail => {

        let {device_categories,hospital_evaluate_form_ids} = detail;

        try{
          device_categories = JSON.parse(device_categories);
        }catch (e) {
          device_categories = [];
        }

        try{
          hospital_evaluate_form_ids = JSON.parse(hospital_evaluate_form_ids);
        }catch (e) {
          hospital_evaluate_form_ids = [];
        }

        const d = Object.assign({},detail,{device_categories,hospital_evaluate_form_ids});

        this.setState({detail:d});

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  admin_device_category_listAll = () => {

    request(urls.admin_device_category_listAll, {
      body: { },
      success: devices => {
        this.setState({ devices });

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  evaluate_form_list = () => {

    request(urls.evaluate_form_list, {
      body: { },
      success: evaluate => {
        this.setState({ evaluate });

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  questionnaire_form_list = () => {

    request(urls.questionnaire_form_list, {
      body: { },
      success: questionnaire => {
        this.setState({ questionnaire });

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  openSwitch = (checked,key) =>{
    const {detail} = this.state;
    const d = dataHandler.deepClone(detail);
    d[key] = checked?1:0;
    this.setState({detail:d});
  };

  addList = () =>{
    const {detail={},evaluate=[]} = this.state;
    const d = dataHandler.deepClone(detail);
    let hospital_evaluate_form_ids = d.hospital_evaluate_form_ids;
    const evaluateIds = evaluate.map(v=>v.id);
    hospital_evaluate_form_ids.push(lodash.difference(evaluateIds,hospital_evaluate_form_ids)[0]);
    this.setState({detail:d});
  };
  delList = (index) =>{
    const {detail={},evaluate=[]} = this.state;
    const d = dataHandler.deepClone(detail);
    let hospital_evaluate_form_ids = d.hospital_evaluate_form_ids;
    hospital_evaluate_form_ids.splice(index,1);
    this.setState({detail:d});
  };


  admin_test_flow_template_save = ()=>{
    const {dispatch} = this.props;
    const {code,name,price,detail} = this.state;
    const {is_statement_step_open,is_device_step_open,is_questionnaire_step_open,questionnaire_id,is_evaluate_step_open} = detail;
    const {device_categories,hospital_evaluate_form_ids} = detail;
    request(urls.admin_test_flow_template_save, {
      body: {code,name,price,is_statement_step_open,is_device_step_open,is_questionnaire_step_open,is_evaluate_step_open,questionnaire_id,
      device_categories:JSON.stringify(device_categories),hospital_evaluate_form_ids:JSON.stringify(hospital_evaluate_form_ids),
      },
      success: data => {
        message.success('保存成功');
        router.jump({
          dispatch,
          pathname:'/parameter/flow-list',
        })
      },
      fail: errmsg => {
        message.error(errmsg || '保存失败');
      },
      complete: () => {
      },
    });
  }

  onChangeOfName = (e) => {
    const value = e.target.value;
    this.setState({name:value})
  };

  onChangeOfCode = (e) => {
    const value = e.target.value;
    this.setState({code:value})
  };

  onChangeOfPrice = (value) => {
    this.setState({price:value})
  };

  renderSimpleInput = () => {
    const {name,code,price} = this.state;
    return (
      <div className={styles.inputWrap}>
        <div className={styles.item}>
          <span className={styles.name}>流程名称:</span>
          <Input value={name} onChange={(e)=>this.onChangeOfName(e)} className={styles.input} placeholder="请输入" />
        </div>

        <div className={styles.item}>
          <span className={styles.name}>流程编码:</span>
          <Input value={code} onChange={(e)=>this.onChangeOfCode(e)} className={styles.input} placeholder="请输入" />
        </div>

        <div className={styles.item}>
          <span className={styles.name}>绑定金额:</span>
          <InputNumber value={price} onChange={(value)=>this.onChangeOfPrice(value)} min={1} className={styles.input} placeholder="请输入" />
        </div>

      </div>
    );
  };

  onChangeOfDevice = (e,id)=>{
    const {detail={}} = this.state;
    const d = dataHandler.deepClone(detail);
    const checked = e.target.checked;
    if(checked){
      d.device_categories.push(id);
    }else{
      const index = d.device_categories.findIndex(v=>v-0===id-0);
      d.device_categories.splice(index,1);
    }
    this.setState({detail:d});
  };

  onChangeOfQuestionnaire = (value)=>{
    const {detail={}} = this.state;
    const d = dataHandler.deepClone(detail);
    d.questionnaire_id = value;
    this.setState({detail:d});
  };

  onChangeOfEvaluate = (value,index)=>{
    const {detail={}} = this.state;
    const d = dataHandler.deepClone(detail);
    if(d.hospital_evaluate_form_ids.indexOf(value)!==-1){
      message.error('请勿重复选择');
    }else{
      d.hospital_evaluate_form_ids[index] = value;
      this.setState({detail:d});
    }

  };

  render() {


    const {detail={},devices=[],evaluate=[],questionnaire=[]} = this.state;

    const {is_statement_step_open,is_device_step_open,is_questionnaire_step_open,is_evaluate_step_open} = detail||{};

    let {device_categories,questionnaire_id,hospital_evaluate_form_ids} = detail;


    return (
      <PageHeaderLayout>
        {this.renderSimpleInput()}
        <Card>
          <Row gutter={8}>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>主诉</label>
                  <Switch checked={is_statement_step_open-0===1} onChange={(checked)=>this.openSwitch(checked,'is_statement_step_open')} />
                </div>
                {is_statement_step_open-0===1 ? <div /> : ''}
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>仪器检测</label>
                  <Switch checked={is_device_step_open-0===1} onChange={(checked)=>this.openSwitch(checked,'is_device_step_open')} />
                </div>
                {
                  is_device_step_open-0===1 ?
                  (
                    <div>
                      {
                        devices.map((value,i)=>{
                          return (
                            <div key={value.id} className={styles.checkStyel}>
                              <Checkbox checked={device_categories.indexOf(value.id)!==-1} onChange={(e)=>this.onChangeOfDevice(e,value.id)}>{value.name}</Checkbox>
                            </div>
                          )
                        })
                      }
                    </div>
                  ) : null
                }
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>首访</label>
                  <Switch checked={is_questionnaire_step_open-0===1} onChange={(checked)=>this.openSwitch(checked,'is_questionnaire_step_open')} />
                </div>
                {
                  is_questionnaire_step_open-0===1 ?
                    (
                      <div>
                        <div className={styles.selectStyle1}>
                          <Select onChange={(value)=>this.onChangeOfQuestionnaire(value)} value={questionnaire_id||(questionnaire&&questionnaire[0]&&questionnaire[0].id)}>
                            {
                              questionnaire&&Object.keys(questionnaire).map((value,i)=>{
                                return (
                                  <Option key={questionnaire[value].id} value={questionnaire[value].id}>{questionnaire[value].name}</Option>
                                )
                              })
                            }
                          </Select>
                        </div>
                      </div>
                    ) : ''
                }
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>量表检测</label>
                  <Switch checked={is_evaluate_step_open-0===1} onChange={(checked)=>this.openSwitch(checked,'is_evaluate_step_open')} />
                </div>
                {
                  is_evaluate_step_open-0===1 ?
                  (
                    <div>
                      {
                        hospital_evaluate_form_ids&&hospital_evaluate_form_ids.map((item,index) =>(
                          <Row gutter={4} className={styles.selectStyle} key={`hospital_evaluate_form_ids${item}`}>
                            <Col span={22}>
                              <Select value={item} onChange={(value)=>this.onChangeOfEvaluate(value,index)}>
                                {
                                  evaluate&&evaluate.map((value,j)=>{
                                    return (
                                      <Option key={`evaluate${index}${j}`} value={value.id}>{value.name}</Option>
                                    )
                                  })
                                }
                              </Select>
                            </Col>
                            <Col span={2} onClick={() => this.delList(index)}>
                              <Icon type="minus-circle-o" className={styles.icons} />
                            </Col>
                          </Row>
                        ))
                      }
                      {
                        evaluate.length>hospital_evaluate_form_ids.length?(
                          <div className={styles.addList} onClick={this.addList}>
                            <Icon type="plus-circle" />
                            <span>添加量表模版</span>
                          </div>
                        ):null
                      }
                    </div>
                  ) : null
                }
              </div>
            </Col>
          </Row>
          <div className={styles.buttomButton}>
            <Button type="primary" onClick={this.admin_test_flow_template_save}>保存</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
