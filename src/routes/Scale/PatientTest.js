import React, { PureComponent, Fragment, Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Select,
  Button,
  Input,
  Collapse,
  DatePicker,
  Icon,
  Row,
  Col,
  Steps,
  message,
  Modal,
  Divider, AutoComplete,
  Affix,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import FooterToolbar from 'components/FooterToolbar';
import Result from 'components/Result';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { images } from '../../utils/images';
import styles from './PatientTest.less';
import { router } from '../../utils/router';
import { dataHandler } from '../../utils/dataHandler';
import lodash from 'lodash';
import request from '../../utils/request';
import ModalDiy from 'components/ModalDiy';
import { urls } from '../../utils/urls';

const { Description } = DescriptionList;
const { TextArea } = Input;

const Step = Steps.Step;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

const { Option } = Select;

let evaluate_options_stabel = [];

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};
const formItemLayout2 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 13,
  },
};
const formTextArea = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 21,
  },
};


class Extra extends Component {
  render() {
    const { data } = this.props;
    const {
      disease_name,
      chief,
      simple_chief_report,
      simple_device_report,
      simple_evaluate_report,
      device_name_list,
      subject_name_list,
      evaluateResults,
    } = data || {};

    return (


      <div className={styles.listContent}>
        <h3>检测结果</h3>
        <ul>
          {
            disease_name ? (
              <li className='dotOrange'>测评疾病: {disease_name}</li>
            ) : null
          }
          {
            chief ? (
              <li className='dotOrange'>病历主诉: {chief}</li>
            ) : null
          }

          {
            device_name_list && device_name_list.length ? (
              <li className='dotGreen'>仪器检测: {device_name_list.join('、')}</li>
            ) : null

          }
          {
            subject_name_list && subject_name_list.length ? (
              <li className='dotPurple'>量表检测: {subject_name_list.join('、')}</li>
            ) : null

          }

          {
            !(disease_name||chief||(device_name_list&&device_name_list.length)||(subject_name_list&&subject_name_list.length))?(
              <li className='dotPurple'>请点击"查看报告"获取检测结果</li>
            ):null
          }

        </ul>
      </div>


    );
  }
}

class Action extends Component {
  render() {
    return (
      <Fragment>
        <Button
          type="primary"
          onClick={() => {
            const { dispatch } = this.props;
            router.jump({
              dispatch,
              pathname: '/workbench/staff',
            });
          }}
        >
          返回首页
        </Button>
        <Button onClick={() => {
          const { dispatch } = this.props;
          router.jump({
            dispatch,
            pathname: `/patient/synthesis/${case_id}`,
            newTab: true,
          });
        }}
        >
          查看报告
        </Button>
      </Fragment>
    );
  }
}

class NumList extends Component {

  handleClick(num) {
    const { i, j, k, onChange } = this.props;
    onChange(i, j, k, num);
  }

  render() {
    const { data: { score_range = [], score }, i, j, k } = this.props;

    const arr = lodash.range(score_range[0], score_range[1] + 1);

    return (
      <ul>
        {
          arr.map((num, i) =>
            (
              <li
                key={num}
                onClick={() => {
                  this.handleClick(num);
                }}
              >
                <div className={score === num ? styles.active : ''}>{num}</div>
              </li>
            ),
          )
        }
      </ul>
    );
  }
}

class NumListWithoutSecondLevel extends Component {

  handleClick(num) {
    const { i, j, onChange } = this.props;
    onChange(i, j, num);
  }

  render() {
    const { data: { score_range = [], score } } = this.props;

    const arr = lodash.range(score_range[0], score_range[1] + 1);

    return (
      <ul>
        {
          arr.map((num, i) =>
            (
              <li
                key={num}
                onClick={() => {
                  this.handleClick(num);
                }}
              >
                <div className={score === num ? styles.active : ''}>{num}</div>
              </li>
            ),
          )
        }
      </ul>
    );
  }
}

let case_id, evaluate_forms;

@connect(({ patientTest }) => ({
  patientTest,
}))
@Form.create()
export default class patientTest extends PureComponent {

  state = {
    patient_case_basic_info: {},

    patient_case_test_flow: [],
    patient_case_test_flow_loading: true,
    current_step: 0,

    visits: [], //首访

    evaluates: [
      // {
      // subject_id:1,
      // subject_name: "90项症状清单量表",
      // evaluate_test_record_id: 91,
      // evaluate_test_status: 0
      // }
    ], // 已添加的 量表检测

    patient_case_simple_test_report: {}, //完成

    evaluate_options: [], // 尚未添加的 量表检测
    evaluateSelectVisible: false,
    evaluateSelectValue: '',
  };

  componentDidMount() {


    case_id = this.props.match.params.case_id;

    this.get_patient_case_basic_info();

    this.get_available_evaluate_subjects();

    this.get_patient_case_simple_info();


  }



  onSelectOfScaleSelect = (value) => {
    this.setState({ evaluateSelectValue: value });
  };

  onSearchOfScaleSelect = (value) => {
    this.onSelectOfScaleSelect(value);
  };

  onChangeOfScaleSelect = (value) => {
    this.onSelectOfScaleSelect(value);
  };

  get_patient_case_basic_info = () => {
    this.props.dispatch({
      type: 'patientTest/get_patient_case_basic_info',
      payload: { case_id },
      success: patient_case_basic_info => {
        this.setState({ patient_case_basic_info });
      },
      fail: errmsg => {
        message.error(errmsg || '获取病例信息失败');
      },
    });
  };

  get_patient_case_simple_info = () => {
    request(urls.get_patient_case_simple_info, {
      body: { case_id },
      success: patient_case_simple_test_report => {
        this.setState({ patient_case_simple_test_report });
      },
      fail: errmsg => {
        //message.error(errmsg||'获取病例测评简略报告失败');
      },
      complete: () => {
        //this.get_patient_case_test_flow();
      },
    });
  };

  get_available_evaluate_subjects = () => {

    request(urls.get_available_evaluate_subjects, {
      body: {},
      success: evaluate_options => {
        if (evaluate_options && evaluate_options.length) {
          evaluate_options_stabel = evaluate_options;
          this.setState({ evaluate_options, evaluateSelectValue: '' });
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取可用的量表失败');
      },
      complete: () => {
        this.get_patient_case_test_flow();
      },
    });
  };

  get_patient_case_test_flow = () => {
    this.props.dispatch({
      type: 'patientTest/get_patient_case_test_flow',
      payload: { case_id },
      success: patient_case_test_flow => {
        const { current_step } = this.stepsGenerator(patient_case_test_flow);
        /*
        https://ant.design/components/form-cn/你不应该用 setState，可以使用 this.props.form.setFieldsValue 来动态改变表单值。
        不可将steps中的content放入setState中，否则会导致输入框中无法输入内容
        */
        const flow_type_4 = patient_case_test_flow.find(v => v.flow_type - 0 === 4);
        const evaluates = flow_type_4 ? flow_type_4.evaluateResultList : [];
        const flow_type_3 = patient_case_test_flow.find(v => v.flow_type - 0 === 3);
        const visits = flow_type_3 ? flow_type_3.questionnaireGroupResultList : [];
        this.setState({ patient_case_test_flow, current_step, evaluates, visits });
      },
      fail: errmsg => {
        message.error(errmsg || '获取该病历的测评流程列表失败');
      },
      complete: () => {
        this.setState({ patient_case_test_flow_loading: false });
      },
    });
  };

  prev() {
    const current_step = this.state.current_step - 1;
    this.setState({ current_step });
  }

  handleSubmit = (event, data) => {
    event && event.preventDefault();
    const { form, dispatch } = this.props;
    const { flow_type, flow_status, flow_id } = data;
    // 1：主诉，2：仪器检测，3：首访，4：量表检测
    if (flow_type - 0 === 1) {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {first_occur_date='',last_occur_date=''} = values||{};
          try{
            if(moment.isMoment(first_occur_date) && moment.isMoment(last_occur_date)){
              if(first_occur_date.isAfter(last_occur_date)){
                return message.error('首次发作时间不能晚于末次发作时间');
              }
            }else{
              return message.error('时间格式错误');
            }
          }catch (e) {
            return message.error('时间解析错误');
          }
          const payload = { ...values,
            first_occur_date: first_occur_date.format('YYYY-MM-DD'),
            last_occur_date: last_occur_date.format('YYYY-MM-DD'),
            flow_id,
          };
          dispatch({
            type: 'patientTest/save_chielf_test_flow',
            payload,
            success: data => {
              // const { case_id=0, is_test_finished=0 } = data;
              this.get_patient_case_test_flow();
            },
            fail: errmsg => {
              message.error(errmsg || '提交失败');
            },
          });
        }
      });
    } else if (flow_type - 0 === 2) {
      //第一次提交时，必须调接口。后台才知道该流程已结束。
      dispatch({
        type: 'patientTest/save_device_test_flow',
        payload: { flow_id },
        success: data => {
          // const { case_id=0, is_test_finished=0 } = data;
          this.get_patient_case_test_flow();
        },
        fail: errmsg => {
          message.error(errmsg || '提交失败');
        },
      });
    } else if (flow_type - 0 === 3) {


      const { visits } = this.state;

      let hasSecondLevel = false;
      try{
        hasSecondLevel = visits[0].level2_group_list.length > 0;
      }catch (e) {
        hasSecondLevel = false;
      }

      let answers = [];

      if(hasSecondLevel){
        try {
          let seq = 0;
          for (let i = 0; i < visits.length; i++) {
            const value = visits[i].level2_group_list;
            for (let j = 0; j < value.length; j++) {
              const ele = value[j].question_list;
              for (let k = 0; k < ele.length; k++) {
                if (ele[k].score - 0 === -99) {
                  document.querySelector(`#visitItem${seq}`).scrollIntoView();
                  return message.error('请选择');
                }
                ++seq;
              }
            }
          }
        } catch (e) {
          return message.error('操作失败');
        }


        visits.forEach(value => {
          value.level2_group_list.forEach(item => {
            item.question_list.forEach(subItem => {
              subItem.sex_type = 0;
              answers.push(subItem);
            });
          });
        });
      }else{
        try {
          let seq = 0;
          for (let i = 0; i < visits.length; i++) {
            const value = visits[i].question_list;
            for (let j = 0; j < value.length; j++) {
              const ele = value[j];
              if (ele.score - 0 === -99) {
                document.querySelector(`#visitItem${seq}`).scrollIntoView();
                return message.error('请选择');
              }
              ++seq;
            }
          }
        } catch (e) {
          return message.error('操作失败');
        }


        visits.forEach(value => {
          value.question_list.forEach(subItem => {
            subItem.sex_type = 0;
            answers.push(subItem);
          });
        });
      }


      answers = answers.map(v=>{
        const {question_sn,score} = v||{};
        return {
          question_sn,
          score,
        }
      });

      request(urls.save_questionnaire_test_flow, {
        body: { flow_id, answers: JSON.stringify(answers) },
        success: data => {
          // this.get_patient_case_test_flow();
          router.jump({
            dispatch,
            pathname: `/patient/visit-results/${case_id}/${flow_id}`,
          });
        },
        fail: errmsg => {
          message.error(errmsg || '提交失败');
        },
      });
    } else if (flow_type - 0 === 4) {
      request(urls.save_evaluate_test_flow, {
        body: { flow_id },
        success: data => {
          this.get_patient_case_test_flow();
          this.get_patient_case_simple_info();
        },
        fail: errmsg => {
          message.error(errmsg || '提交失败');
        },
      });
    }
  };

  addEvaluate = () => {
    try {
      const { evaluates = [] } = this.state;

      const evaluate_options = evaluate_options_stabel.filter(v => !(evaluates.find(ele => ele.subject_name === v.subject_name)));

      this.setState({ evaluateSelectVisible: true, evaluateSelectValue: '', evaluate_options });
    } catch (e) {
      message.error('操作失败');
    }

  };

  handleOkOfEvaluate = (flow_id) => {
    try {
      const { evaluates = [], evaluateSelectValue } = this.state;
      const target = (evaluates || []).find(v => v.subject_name === evaluateSelectValue);
      if (target) {
        message.error('项目重复，无法添加');
      } else {
        const { subject_id } = evaluate_options_stabel.find(v => v.subject_name === evaluateSelectValue);
        if (subject_id) {
          request(urls.add_subject_to_evaluate_flow, {
            body: { flow_id, subject_id },
            success: () => {
              this.get_patient_case_test_flow();
            },
            fail: errmsg => {
              message.error(errmsg || '操作失败');
            },
            complete: () => {
              this.setState({ evaluateSelectVisible: false });
            },
          });
        } else {
          message.error('量表不存在');
        }

      }
    } catch (e) {
      message.error('操作失败');
    }

  };

  handleCancelOfEvaluate = () => {
    this.setState({ evaluateSelectVisible: false });
  };


  delList = (flow_id, evaluate_test_record_id) => {

    Modal.confirm({
      title: '确认框',
      content: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        request(urls.delete_evaluate_form_record, {
          body: { flow_id, evaluate_test_record_id },
          success: () => {
            this.get_patient_case_test_flow();
          },
          fail: errmsg => {
            message.error(errmsg || '操作失败');
          },
        });
      },
    });


  };

  detect3TypeChange = () => {


  };

  numListChange = (i, j, k, num) => {
    const { visits } = this.state;
    const visitsCopy = dataHandler.deepClone(visits);
    visitsCopy[i].level2_group_list[j].question_list[k].score = num;
    this.setState({ visits: visitsCopy });
  };

  numListChangeWithoutSecondLevel = (i, j, num) => {
    const { visits } = this.state;
    const visitsCopy = dataHandler.deepClone(visits);
    visitsCopy[i].question_list[j].score = num;
    this.setState({ visits: visitsCopy });
  };


  startDeviceDetect = (item) => {
    const { dispatch } = this.props;
    const type = item.device_category_id + '';
    const paths = {
      '1': `/patient/ecg-detection/${item.device_test_record_id}/${case_id}`,
      '2': `/patient/eeg-detection/${item.device_test_record_id}/${case_id}`,
    };
    if (['1', '2'].indexOf(type) !== -1) {
      router.jump({
        dispatch,
        pathname: paths[item.device_category_id + ''],
      });
    } else {
      message.error('仪器类型不匹配');
    }
  };

  scanDeviceResult = (item) => {
    const { dispatch } = this.props;
    const type = item.device_category_id + '';
    const paths = {
      '1': `/patient/ecg-detection-result/${item.device_test_record_id}/${case_id}`,
      '2': `/patient/eeg-detection-result/${item.device_test_record_id}/${case_id}`,
    };
    if (['1', '2'].indexOf(type) !== -1) {
      router.jump({
        dispatch,
        pathname: paths[item.device_category_id + ''],
      });
    } else {
      message.error('仪器类型不匹配');
    }
  };

  startScaleDetect = (item, flow_id) => {
    const { evaluate_test_record_id } = item;
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/answer/${case_id}/${flow_id}/${evaluate_test_record_id}`,
    });
  };

  scanScaleResult = (flow_id, evaluate_test_record_id) => {
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/scale-results/${case_id}/${flow_id}/${evaluate_test_record_id}`,
    });
  };

  disabledDateOfOccurDate = (current)=>{
    return current > moment().endOf('day');
  };

  chiefStep(data = {}) {
    const {
      form: {
        getFieldDecorator,
      },
    } = this.props;

    const { chiefResult: { chief_desc = '', reason = '', level = 1, first_occur_date='',last_occur_date='', rate = '' } = {} } = data;

    return (
      <Row gutter={8} className={styles.mainForm}>
        <Col span={24}>
          <FormItem {...formTextArea} label="症状描述">
            {getFieldDecorator('chief_desc', {
              initialValue: chief_desc,
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(<TextArea autosize={{ minRows: 4, maxRows: 12 }} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formTextArea} label="应激因素">
            {getFieldDecorator('reason', {
              initialValue: reason,
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(<TextArea autosize={{ minRows: 4, maxRows: 12 }} placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="发作频次">
            {getFieldDecorator('rate', {
              initialValue: rate,
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(<Input placeholder="请输入"/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout2} label="首次发作时间">
            {getFieldDecorator('first_occur_date', {
              initialValue: typeof(first_occur_date) === 'object' ? first_occur_date : moment(first_occur_date),
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(<DatePicker disabledDate={this.disabledDateOfOccurDate} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout2} label="末次发作时间">
            {getFieldDecorator('last_occur_date', {
              initialValue: typeof(last_occur_date) === 'object' ? last_occur_date : moment(last_occur_date),
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(<DatePicker disabledDate={this.disabledDateOfOccurDate} />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="严重程度">
            {getFieldDecorator('level', {
              initialValue: level,
              rules: [{
                required: true,
                message: '请输入',
              }],
            })(
              <Select placeholder="请选择">
                <Option value="轻">轻</Option>
                <Option value="中等">中</Option>
                <Option value="重">重</Option>
                <Option value="极重">极重</Option>
              </Select>,
            )}
          </FormItem>
        </Col>
      </Row>
    );
  }

  deviceStep(data = {}) {
    const { deviceResultList = [] } = data;
    if (deviceResultList && Array.isArray(deviceResultList) && deviceResultList.length) {
      return (
        <div className={styles.sencondMainForm}>
          <h4>仪器检测</h4>
          {
            deviceResultList.map((item) => {
              const isComplete = item.device_test_status - 0 === 1;
              const iconType = item.device_category_id - 0 === 2 ? 'customer-service' : 'heart-o';
              return (
                <div key={item.device_test_record_id} className={styles.itemWrap}>
                  <span className={styles.itemTest}>
                    <Icon type={iconType}/>{item.device_category_name}
                  </span>
                  {
                    isComplete ? (
                      <Fragment>
                        <Button
                          type='primary'
                          onClick={() => this.scanDeviceResult(item)}
                        >
                          {'查看结果'}
                        </Button>
                        <Button
                          type='primary'
                          style={{ marginLeft: 10 }}
                          onClick={() => this.startDeviceDetect(item)}
                        >
                          {'重新检测'}
                        </Button>
                      </Fragment>
                    ) : (
                      <Button
                        type='primary'
                        onClick={() => this.startDeviceDetect(item)}
                      >
                        {'开始检测'}
                      </Button>
                    )
                  }

                </div>
              );
            })
          }
        </div>
      );
    } else {
      return null;
    }
  };

  visitParse() {
    const { visits } = this.state;
    let total = 0, answered = 0;
    visits.forEach(value => {
      value.level2_group_list.forEach(item => {
        item.question_list.forEach(ele => {
          ++total;
          if (ele.score - 0 !== -99) {
            ++answered;
          }
        });
      });
    });
    return { answered, total };

  }

  visitParseWithoutSecondLevel() {
    const { visits } = this.state;
    let total = 0, answered = 0;
    visits.forEach(value => {
      value.question_list.forEach(ele => {
        ++total;
        if (ele.score - 0 !== -99) {
          ++answered;
        }
      });
    });
    return { answered, total };

  }

  visitStep() {

    const { visits = [] } = this.state;
    if (visits && Array.isArray(visits) && visits.length) {
      let hasSecondeLevel = false;
      try{
        hasSecondeLevel = visits[0].level2_group_list.length > 0;
      }catch (e) {
        hasSecondeLevel = false;
      }
      if(hasSecondeLevel){
        let visitItemSeq = 0;
        const visitCalc = this.visitParse();
        return (
          <Fragment>
            <div className={styles.affixWrap}>
              <Affix offsetTop={30}>
                <div className={styles.answerSta}>{`已答题数${visitCalc.answered}/总题数${visitCalc.total}`}</div>
              </Affix>
            </div>
            <div className={styles.thirdMainForm}>
              {
                visits.map((value, i) => {
                  const key1 = 'value' + i;
                  return (
                    <div className={styles.cardWrap} key={key1}>
                      <Card
                        // header={value.group_name}
                        // forceRender
                        title={value.group_name}
                      >
                        {
                          value.level2_group_list.map((item, j) => {
                            const key2 = 'item' + j;
                            return (
                              <div className={styles.thirdMainContent} key={key2}>
                                <h3>{j + 1}.{item.group_name}</h3>
                                {
                                  item.question_list.map((question, k) => {
                                    const key3 = 'question' + k;
                                    return (
                                      <div id={`visitItem${visitItemSeq++}`} className={styles.qualityTest} key={key3}>
                                        <div className={styles.title}>
                                          <label className={styles.titLabel}>({k + 1}) {question.question_name}</label>
                                          <span
                                            className={styles.titTxt}>（{question.score_desc[0]}&nbsp;&gt;&nbsp;{question.score_desc[1]}）</span>
                                        </div>
                                        <div className={styles.listNumber}>
                                          <NumList i={i} j={j} k={k} data={question}
                                                   onChange={this.numListChange.bind(this)}/>
                                        </div>
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            );
                          })
                        }
                      </Card>
                    </div>

                  );
                })
              }
            </div>
          </Fragment>
        );
      }else{
        return this.visitStepWithoutSecondLevel();
      }
    } else {
      return null;
    }
  }

  visitStepWithoutSecondLevel() {

    const { visits = [] } = this.state;
    if (visits && Array.isArray(visits) && visits.length) {
      let visitItemSeq = 0;
      // debugger;
      const visitCalc = this.visitParseWithoutSecondLevel();
      return (
        <Fragment>
          <div className={styles.affixWrap}>
            <Affix offsetTop={30}>
              <div className={styles.answerSta}>{`已答题数${visitCalc.answered}/总题数${visitCalc.total}`}</div>
            </Affix>
          </div>
          <div className={styles.thirdMainForm}>
            {
              visits.map((value, i) => {
                const key1 = 'value' + i;
                const key2 = 'value' + i +'key2';
                return (
                  <div className={styles.cardWrap} key={key1}>
                    <Card
                      title={value.group_name}
                    >
                      <div className={styles.thirdMainContent} key={key2}>
                      {
                        value.question_list.map((question, j) => {
                          const key3 = 'question' + j;
                          return (
                            <div id={`visitItem${visitItemSeq++}`} className={styles.qualityTest} key={key3}>
                              <div className={styles.title}>
                                <label className={styles.titLabel}>{j + 1}、 {question.question_name}</label>
                                <span
                                  className={styles.titTxt}>（{question.score_desc[0]}&nbsp;&gt;&nbsp;{question.score_desc[1]}）</span>
                              </div>
                              <div className={styles.listNumber}>
                                <NumListWithoutSecondLevel i={i} j={j} data={question}
                                         onChange={this.numListChangeWithoutSecondLevel.bind(this)}/>
                              </div>
                            </div>
                          );
                        })
                      }
                      </div>
                    </Card>
                  </div>

                );
              })
            }
          </div>
        </Fragment>

      );
    } else {
      return null;
    }
  }

  // 第四个步骤界面
  scaleStep(data) {

    const { flow_type, flow_status, flow_id } = data;

    const { evaluates = [], evaluate_options = [], evaluateSelectVisible, evaluateSelectValue } = this.state;

    let dataSourceOfScaleSelect = [];

    if (evaluateSelectValue) {
      dataSourceOfScaleSelect = evaluate_options.filter(v => v.subject_name.indexOf(evaluateSelectValue) === 0).map(v => v.subject_name);
    } else {
      dataSourceOfScaleSelect = evaluate_options.map(v => v.subject_name);
    }

    return (
      <Fragment>
        <div className={styles.fourMainForm}>
          <h4>量表检测</h4>
          {
            evaluates.map((item, index) => {
              const isComplete = item.evaluate_test_status - 0 === 1;
              return (
                <Row gutter={4} className={styles.fourFormList} key={item.evaluate_test_record_id}>
                  <Col span={8}>
                    <div className={styles.scaleDesc}>
                      {
                        item.subject_name
                      }
                    </div>
                  </Col>
                  {
                    isComplete ? (
                      <Col span={8}>

                        <Button type='primary'
                                onClick={() => this.scanScaleResult(flow_id, item.evaluate_test_record_id)}>查看结果</Button>
                        <Button type='primary' onClick={() => this.startScaleDetect(item, flow_id)}>重新检测</Button>
                        <Button type='danger'
                                onClick={() => this.delList(flow_id, item.evaluate_test_record_id)}>删除</Button>
                      </Col>
                    ) : (
                      <Col span={8}>
                        <Button type='primary' onClick={() => this.startScaleDetect(item, flow_id)}>开始检测</Button>
                        <Button type='danger'
                                onClick={() => this.delList(flow_id, item.evaluate_test_record_id)}>删除</Button>
                      </Col>
                    )
                  }
                </Row>
              );
            })
          }

          {
            (flow_status - 0 !== 2 && evaluate_options_stabel.length > evaluates.length) ? (
              <div>
                <span className={styles.addCard} onClick={(event) => this.addEvaluate(flow_id, event)}>
                  <Icon type="plus"/> <span>添加检测量表</span>
                </span>
              </div>
            ) : null
          }

        </div>
        <ModalDiy
          title="量表添加"
          bodyStyle={{ height: '140px', overflow: 'scroll', paddingTop: '40px' }}
          visible={evaluateSelectVisible}
          onOk={this.handleOkOfEvaluate}
          onCancel={this.handleCancelOfEvaluate}
          width='400px'
          footer={[
            <Button key="submit" type="primary" onClick={() => this.handleOkOfEvaluate(flow_id)}>确定</Button>,
          ]}
        >

          <Row>
            <Col span={16} offset={4}>

              <AutoComplete
                dataSource={dataSourceOfScaleSelect}
                style={{ width: '100%' }}
                onSelect={this.onSelectOfScaleSelect}
                onSearch={this.onSearchOfScaleSelect}
                onChange={this.onChangeOfScaleSelect}
                placeholder=""
                value={evaluateSelectValue}
              />

            </Col>
          </Row>


        </ModalDiy>
      </Fragment>

    );
  }

  // 第五个步骤界面
  finishStep() {

    const { dispatch } = this.props;
    const { patient_case_simple_test_report = {} } = this.state;

    return (
      <Result
        type="success"
        title="提交成功"
        description="患者可前往诊断并获取治疗方案"
        extra={<Extra data={patient_case_simple_test_report}/>}
        actions={<Action dispatch={dispatch}/>}
        className={styles.fiveMainForm}
      />
    );
  }

  renderPatientCaseBasicInfo = (patient_case_basic_info = {}) => {
    const {
      case_disease_name = '',
      case_id = '',
      case_no = '',
      patient_age = '',
      patient_from_department = '',
      patient_from_doctor = '',
      patient_id = '',
      patient_name = '',
      patient_sex = '',
      patient_height = '',
      patient_weight = '',
    } = patient_case_basic_info;
    return (
      <DescriptionList className={styles.headerList} size="small" col="4">
        {
          patient_name && <Description term="姓名">{patient_name}</Description>
        }
        {
          patient_age && <Description term="年龄">{`${patient_age}岁`}</Description>
        }
        {
          (patient_sex - 0 === 1 || patient_sex - 0 === 2) &&
          <Description term="性别">{1 === patient_sex - 0 ? '男' : '女'}</Description>
        }

        {
          patient_height && <Description term="身高">{`${patient_height}cm`}</Description>
        }
        {
          patient_weight && <Description term="体重">{`${patient_weight}kg`}</Description>
        }
        {
          patient_from_doctor && <Description term="临床医生">{patient_from_doctor}</Description>
        }
        {
          patient_from_department && <Description term="来源科室">{patient_from_department}</Description>
        }
        {
          case_disease_name && <Description term="疾病流程">{case_disease_name}</Description>
        }
      </DescriptionList>
    );
  };

  stepsGenerator = (data) => {
    const stepsMap = {
      '1': {
        title: '主诉',
        func: this.chiefStep.bind(this),
      },
      '2': {
        title: '仪器检测',
        func: this.deviceStep.bind(this),
      },
      '3': {
        title: '首访',
        func: this.visitStep.bind(this),
      },
      '4': {
        title: '量表检测',
        func: this.scaleStep.bind(this),
      },
    };
    if (data && Array.isArray(data) && data.length > 0) {
      let steps = data.map(v => {
        return {
          flow_id: v.flow_id,
          flow_type: v.flow_type,
          flow_status: v.flow_status,
          title: stepsMap[v.flow_type + ''].title,
          content: stepsMap[v.flow_type + ''].func(v),
        };
      });
      //"完成"页面的内容来自单独的一个接口
      steps.push({
        title: '完成',
        content: this.finishStep(),
      });
      const firstUncompleteIndex = data.findIndex(v => {
        return v.flow_status === 0 || v.flow_status === 1;
      });
      let current_step = firstUncompleteIndex !== -1 ? firstUncompleteIndex : steps.length - 1;
      return { steps, current_step };
    } else {
      return {
        steps: [],
        current_step: 0,
      };
    }
  };

  footerToolbar = (data, current_step) => {
    return (
      <FooterToolbar>
        {
          current_step > 0 ? (<Button onClick={this.prev.bind(this)}>上一步</Button>) : null
        }
        <Button type='primary' onClick={(event) => this.handleSubmit(event, data)}>提交</Button>
      </FooterToolbar>
    );
  };


  render() {

    const {
      patient_case_basic_info = {},
      patient_case_test_flow_loading,
      current_step = 0,
      patient_case_test_flow = [],
      evaluate_options = [],
      evaluates = [],
      evaluateSelectVisible,
      visits = [],
      evaluateSelectValue,
    } = this.state;

    const { steps } = this.stepsGenerator(patient_case_test_flow);


    return (
      <PageHeaderLayout
        contentStyle={{ marginBottom: 72 }}
        title={patient_case_basic_info.case_no ? `编号：${patient_case_basic_info.case_no}` : ''}

        // logo={
        //   <img alt="" src={images.treatTitle} />
        // }
        content={this.renderPatientCaseBasicInfo(patient_case_basic_info)}
      >
        <Card loading={patient_case_test_flow_loading}>
          {
            steps && steps.length ? (
              <Fragment>
                <Steps current={current_step}>
                  {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>

                <div className={styles['steps-content']}>
                  <Form onSubmit={(event) => this.handleSubmit(event, steps[current_step])} style={{ marginTop: 8 }}>
                    {steps[current_step].content}
                  </Form>
                  {
                    (current_step < steps.length - 1) ? this.footerToolbar(steps[current_step], current_step) : null
                  }
                </div>
              </Fragment>
            ) : null
          }
        </Card>


      </PageHeaderLayout>
    );
  }
}
