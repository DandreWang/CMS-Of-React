import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button } from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import DescriptionList from 'components/DescriptionListDiy';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { images } from '../../utils/images';
import styles from './Diagnostic.less';
import request from '../../utils/request';
import { urls,domain } from '../../utils/urls';
import { message } from 'antd/lib/index';
import { router } from '../../utils/router';

const { Description } = DescriptionList;
let case_id;
@connect(() => ({}))
@Form.create()
export default class Synthesis extends PureComponent {
  state = {
    // patient_case_basic_info_loading:true,
    patient_case_basic_info: {},

    patient_case_diagnosis_report_loading: true,
    patient_case_diagnosis_report: {},
  };

  componentDidMount() {
    const { match: { params = {} } = {} } = this.props;
    case_id = params.case_id;
    this.get_patient_case_basic_info();
  }

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
        // this.setState({patient_case_basic_info_loading:false});
      },
    });

  };

  // 患者信息
  description = (patient_case_basic_info) => {
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

  export = ()=>{
    const url = `${domain}/export_pdf/report_questionnaire_file?case_id=${case_id}`;
    window.open(url,'_blank');
  };


  render() {

    const {
      patient_case_basic_info = {}, patient_case_diagnosis_report_loading, patient_case_diagnosis_report: {
        create_time,
        impression_name,
        impression_level_desc,
        impression_desc,
        chief_report = {},
        medicine_treatments = [],
        physics_treatments = [],
        mentality_treatments = [],
      } = {},
    } = this.state;


    return (
      <PageHeaderLayout
        contentStyle={{marginBottom:72}}
        title={patient_case_basic_info.case_no ? `编号：${patient_case_basic_info.case_no}` : ''}
        // logo={
        //   <img alt="" src={images.treatTitle} />
        // }
        content={this.description(patient_case_basic_info)}
      >
        <Card bordered={false} loading={patient_case_diagnosis_report_loading} className={styles.con}>
          <div className={styles.time}>诊断时间：{create_time}</div>
          <Card type="inner" title="主诉" className={styles.cardItem}>
            <DescriptionList className={styles.cardList} size="small" col="3">
              <Description term="发作频次" termclass={styles.termStyle}>{chief_report.rate}次/天</Description>
              <Description term="发作时间" termclass={styles.termStyle}>{chief_report.occur_date}</Description>
              <Description term="严重程度" termclass={styles.termStyle}>{chief_report.level}</Description>
            </DescriptionList>
            <DescriptionList className={styles.cardList} size="small" col="1">
              <Description term="症状描述" termclass={styles.termStyle}>{chief_report.chief_desc}</Description>
            </DescriptionList>
          </Card>
          <Card type="inner" title="诊断症候" className={styles.cardItem}>
            <DescriptionList className={styles.cardList} size="small" col="1">
              <Description term="症候"
                           termclass={styles.termStyle}>{impression_name}&nbsp;&nbsp;{impression_level_desc}</Description>
            </DescriptionList>
            <DescriptionList className={styles.cardList} size="small" col="1">
              <Description term="诊断描述" termclass={styles.termStyle}>{impression_desc}</Description>
            </DescriptionList>
          </Card>
          <Card type="inner" title="治疗建议" className={styles.cardItem}>
            {
              medicine_treatments && medicine_treatments.length ? (
                <DescriptionList className={styles.cardList} size="small" col="1">
                  <Description term="用药" termclass={styles.termStyle}>
                    {
                      medicine_treatments.map((value, i) => {
                        const { medicine_name, medicine_use_type_desc, medicine_use_amount, medicine_use_rate, medicine_use_days } = value;
                        return (
                          <div
                            key={medicine_name}>{[medicine_name, `${medicine_use_amount}${medicine_use_type_desc}`, `${medicine_use_rate}次/日`, `共${medicine_use_days}日`].join('    ')}</div>
                        );
                      })
                    }
                  </Description>
                </DescriptionList>
              ) : null
            }

            {
              physics_treatments && physics_treatments.length ? (
                <DescriptionList className={styles.cardList} size="small" col="1">
                  <Description term="物理治疗" termclass={styles.termStyle}>
                    {
                      physics_treatments.map((value, i) => {
                        return (
                          <div key={value.item_name}
                               className={styles.listContentItem}>{value.item_name}&nbsp;X&nbsp;{value.item_count}</div>
                        );
                      })
                    }
                  </Description>
                </DescriptionList>
              ) : null
            }

            {
              mentality_treatments && mentality_treatments.length ? (
                <DescriptionList className={styles.cardList} size="small" col="1">
                  <Description term="心理治疗" termclass={styles.termStyle}>
                    {
                      mentality_treatments.map((value, i) => {
                        return (
                          <div key={value.item_name}
                               className={styles.listContentItem}>{value.item_name}&nbsp;X&nbsp;{value.item_count}</div>
                        );
                      })
                    }
                  </Description>
                </DescriptionList>
              ) : null
            }
          </Card>
        </Card>
        <FooterToolbar>
          <Button type="primary" onClick={this.export}>导出</Button>
          {/*<Button type="primary" className={styles.print}>打印</Button>*/}
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
