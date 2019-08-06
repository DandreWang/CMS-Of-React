import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  Button,
  Radio,
  message, Row, Affix,
} from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Answer.less';
import {dataHandler} from "../../utils/dataHandler";
import {router} from "../../utils/router";
import request from '../../utils/request';
import { urls } from '../../utils/urls';

const RadioGroup = Radio.Group;

let case_id,flow_id,evaluate_test_record_id;

@connect(() => ({
}))
@Form.create()
export default class Answer extends PureComponent {

  state = {
    subject_name:'',
    questions:[],
    loading:true,
  };
  componentDidMount(){

    const {params={}} = this.props.match;
    case_id = params.case_id;
    evaluate_test_record_id = params.evaluate_test_record_id;
    flow_id = params.flow_id;

    request(urls.get_evaluate_record_questions,{
      body:{evaluate_test_record_id,flow_id},
      success:data=>{
        const {subject_name,questions} = data;
        this.setState({subject_name,questions});
      },
      fail:errmsg=>{
        message.error(errmsg||'获取失败');
      },
      complete:()=>{
        this.setState({loading:false});
      },
    });
  };

  onChange = (event,index) => {
    const {questions} = this.state;
    const question_list_copy = dataHandler.deepClone(questions);
    const {value} = event.target;
    question_list_copy[index].current_selection = value;
    this.setState({questions:question_list_copy});
  };

  submitAnswer = () => {

    const {questions} = this.state;
    const unAnsweredIndex = questions.findIndex(v=>!(v.current_selection));
    if(unAnsweredIndex!==-1){
      message.error('请答题');
      document.querySelector(`#item${unAnsweredIndex}`).scrollIntoView();
    }else{
      const {dispatch} = this.props;
      const answers = questions.map(v=>{
        return {
          sn:v.sn,
          select_index:v.current_selection,
        }
      });
      request(urls.save_evaluate_test_record_answers,{
        body:{evaluate_test_record_id,flow_id,answers:JSON.stringify(answers)},
        success:()=>{
          router.jump({
            dispatch,
            pathname: `/patient/scale-results/${case_id}/${flow_id}/${evaluate_test_record_id}`,
          });
        },
        fail:errmsg=>{
          message.error(errmsg||'提交失败');
        },
        complete:()=>{

        },
      });
    }





  };

  cancel = () => {
    const {dispatch} = this.props;
    router.jump({
      dispatch,
      pathname:`/patient/patient-test/${case_id}`,
    });
  };

  answersParse(){
    const {questions=[]} = this.state;
    let total = questions.length,answered = 0;
    questions.forEach(value=>{
      value.current_selection && answered++;
    });
    return {answered,total};

  }

  render() {

    const { loading,questions=[],subject_name } = this.state;

    const answersCalc = this.answersParse();

    return (
      <PageHeaderLayout contentStyle={{marginBottom:72}}>
        <Card className={styles.cardStyle} loading={loading}>

          <h2 className={styles.tit}>{subject_name}</h2>

          <div className={styles.affixWrap}>
            <Affix offsetTop={30}>
              <div className={styles.answerSta}>{`已答题数${answersCalc.answered}/总题数${answersCalc.total}`}</div>
            </Affix>
          </div>



          {questions.map((data,index) => {
            const {current_selection,selections,sn,title} = data;
            const optionsNormative = selections.map(v=>{
              return {
                label:v.selection_title,
                value:v.selection_index,
              }
            });
            return (
              <div key={`${title}`} id={`item${index}`} className={styles.questionWrap}>
                <div className={styles.navStyle}>{index + 1}、{title}</div>
                <RadioGroup  className={styles.radioStyle} options={optionsNormative} name={`name${index}`} onChange={(event)=>this.onChange(event,index)} value={current_selection}/>
              </div>
            );
          })}
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.submitAnswer}>
            提交
          </Button>
          <Button onClick={this.cancel} className={styles.cancelBtn}>取消</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
