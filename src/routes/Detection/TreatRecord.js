import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Select,
  Button,
  Row,
  Col,
  Collapse,
  Modal,
  DatePicker,
  Timeline,
  Upload,
  Icon,
  message,
  Input,
  Radio,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import { images } from '../../utils/images';
import styles from './TreatRecord.less';
import { tableHandler } from '../../utils/tableHandler';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { dataHandler } from '../../utils/dataHandler';
import { router } from '../../utils/router';
import ModalDiy from 'components/ModalDiy';

const { Description } = DescriptionList;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;

const TimeLineTitle = ({ title, time }) => (
  <div className={styles.setTitle}>
    <label>{title}</label>
    <span>{time}</span>
  </div>
);

let case_id;
@connect(() => ({}))
@Form.create()
export default class TreatRecord extends PureComponent {
  state = {
    indexRecord:[],
    patient_case_basic_info: {},
    loading: true,
    patient_case_treatment_flow_records: [],
    start_date:moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date:moment().format('YYYY-MM-DD'),

    previewVisible:false,
    previewImage:'',

  };

  // 组件加载完成
  componentDidMount() {
    const { match: { params = {} } = {} } = this.props;
    case_id = params.case_id;

    this.get_patient_case_basic_info();
    this.get_patient_case_treatment_flow_records();
  }

  onChangeOfRangePicker = (dates,dateStrings)=>{
    this.setState({
      start_date:dateStrings[0],
      end_date:dateStrings[1],
    })
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

  get_patient_case_treatment_flow_records = () => {

    const {start_date,end_date} = this.state;
    request(urls.get_patient_case_treatment_flow_records, {
      body: { case_id,start_date,end_date },
      success: patient_case_treatment_flow_records => {
        const a = patient_case_treatment_flow_records.map(v=>{
          return 0
        });
        this.setState({indexRecord:a},()=>{
          this.setState({ patient_case_treatment_flow_records });
        });


      },
      fail: errmsg => {
        message.error(errmsg || '获取信息失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });

  };

  showDetails = (event,i,j) => {
    const {indexRecord} = this.state;
    const a = dataHandler.deepClone(indexRecord);
    if(a[i]===j){
      a[i] = -1;
    }else{
      a[i] = j;
    }
    this.setState({
      indexRecord:a,
    });
  };


  showCardDetail = (index,flag) => {

    if(flag===-1){
      return null;
    } else{
      let dom,recordArr=[];
      const NoRecordDom = ()=>{
        return (
          <Row>
            <Col span={22}>
              <div className={styles.cardDetail} style={{padding:8,fontSize:13,color:'rgba(0, 0, 0, 0.65)'}}>
                无记录
              </div>
            </Col>
          </Row>
        )
      };
      try{
        const {patient_case_treatment_flow_records=[]} = this.state;
        const {detail_list=[]} = patient_case_treatment_flow_records[index];
        const {detail_result_desc=[]} = detail_list[flag];
        dom = (
          <div className={styles.cardDetail} style={{paddingBottom:8}}>
            {
              detail_result_desc && detail_result_desc.length ? (
                detail_result_desc.map((value, i) => {
                  const {property_name,property_value,property_type} = value;
                  const hasRecord = ([1, 2, 3, 4].indexOf(property_type) !== -1&&property_name&&property_value)||(property_type-0===5&&property_value);
                  recordArr.push(hasRecord?1:0);
                  const isPicture = property_type-0 === 5;
                  return hasRecord ? (
                    isPicture?(
                          property_value && property_value.length?(
                            <Fragment key={`detail_result_desc${i}`}>
                              {
                                property_value.map((item,j)=>{
                                  return (
                                    <Fragment key={`${item}`}>
                                      <img onClick={()=>this.showPreview(item)} className={styles.detail_result_desc_img} src={item} alt="" key={`img${i}-${j}`} />
                                    </Fragment>

                                  )
                                })
                              }
                            </Fragment>
                        ):null

                      ):(<p key={`detail_result_desc${i}`} style={{marginBottom:0,paddingBottom:0}}>{property_name}: {property_value}</p>)
                  ) : null;
                })
              ) : null
            }
          </div>
        );
      }catch (e) {
        dom = null
      }
      if(recordArr.indexOf(1) === -1){
        return (
          <NoRecordDom />
        )
      }else{
        return dom || <NoRecordDom />;
      }
    }

  };

  search = ()=>{
    this.get_patient_case_treatment_flow_records();
  };

  scanReport = ()=>{
    const {dispatch} = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/synthesis/${case_id}`,
      newTab:true,
    });
  };

  renderPatientCaseBasicInfo = (patient_case_basic_info = {}) => {
    const {
      case_disease_name = '',
      patient_age = '',
      patient_from_department = '',
      patient_from_doctor = '',
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

  showPreview = (previewImage)=>{
    this.setState({
      previewVisible:true,
      previewImage,
    })
  };

  hidePreview = ()=>{
    this.setState({
      previewVisible:false,
      previewImage:'',
    })
  };



  render() {
    const { patient_case_basic_info = {}, loading, patient_case_treatment_flow_records = [],indexRecord=[],start_date,end_date } = this.state;

    const {previewVisible,previewImage} = this.state;

    return (
      <PageHeaderLayout
        title={patient_case_basic_info.case_no ? `编号：${patient_case_basic_info.case_no}` : ''}
        content={this.renderPatientCaseBasicInfo(patient_case_basic_info)}
      >
        <div className={styles.search}>
          <label>时间段筛选：</label>
          <RangePicker
            value={[moment(start_date,dateFormat), moment(end_date,dateFormat)]}
            format={dateFormat}
            onChange={this.onChangeOfRangePicker}
          />
          <Button type="primary" onClick={this.search}>搜索</Button>
          <Button type="primary" onClick={this.scanReport} style={{marginLeft:8}}>查看报告</Button>
        </div>
        <Card loading={loading}>
          <Timeline className={styles.timeWrap}>
            {
              patient_case_treatment_flow_records && patient_case_treatment_flow_records.length ? (
                patient_case_treatment_flow_records.map((value, i) => {
                  return (
                    <Timeline.Item key={`${value.create_time}`}>
                      <TimeLineTitle title='治疗' time={value.create_time}/>
                      <Row gutter={24}>
                        {
                          value.detail_list && value.detail_list.length ? (
                            value.detail_list.map((item, j) => {
                              const status = item.status - 0;
                              return (
                                <Col span={5} key={`${item.detail_name}${j}`}>
                                  <Row
                                    className={styles.cardStyle}
                                    onClick={(event)=>{this.showDetails(event,i,j)}}
                                  >
                                    <Col span={4} style={{ textAlign: 'center' }}>
                                      <Icon type={status===1?'check-circle':'close-circle'} />
                                    </Col>
                                    <Col span={18}>
                                      <span>{item.detail_name}</span>
                                    </Col>
                                    {
                                      <Col span={2}>
                                        <Icon type={indexRecord[i]===j ? 'up' : 'down'} />
                                      </Col>
                                    }
                                  </Row>
                                </Col>

                              );
                            })
                          ) : null
                        }
                      </Row>
                      <Row>
                        <Col span={22}>
                          {
                            this.showCardDetail(i,indexRecord[i])
                          }
                        </Col>
                      </Row>
                    </Timeline.Item>
                  );
                })
              ) : (<div style={{textAlign:'center'}}>无治疗记录</div>)
            }
          </Timeline>
        </Card>

        <ModalDiy visible={previewVisible} footer={null} onCancel={this.hidePreview} width={'400px'} wrapClassName='abc' style={{padding:'20px'}} className='image_preview_modal'>
          <img alt="无法显示" style={{ width: '100%' }} src={previewImage} />
        </ModalDiy>
      </PageHeaderLayout>
    );
  }
}
