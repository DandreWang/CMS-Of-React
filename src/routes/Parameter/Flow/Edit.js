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
let id, evaluateAll = [], devicesAll = [];
@connect(({}) => ({}))
export default class MsgRecordManage extends Component {
  state = {
    name: '',
    code: '',
    price: '',

    detail: {},

    questionnaire: [], // 首访
  };

  componentDidMount() {
    const { params = {} } = this.props.match;
    id = params.id;

    this.evaluate_subject_list();

    this.admin_device_category_listAll();
    this.questionnaire_form_list();
  }

  admin_test_flow_template_get = () => {

    request(urls.admin_test_flow_template_get, {
      body: { id },
      success: detail => {

        let { device_categories, subject_ids, name, price, code } = detail;

        try {
          device_categories = JSON.parse(device_categories);
        } catch (e) {
          device_categories = [];
        }

        try {
          const evaluate_ids = (evaluateAll || []).map(v => v.id);

          const form_ids = typeof subject_ids === 'string' ? JSON.parse(subject_ids) : subject_ids;

          subject_ids = lodash.intersection(form_ids || [], evaluate_ids) || [];

        } catch (e) {
          subject_ids = [];
        }

        const d = Object.assign({}, detail, { device_categories, subject_ids });

        this.setState({ detail: d, name, price, code });

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
      body: {},
      success: data => {
        devicesAll = data;

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  evaluate_subject_list = (detail) => {

    request(urls.evaluate_subject_list, {
      body: {},
      success: evaluate => {

        const evaluateSorted = lodash.sortBy(evaluate, ['name']);

        evaluateAll = evaluateSorted;

        this.admin_test_flow_template_get();


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
      body: {},
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

  openSwitch = (checked, key) => {
    const { detail, questionnaire } = this.state;
    const d = dataHandler.deepClone(detail);
    d[key] = checked ? 1 : 0;
    d.questionnaire_id = d.questionnaire_id || (questionnaire && questionnaire[0] && questionnaire[0].id);
    this.setState({ detail: d });
  };

  addList = () => {
    const { detail = {} } = this.state;
    const d = dataHandler.deepClone(detail);
    let subject_ids = d.subject_ids;
    const evaluateIds = evaluateAll.map(v => v.id);
    subject_ids.push(lodash.difference(evaluateIds, subject_ids)[0]);
    this.setState({ detail: d });
  };
  delList = (index) => {
    const { detail = {} } = this.state;
    const d = dataHandler.deepClone(detail);
    let subject_ids = d.subject_ids;
    subject_ids.splice(index, 1);
    this.setState({ detail: d });
  };


  admin_test_flow_template_save = () => {

    // is_device_step_open  仪器
    // is_evaluate_step_open 量表

    const { dispatch } = this.props;
    const { code, name, detail } = this.state;
    const { is_statement_step_open, is_device_step_open, is_questionnaire_step_open, questionnaire_id, is_evaluate_step_open } = detail;
    const { device_categories, subject_ids } = detail;

    if(!name){
      return message.error('请输入流程名称');
    }
    if(!code){
      return message.error('请输入流程编码');
    }
    if(is_statement_step_open-0===0&&
      is_device_step_open-0===0&&
    is_questionnaire_step_open-0===0 &&
    is_evaluate_step_open-0===0){
      return message.error('请至少开启一个流程项目');
    }
    if(is_device_step_open-0===1){
      if(!device_categories||!device_categories.length){
        return message.error('请至少选择一个仪器项目');
      }
    }
    if(is_evaluate_step_open-0===1){
      if(!subject_ids||!subject_ids.length){
        return message.error('请至少选择一个量表项目');
      }
    }

    request(urls.admin_test_flow_template_save, {
      body: {
        id,
        code,
        name,
        is_statement_step_open,
        is_device_step_open,
        is_questionnaire_step_open,
        is_evaluate_step_open,
        questionnaire_id,
        device_categories: JSON.stringify(device_categories),
        subject_ids: JSON.stringify(subject_ids),
      },
      success: data => {
        message.success('保存成功');
        router.jump({
          dispatch,
          pathname: '/parameter/flow-list',
        });
      },
      fail: errmsg => {
        message.error(errmsg || '保存失败');
      },
      complete: () => {
      },
    });

  };

  onChangeOfName = (e) => {
    const value = e.target.value;
    this.setState({ name: value });
  };

  onChangeOfCode = (e) => {
    const value = e.target.value;
    this.setState({ code: value });
  };

  renderSimpleInput = () => {

    const { name, code, detail = {} } = this.state;
    let price = 0;
    try {
      const { is_device_step_open, is_evaluate_step_open, device_categories, subject_ids } = detail || {};

      if (is_device_step_open - 0 === 1) {

        const device_categories_arr = typeof device_categories === 'string' ? JSON.parse(device_categories) : device_categories;
        if (device_categories_arr && device_categories_arr.length) {
          device_categories_arr.forEach(v => {
            price += devicesAll.find(ele => ele.id - 0 === v - 0).price;
          });
        }

      }
      if (is_evaluate_step_open - 0 === 1) {

        const subject_ids_arr = typeof subject_ids === 'string' ? JSON.parse(subject_ids) : subject_ids;
        if (subject_ids_arr && subject_ids_arr.length) {
          subject_ids_arr.forEach(v => {
            price += evaluateAll.find(ele => ele.id - 0 === v - 0).price;
          });
        }


      }
    } catch (e) {
      price = 0;
    }

    return (
      <div className={styles.inputWrap}>
        <div className={styles.item}>
          <span className={styles.name}>流程名称:</span>
          <Input value={name} onChange={(e) => this.onChangeOfName(e)} className={styles.input} placeholder="请输入"/>
        </div>

        <div className={styles.item}>
          <span className={styles.name}>流程编码:</span>
          <Input value={code} onChange={(e) => this.onChangeOfCode(e)} className={styles.input} placeholder="请输入"/>
        </div>

        <div className={styles.item}>
          <span className={styles.name}>绑定金额:</span>
          <span className={styles.input}>{price}</span>
        </div>

      </div>
    );
  };

  onChangeOfDevice = (e, id) => {
    const { detail = {} } = this.state;
    const d = dataHandler.deepClone(detail);
    const checked = e.target.checked;
    if (checked) {
      d.device_categories.push(id);
    } else {
      const index = d.device_categories.findIndex(v => v - 0 === id - 0);
      d.device_categories.splice(index, 1);
    }
    this.setState({ detail: d });
  };

  onChangeOfQuestionnaire = (value) => {
    const { detail = {} } = this.state;
    const d = dataHandler.deepClone(detail);
    d.questionnaire_id = value;
    this.setState({ detail: d });
  };

  onChangeOfEvaluate = (value, index) => {
    const { detail = {} } = this.state;
    const d = dataHandler.deepClone(detail);
    if (d.subject_ids.indexOf(value) !== -1) {
      message.error('请勿重复选择');
    } else {
      d.subject_ids[index] = value;
      this.setState({ detail: d });
    }

  };

  render() {


    const { detail = {}, questionnaire = [] } = this.state;

    const { is_statement_step_open, is_device_step_open, is_questionnaire_step_open, is_evaluate_step_open } = detail || {};

    let { device_categories, questionnaire_id, subject_ids = [] } = detail;

    const evaluate_ids = (evaluateAll || []).map(v => v.id);

    // const form_ids = lodash.intersection(subject_ids||[],evaluate_ids);
    const form_ids = subject_ids || [];

    const canAddList = (evaluate_ids || []).length > (form_ids || []).length;


    return (
      <PageHeaderLayout>
        {this.renderSimpleInput()}
        <Card>
          <Row gutter={8}>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>主诉</label>
                  <Switch checked={is_statement_step_open - 0 === 1}
                          onChange={(checked) => this.openSwitch(checked, 'is_statement_step_open')}/>
                </div>
                {is_statement_step_open - 0 === 1 ? <div/> : ''}
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>仪器检测</label>
                  <Switch checked={is_device_step_open - 0 === 1}
                          onChange={(checked) => this.openSwitch(checked, 'is_device_step_open')}/>
                </div>
                {
                  is_device_step_open - 0 === 1 ?
                    (
                      <div>
                        {
                          devicesAll && devicesAll.length ? (devicesAll.map((value, i) => {
                              return (
                                <div key={value.id} className={styles.checkStyel}>
                                  <Checkbox checked={device_categories.indexOf(value.id) !== -1}
                                            onChange={(e) => this.onChangeOfDevice(e, value.id)}>{value.name}</Checkbox>
                                </div>
                              );
                            })
                          ) : null
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
                  <Switch checked={is_questionnaire_step_open - 0 === 1}
                          onChange={(checked) => this.openSwitch(checked, 'is_questionnaire_step_open')}/>
                </div>
                {
                  is_questionnaire_step_open - 0 === 1 ?
                    (
                      <div>
                        <div className={styles.selectStyle1}>
                          <Select onChange={(value) => this.onChangeOfQuestionnaire(value)}
                                  value={questionnaire_id || (questionnaire && questionnaire[0] && questionnaire[0].id)}>
                            {
                              questionnaire && Object.keys(questionnaire).map((value, i) => {
                                return (
                                  <Option key={questionnaire[value].id}
                                          value={questionnaire[value].id}>{questionnaire[value].name}</Option>
                                );
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
                  <Switch checked={is_evaluate_step_open - 0 === 1}
                          onChange={(checked) => this.openSwitch(checked, 'is_evaluate_step_open')}/>
                </div>
                {
                  is_evaluate_step_open - 0 === 1 ?
                    (
                      <div>
                        {
                          form_ids && form_ids.map((item, index) => (

                            <Row gutter={4} className={styles.selectStyle} key={`subject_ids${item}`}>
                              <Col span={22}>
                                <Select value={item} onChange={(value) => this.onChangeOfEvaluate(value, index)}>
                                  {
                                    evaluateAll && evaluateAll.length ? (
                                      evaluateAll.map((value, j) => {
                                        return (
                                          <Option key={`evaluate-${value.id}-${j}`}
                                                  value={value.id}>{value.name}</Option>
                                        );
                                      })
                                    ) : null
                                  }
                                </Select>
                              </Col>
                              <Col span={2} onClick={() => this.delList(index)}>
                                <Icon type="minus-circle-o" className={styles.icons}/>
                              </Col>
                            </Row>

                          ))
                        }
                        {
                          canAddList ? (
                            <div className={styles.addList} onClick={this.addList}>
                              <Icon type="plus-circle"/>
                              <span>添加量表模版</span>
                            </div>
                          ) : null
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
