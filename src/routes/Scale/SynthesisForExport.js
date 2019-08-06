import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Col, Button, Row, List, Radio, Table } from 'antd';
import {
  BarDiy2,
  PieDiy,
  PieDiy2,
  PieDiy3,
  BarDiy,
  Radar,
  RadarDiy,
  Gauge,
  GaugeDiy,
  BrokenLineDiy,
  DotDiy,
} from 'components/Charts';

import FooterToolbar from 'components/FooterToolbar';
import Ellipsis from 'components/Ellipsis';
import DescriptionList from 'components/DescriptionListDiy';
import lodash from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BlankLayout from '../../layouts/BlankLayout';
import { images } from '../../utils/images';
import styles from './SynthesisForExport.less';
import { tableHandler } from '../../utils/tableHandler';
import { message } from 'antd/lib/index';
import request from '../../utils/request';
import { urls, domain } from '../../utils/urls';
import { business } from '../../utils/business';
import { router } from '../../utils/router';
import print from 'print-js'

const { Description } = DescriptionList;

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;

const no = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];


// 设置描述
const ResultDescrip = ({ data: { group_name, calculate_level_name, calculate_level_desc }, i, j }) => (
  <div className={styles.resultDescripWrapper} key={group_name}>
    <h4 className={styles.describeTiT}>{`${j + 1}、${group_name}：${calculate_level_name}`}</h4>
    {calculate_level_desc && calculate_level_desc !== '无' ? <p className={styles.describe}>{calculate_level_desc}</p> : null}
  </div>
);

// 设置标题样式
const MyTitle = ({ title, className,style }) => <h3 style={style||{}} className={className}>{title}</h3>;
let case_id;
@connect(() => ({}))
@Form.create()
export default class Synthesis extends PureComponent {
  state = {
    current: 1,
    loading: true,
    patient_case_basic_info: {},
    patient_case_test_report: {},
  };

  componentDidMount() {
    const { params = {} } = this.props.match;
    case_id = params.case_id;
    this.get_patient_case_basic_info();
    this.get_patient_case_final_report();
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
      },
    });

  };

  get_patient_case_final_report = () => {
    this.setState({ loading: true });
    request(urls.get_patient_case_final_report, {
      body: { case_id },
      success: patient_case_test_report => {
        this.setState({ patient_case_test_report });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };

  onTabChange = (key) => {
    this.setState({
      current: key,
    });
  };


  picture_data_com = (pic_data, subject_name) => {
    try {
      const { picture_type } = pic_data;
      if (picture_type - 0 === 4) {
        // 柱状图
        const { max_score, data } = pic_data;
        const dataTrans = data.map(v => {
          return {
            x: v.field_name,
            y: v.field_score,
          };
        });

        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col span={24} className={styles.salesBar} style={{ backgroundColor: '#fff' }}>
                <BarDiy2
                  height={200}
                  color={['y', (y) => {
                    return y < 0 ? 'RGBA(255, 0, 0, 0.8)' : '#1890FF';
                  }]}
                  // title={evaluate_form_name}
                  data={dataTrans}
                />
              </Col>
            </Row>
          </Fragment>

        );
      }
      else if (picture_type - 0 === 3) {
        // 仪表盘
        const { score, max_score } = pic_data;
        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col className={styles.gaugeWrap} span={24} offset={0}>
                <GaugeDiy
                  score={score}
                  max_score={max_score}
                  // forceFit={false}
                />
              </Col>
            </Row>
          </Fragment>


        );
      }
      else if (picture_type - 0 === 1) {
        //  雷达图
        const { data } = pic_data;
        const data_ok = data.map((value, index) => {
          return {
            name: '',
            value: value.field_score,
            label: value.field_name,
          };
        });
        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col className={styles.radarWrap} span={24} offset={0}>
                <RadarDiy
                  // hasLegend={false}
                  // width={300}
                  height={440}
                  data={data_ok}
                  // forceFit={false}
                />
              </Col>
            </Row>
          </Fragment>

        );
      }
      else if (picture_type - 0 === 2) {
        // 折线图 + 点图
        const { x, y, data } = pic_data;
        const height = 300;
        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row gutter={12}>

              <Col span={8}>
                <DotDiy x={x} y={y} height={height} />
              </Col>

              <Col span={16} className={styles.brokenLineWrap}>
                <BrokenLineDiy data={data} height={height} />
              </Col>


            </Row>
          </Fragment>


        );
      }
    } catch (e) {
      return null;
    }
  };

  table_data_parser = (data) => {

    try {
      const row0 = data[0];
      const keys = lodash.range(row0.length).map(v => `${v  }`);

      const columns = keys.map((value, index) => {
        return {
          dataIndex: value,
          align: 'center',
        };
      });

      const table_source = data.map((value, index) => {
        const obj = {};
        value.forEach((ele, key) => {
          obj[keys[key]] = ele;
        });
        return obj;
      });

      return { columns, table_source };
    } catch (e) {
      return {};
    }


  };

  tab0 = () => {
    const {patient_case_basic_info} = this.state;
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
    } = patient_case_basic_info||{};
    return (
      <div key='tab0'>
        <Card type="inner" title="患者信息">

          <DescriptionList className={styles.headerList} size="small" col="3">
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
              <Description term="性别">{patient_sex - 0 === 1 ? '男' : '女'}</Description>
            }
          </DescriptionList>
        </Card>

      </div>


    );
  };

  tab1 = () => {

    const { patient_case_test_report = {} } = this.state;
    const { chief_report = {}, questionnaire_report = [], evaluate_test_report = [] } = patient_case_test_report || {};
    const { pieData, pieDesc, barPic } = business.questionnaire_parser(questionnaire_report || []);
    let questionnaire_report_real = [];
    try {
      questionnaire_report_real = questionnaire_report && questionnaire_report.length ? questionnaire_report.filter(value=>{
        return value.level2_group_list.filter(v=>{
          return v.calculate_level_name && v.calculate_level_name!=='无';
        }).length
      }):[];
    }catch (e) {
      questionnaire_report_real = [];
    }

    let hasSecondLevel = false;
    try{
      hasSecondLevel = questionnaire_report[0].level2_group_list.length > 0
    }catch (e) {
      hasSecondLevel = false;
    }

    return (
      <div key='tab1'>
        <MyTitle title="" className={`${styles.font_h3}`} />
        {
          chief_report ? (
              this.chiefReportCom(chief_report)
          ) : (<div style={{ textAlign: 'center', lineHeight: 3 }}>暂无主诉信息</div>)
        }

        {
          hasSecondLevel ? (
            <Fragment>
              <Card type="inner" title="" className={`${styles.pieCard}`}>
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
                        <div
                          className={styles.pieTit}
                        >{`${idx + 1}、${item.group_name}：${item.calculate_level_name}`}
                        </div>
                        <div className={styles.pieTxt}>
                          <Ellipsis tooltip lines={2}>{item.calculate_level_desc}</Ellipsis>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Card>

              <div className={`${styles.salesBar} ${styles.export_block}`} style={{ marginTop: 15 }}>
                <BarDiy
                  height={200}
                  color={['color', (color) => {
                    return color;
                  }]}
                  title="具体因子分析"
                  data={barPic}
                  // labelOptions={{ textStyle: { rotate: 10 } }}
                />
              </div>

              {
                questionnaire_report_real&&questionnaire_report_real.length?(
                  <div className={styles.testResult}>
                    {
                      questionnaire_report_real.map((value, i) => (
                        <div className={styles.resultItemWrapper} key={value.group_name}>
                          <h3 className={styles.resultItemTit}>{`${no[i]}、${value.group_name}`}</h3>
                          {
                            value && value.level2_group_list && value.level2_group_list.length ? (value.level2_group_list.filter(v=>{
                                return v.calculate_level_name && v.calculate_level_name!=='无';
                              }).map((item, j) => (
                                <ResultDescrip data={item} i={i} j={j} key={item.group_name} />
                              ))
                            ):null
                          }
                        </div>
                      ))
                    }
                  </div>
                ):null
              }

            </Fragment>
          ) :questionnaire_report&&questionnaire_report.length?(
            <Fragment>
              <Card type="inner" title="" className={`${styles.pieCard}`}>
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
                        <div
                          className={styles.pieTit}
                        >{`${idx + 1}、${item.group_name}：${item.calculate_level_name}`}
                        </div>
                        <div className={styles.pieTxt}>
                          <Ellipsis tooltip lines={2}>{item.calculate_level_desc}</Ellipsis>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Card>

            </Fragment>
          ) :(<div style={{ textAlign: 'center', lineHeight: 3 }}>暂无量表信息</div>)
        }


      </div>
    );
  };

  tab2 = () => {

    try {
      const { patient_case_test_report } = this.state;

      const { evaluate_test_report } = patient_case_test_report;

      return (

        <div key='tab2'>
          <MyTitle title="" className={`${styles.font_h3} ${styles.export_block}`} />

          {
            evaluate_test_report && evaluate_test_report.length ? (
              evaluate_test_report.map((report, index) => {
                const { subject_name, picture_data, report_data, table_data = [] } = report || {};

                const { columns, table_source } = this.table_data_parser(table_data);

                const comDiy = this.picture_data_com(picture_data, subject_name);

                const { conclusion = '', advice = '' } = report_data || {};

                return (
                  <div className={`${styles.blockLevel} ${index!==0?styles.export_block:''}`} key={`report${index}`}>

                    {
                      comDiy
                    }

                    {
                      table_source && table_source.length ? (
                        <Table
                          rowKey='0'
                          showHeader={false}
                          columns={columns}
                          dataSource={table_source}
                          bordered
                          pagination={false}
                        />
                      ) : null
                    }
                    {
                      conclusion ? (
                        <div className={styles.testResult}>
                          <div className={styles.resultItemWrapper}>
                            <div className={styles.describeTiT1}>评测参考：</div>
                            <div className={styles.details}>{conclusion}</div>
                          </div>
                        </div>
                      ) : null
                    }

                    {
                      advice ? (
                        <div className={styles.testResult}>
                          <div className={styles.resultItemWrapper}>
                            <div className={styles.describeTiT1}>建议：</div>
                            <div className={styles.details}>{advice}</div>
                          </div>
                        </div>
                      ) : null
                    }
                  </div>
                );
              })
            ) : (<div style={{ textAlign: 'center' }}>暂无相关信息</div>)

          }


        </div>

      );

    } catch (e) {
      return (<div style={{ textAlign: 'center' }}>暂无相关信息</div>);
    }
  };

  tab3 = () => {
    const { patient_case_test_report: { device_report = [] } = {} } = this.state;

    return (
      <div key='tab3'>
        <MyTitle title="" className={`${styles.font_h3} ${styles.export_block}`} />
        {
          device_report && device_report.length ? device_report.map((value, i) => {
            const { test_img, device_category_name, conclusion, device_category_id } = value || {};
            return (
              <div key={`device_category_id${device_category_id}`} className={`${i!==0?styles.export_block:''}`}>

                <Card
                  type="inner"
                  title={`${device_category_name}报告`}
                  className={styles.blockLevel}
                  style={{ marginBottom: 0, marginTop: i !== 0 ? 15 : 0 }}
                >
                  <div className={styles.testContent}>
                    <img src={test_img} alt="" className={styles.img} />
                  </div>
                  <div className={styles.conclusion}>
                    结论: {conclusion || '无'}
                  </div>
                </Card>

              </div>
            );
          }) : (<div style={{ textAlign: 'center' }}>暂无相关信息</div>)
        }
      </div>
    );
  };

  tab4 = () => {
    const { patient_case_test_report = {} } = this.state;
    const { diagnosis_report,chief_report } = patient_case_test_report || {};
    const {
      create_time, diagnosis_selections,
      assist_diagnosis_selections,
      symptom_diagnosis,
      pre_diagnosis,
      medical_analysis,
      medicine_treatments, physics_treatments, mentality_treatments,
    } = diagnosis_report || {};

    return (

      <div key='tab4' className={styles.export_block}>


        <MyTitle title="" className={`${styles.font_h3}`} />

        {
          diagnosis_report ? (
            <Card bordered={false} className={`${styles.blockLevel} ${styles.diagnosis}`}>
              {
                create_time ? (<div className={styles.time}>诊断时间：{create_time}</div>) : null
              }
              {
                chief_report ? (
                  this.chiefReportCom(chief_report)
                ) : null
              }

              <Card type="inner" title="诊断结论" className={styles.cardItem}>
                {
                  diagnosis_selections ? (
                    <DescriptionList className={styles.cardList} size="small" col="1">
                      <Description
                        term="诊断选项"
                        termclass={styles.termStyle}
                      >{diagnosis_selections}
                      </Description>
                    </DescriptionList>
                  ) : null
                }
                {
                  assist_diagnosis_selections ? (
                    <DescriptionList className={styles.cardList} size="small" col="1">
                      <Description
                        term="辅助诊断选项"
                        termclass={styles.termStyle}
                      >{assist_diagnosis_selections}
                      </Description>
                    </DescriptionList>
                  ) : null
                }
                {
                  symptom_diagnosis ? (
                    <DescriptionList className={styles.cardList} size="small" col="1">
                      <Description
                        term="症状学诊断"
                        termclass={styles.termStyle}
                      >{symptom_diagnosis}
                      </Description>
                    </DescriptionList>
                  ) : null
                }
                {
                  pre_diagnosis ? (
                    <DescriptionList className={styles.cardList} size="small" col="1">
                      <Description
                        term="初步诊断"
                        termclass={styles.termStyle}
                      >{pre_diagnosis}
                      </Description>
                    </DescriptionList>
                  ) : null
                }
                {
                  medical_analysis ? (
                    <DescriptionList className={styles.cardList} size="small" col="1">
                      <Description
                        term="整体医学分析"
                        termclass={styles.termStyle}
                      >{medical_analysis}
                      </Description>
                    </DescriptionList>
                  ) : null
                }


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
                                key={medicine_name}
                                className={styles.listContentItem}
                              >{[medicine_name, `${medicine_use_amount}${medicine_use_type_desc}`, `${medicine_use_rate}次/日`, `共${medicine_use_days}日`].join('    ')}
                              </div>
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
                              <div
                                key={value.item_name}
                                className={styles.listContentItem}
                              >{value.item_name}&nbsp;X&nbsp;{value.item_count}
                              </div>
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
                              <div
                                key={value.item_name}
                                className={styles.listContentItem}
                              >{value.item_name}&nbsp;X&nbsp;{value.item_count}
                              </div>
                            );
                          })
                        }
                      </Description>
                    </DescriptionList>
                  ) : null
                }
              </Card>
            </Card>
          ) : (<div style={{ textAlign: 'center' }}>暂无相关信息</div>)
        }


      </div>
    );
  };

  print = ()=>{
    return window.print();

    print({
      printable:'exportWrapId',
      type:'html',
      showModal:true,
      modalMessage:'文档获取中...',
      targetStyles:['*'],
      ignoreElements:['footerWrapId'],

    });
  };
  export = () => {
    // const url = `${domain}/export_pdf/report_questionnaire_file?case_id=${case_id}`;
    // window.open(url,'_blank');

    return window.print();


    const canvasArr = document.getElementsByTagName('canvas');
    let CANVASAMOUNT = canvasArr.length;
    let canvaNum = canvasArr.length;
    let timerId = null;
    if(CANVASAMOUNT){

      timerId = setInterval(()=>{
        if(canvaNum===0){
          timerId && clearInterval(timerId);

          const canvasIds = [];
          for(let index=0;index<CANVASAMOUNT;++index){
            const canvasDom = canvasArr[index];
            canvasIds.push(canvasDom.getAttribute('id'));

          }

          for(let index=0;index<canvasIds.length;index++){
            const canvasDom = document.getElementById(canvasIds[index]);
            canvasDom.parentNode.removeChild(canvasDom);
          }

          this.print();
        }
      },1000);

      for(let index=0;index<CANVASAMOUNT;++index){
        const canvasDom = canvasArr[index];
        const {width,height} = canvasDom.style;
        const img = new Image();
        img.src = canvasDom.toDataURL();
        img.setAttribute('width',width);
        img.setAttribute('height',height);

        img.onload = ()=>{
          canvaNum -= 1;
        };
        canvasDom.parentNode.appendChild(img);
      }


    }else{
      this.print();
    }

  };

  chiefReportCom = (data)=>{
    const { rate, level, chief_desc, first_occur_date,last_occur_date,reason='' } = data || {};
    return (
      <Card type="inner" title="主诉" className={styles.firstCard}>
        {
          rate || first_occur_date || last_occur_date || level ?(
            <Fragment>
              <Row className={styles.chiefRow}>
                {
                  rate?(
                    <Col span={8}>
                      <Row gutter={4}>
                        <Col span={9}>发作频次:</Col>
                        <Col span={15}>{rate}</Col>
                      </Row>
                    </Col>
                  ):null
                }
                {
                  first_occur_date?(
                    <Col span={8}>
                      <Row gutter={4}>
                        <Col span={11}>首次发作时间:</Col>
                        <Col span={13}>{first_occur_date}</Col>
                      </Row>
                    </Col>
                  ):null
                }
                {
                  last_occur_date?(
                    <Col span={8}>
                      <Row gutter={4}>
                        <Col span={11}>末次发作时间:</Col>
                        <Col span={13}>{last_occur_date}</Col>
                      </Row>
                    </Col>
                  ):null
                }
              </Row>
              <Row className={styles.chiefRow}>
                {
                  level?(
                    <Col span={8}>
                      <Row gutter={4}>
                        <Col span={9}>严重程度:</Col>
                        <Col span={15}>{level}</Col>
                      </Row>
                    </Col>
                  ):null
                }
              </Row>


            </Fragment>
          ):null
        }
        {
          chief_desc?(
            <Row className={styles.chiefRow} gutter={4}>
              <Col span={3}>
                症状描述:
              </Col>
              <Col span={21}>
                {
                  chief_desc
                }
              </Col>
            </Row>
          ):null
        }
        {
          reason?(
            <Row className={styles.chiefRow} gutter={4}>
              <Col span={3}>
                应激因素:
              </Col>
              <Col span={21}>
                {
                  reason
                }
              </Col>
            </Row>
          ):null
        }
      </Card>
    )
  };

  render() {
    const { current, loading, patient_case_basic_info, patient_case_test_report } = this.state;
    const { case_no } = patient_case_basic_info || {};
    return (
      <BlankLayout id='exportWrapId'>
        <Card bordered={false} loading={loading} className={styles.wrap}>
          <MyTitle title="整体医学评估报告" className={styles.main_title} />
          {
            [0,1,2,3,4].map((value) => {
              return this[`tab${value}`]();
            })
          }
        </Card>
        <div className={styles.footerWrap} id='footerWrapId'>
          <FooterToolbar>
            <Button type="primary" onClick={this.export}>导出</Button>
          </FooterToolbar>
        </div>

      </BlankLayout>
    );
  }
}
