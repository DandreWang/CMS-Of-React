import React, { Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Button, Row, Input } from 'antd';
import lodash from 'lodash';
import { BarDiy, PieDiy,PieDiy2,PieDiy3 } from 'components/Charts';
import FooterToolbar from 'components/FooterToolbar';
import Ellipsis from 'components/Ellipsis';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './VisitResults.less';
import { tableHandler } from '../../utils/tableHandler';
import { router } from '../../utils/router';
import { message } from 'antd/lib/index';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { dataHandler } from '../../utils/dataHandler';
import { business } from '../../utils/business';
import DescriptionList from 'components/DescriptionListDiy';

const { Description } = DescriptionList;
const { TextArea } = Input;

const colors = ['RGBA(133, 220, 171, 1)', 'RGBA(252, 193, 96, 1)', 'RGBA(250, 145, 145, 1)', 'RGBA(179, 24, 24, 1)', 'RGBA(81, 130, 228, 1)'];//暂定：0显示绿色、1显示黄色、2显示粉色、3红、4蓝、

const no = ['一', '二', '三', '四', '五','六','七','八','九','十','十一','十二'];

const ResultDescrip = ({ data: { group_name, calculate_level_name, calculate_level_desc }, i,j, onChangeOfVisit }) => (
  <div className={styles.resultDescripWrapper}>
    <h4 className={styles.describeTiT}>{`${ 1 + j}、${group_name}：${calculate_level_name}`}</h4>
    <div className={styles.describe}>
      <TextArea autosize={{minRows:4,maxRows:12}} defaultValue={calculate_level_desc} onChange={(event)=>onChangeOfVisit(event,i,j)} />
    </div>
  </div>
);

let case_id, flow_id;

@connect(() => ({}))
@Form.create()
export default class VisitResults extends PureComponent {
  state = {
    patient_case_basic_info: {},
    questionnaire_test_result: [],
    loading: true,
  };

  componentDidMount() {
    const { params = {} } = this.props.match;
    case_id = params.case_id;
    flow_id = params.flow_id;

    this.get_patient_case_basic_info();

    this.get_questionnaire_test_result();
  }

  handleSubmit = ()=>{

    const {dispatch} = this.props;
    const {questionnaire_test_result} = this.state;

    request(urls.revise_questionnaire_test_result,{
      body:{flow_id,questionnaire_result:JSON.stringify(questionnaire_test_result)},
      success:data=>{
        router.jump({
          dispatch,
          pathname: `/patient/patient-test/${case_id}`,
        });
      },
      fail:errmsg=>{
        message.error(errmsg || '提交失败');
      },
      complete:()=>{
      },
    });
  };

  get_patient_case_basic_info = () => {

    request(urls.get_patient_case_basic_info, {
      body: { case_id },
      success: patient_case_basic_info => {
        this.setState({ patient_case_basic_info });
      },
      fail: errmsg => {
        message.error(errmsg || '获取病例信息失败');
      },
      complete: () => {
      },
    });

  };

  get_questionnaire_test_result = () => {
    request(urls.get_questionnaire_test_result, {
      body: { flow_id },
      success: questionnaire_test_result => {
        this.setState({ questionnaire_test_result });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };


  back = () => {
    const {
      dispatch,
    } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/patient-test/${case_id}`,

    });
  };

  onChangeOfVisit = (event,i,j) => {
    const {value} = event.target;
    const {questionnaire_test_result} = this.state;
    const result = dataHandler.deepClone(questionnaire_test_result);
    result[i].level2_group_list[j].calculate_level_desc = value;
    this.setState({questionnaire_test_result:result});
  };

  render() {
    const { loading, patient_case_basic_info = {}, questionnaire_test_result = [] } = this.state;

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

    const {piePic,pieData,pieDesc,barPic} = business.questionnaire_parser(questionnaire_test_result);

    let hasSecondLevel = false;
    try{
      hasSecondLevel = questionnaire_test_result[0].level2_group_list.length > 0
    }catch (e) {
      hasSecondLevel = false;
    }


    return (
      <PageHeaderLayout
        contentStyle={{marginBottom:72}}
      >
        <Card bordered={false} loading={loading} className={styles.wrap}>

          <DescriptionList className={styles.headerList} size="small" col="4">
            {
              case_no && <Description term="编号">{case_no}</Description>
            }
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
              patient_from_doctor && <Description term="临床医生">{patient_from_doctor}</Description>
            }
            {
              patient_from_department && <Description term="来源科室">{patient_from_department}</Description>
            }
            {
              case_disease_name && <Description term="疾病流程">{case_disease_name}</Description>
            }
          </DescriptionList>

          {
            hasSecondLevel?(
              <Fragment>
                <Card type="inner" title="整体医学评估结果" className={styles.pieCard}>
                  <div className={styles.pieContainer}>
                    <PieDiy2
                      data={pieData}
                      height={400}
                      className={styles.pieCls}
                    />
                  </div>
                  <div className={styles.pieWrapper}>
                    {
                      pieDesc.map((item, idx) => (
                        <div className={styles.pieItem} key={item.group_name}>
                          <div className={styles.pieTit}>{`${idx + 1}、${item.group_name}：${item.calculate_level_name}`}</div>
                          <div className={styles.pieTxt}>
                            <Ellipsis tooltip lines={2}>{item.calculate_level_desc}</Ellipsis>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </Card>

                <div className={styles.salesBar}>
                  <BarDiy
                    height={200}
                    color={['color', (color) => {
                      return color;
                    }]}
                    title="具体因子分析"
                    data={barPic}
                  />
                </div>

                <div className={styles.testResult}>
                  {
                    questionnaire_test_result.map((value, i) => (
                      <div className={styles.resultItemWrapper} key={value.group_name}>
                        <h3 className={styles.resultItemTit}>{`${no[i]}、${value.group_name}`}</h3>
                        {
                          value.level2_group_list.map((item, j) => (
                            <ResultDescrip data={item} i={i} j={j} key={item.group_name} onChangeOfVisit={this.onChangeOfVisit} />
                          ))
                        }
                      </div>
                    ))
                  }
                </div>
              </Fragment>
            ):(
              <Fragment>
                <Card type="inner" title="整体医学评估结果" className={styles.pieCard}>
                  <div className={styles.pieContainer}>
                    <PieDiy3
                      data={pieData}
                      height={400}
                      className={styles.pieCls}
                    />
                  </div>
                  <div className={styles.pieWrapper}>
                    {
                      pieDesc.map((item, idx) => (
                        <div className={styles.pieItem} key={item.group_name}>
                          <div className={styles.pieTit}>{`${idx + 1}、${item.group_name}：${item.calculate_level_name}`}</div>
                          <div className={styles.pieTxt}>
                            <Ellipsis tooltip lines={2}>{item.calculate_level_desc}</Ellipsis>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </Card>

              </Fragment>
            )
          }





          <FooterToolbar>
            <Button type="primary" onClick={() => this.handleSubmit()}>提交</Button>
            {/*<Button onClick={() => this.back()} className={styles.cancelBtn}>取消</Button>*/}
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  }
}

