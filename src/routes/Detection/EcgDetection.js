import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Col, Row, Button, Icon, Input, Table,message } from 'antd';

import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './EcgDetection.less';
import {images} from '../../utils/images';
import {tableHandler} from "../../utils/tableHandler";
import { router } from '../../utils/router';
import { parse } from 'qs';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { dataHandler } from '../../utils/dataHandler';
import DescriptionList from 'components/DescriptionListDiy';

const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

let device_test_record_id,case_id,timerId;

const timeOut = 3000;

@connect(() => ({
}))
@Form.create()
export default class EcgDetection extends PureComponent {
  state = {
    patient_case_basic_info:{},
    loading:true,
    log_id:'',
    img:'',
    conclusion:'',
    device_category_id_name:'',
    status:'',// 0 未开始， 1 已完成
  };

  componentDidMount(){

    const {match:{params={}}={}} = this.props;
    case_id = params.case_id;
    device_test_record_id = params.device_test_record_id;

    this.get_patient_case_basic_info();

    this.get_device_test_detail();

  }

  componentWillUnmount(){

    timerId&&window.clearInterval(timerId);

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

  get_newest_device_test_log = ()=>{

    request(urls.get_newest_device_test_log,{
      body:{device_test_record_id},
      success:data=>{
        if(data){
          const {log_id,log_file_path} = data;
          this.setState({log_id,img:log_file_path});
        }
        // this.setState({log_id:8,img:'http://xinshijie.sidlu.com:8080/api/photos/device/2018071519363267390.jpg'});
      },
      fail:errmsg=>{
        message.error(errmsg||'获取失败');
      },
      complete:()=>{
        this.setState({loading:false});
      },
    });
  };

  get_device_test_detail = ()=>{

    request(urls.get_device_test_detail,{
      body:{device_test_record_id},
      success:data=>{
        if(data){
          const {log_id,test_img,status,conclusion,device_category_id_name} = data;
          this.setState({log_id,img:test_img,status,conclusion,device_category_id_name});
        }
      },
      fail:errmsg=>{
        message.error(errmsg||'获取失败');
      },
      complete:()=>{
        this.setState({loading:false});
        timerId = window.setInterval(this.get_newest_device_test_log,timeOut);
      },
    });

  };

  submit = () =>{

    const {conclusion,log_id} = this.state;
    const { dispatch } = this.props;
    request(urls.save_device_test_detail,{
      body:{ device_test_record_id,log_id,conclusion },
      success:()=>{
        router.jump({
          dispatch,
          pathname:`/patient/patient-test/${case_id}`,
        });
      },
      fail:errmsg=>{
        message.error(errmsg||'提交失败');
      },
    });
  };

  cancel = () =>{


    const {dispatch} = this.props;
    router.jump({
      dispatch,
      pathname:`/patient/patient-test/${case_id}`,
    });
  };

  onChangeOfSummary = (event) => {
    const {value} = event.target;
    this.setState({conclusion:value});
  };

  render() {

    const {patient_case_basic_info={},loading,log_id,status,conclusion,img,device_category_id_name} = this.state;
    const {case_no,patient_name,patient_age,patient_sex,patient_from_doctor,patient_from_department,case_disease_name} = patient_case_basic_info||{};


    const UnTest = (
      <div className={styles.untestContent}>
        <div className={styles.child}>
          <img src={images.tvHeart} alt="" className={styles.unImg} />
          <p className={styles.unTxt}>等待检测中...</p>
        </div>
      </div>
    );

    const isTest = (!!img) ? (
      <div className={styles.testContent}>
        <img src={img} alt="" className={styles.img} />
      </div>
    ) : UnTest;

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        align: 'left',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        align: 'center',
        render: (text) => (
          <span>{text === 'ms2' ? (<span>ms<sup>2</sup></span>) : text}</span>
        ),
      },
      {
        title: '检测结果',
        dataIndex: 'detectionRes',
        align: 'center',
      },
      {
        title: '参考范围',
        dataIndex: 'range',
        align: 'center',
      },
    ];

    const data = [
      {
        key: '1',
        name: '5分钟总功率(5min total power)',
        unit: 'ms2',
        detectionRes: '591.16↓',
        range: '3466 ± 1018',
      },
      {
        key: '2',
        name: '低频功率(LF)',
        unit: 'ms2',
        detectionRes: '270.13↓',
        range: '1170 ± 416',
      },
      {
        key: '3',
        name: '高频功率(HF)',
        unit: 'ms2',
        detectionRes: '46.56↓',
        range: '975 ± 203',
      },
      {
        key: '4',
        name: '低频与高频功率的比值(LF/HF)',
        unit: '',
        detectionRes: '5.80↓',
        range: '1.5 - 2.0',
      },
      {
        key: '5',
        name: '正常R-R间期的标准差(SDNN)',
        unit: 'ms',
        detectionRes: '34.86↑',
        range: '141 ± 39',
      },
      {
        key: '6',
        name: '相邻正常R-R间期差值的均方根值(RMSSD)',
        unit: 'ms',
        detectionRes: '19.20↓',
        range: '27 ± 12',
      },
    ];

    return (
      <PageHeaderLayout contentStyle={{marginBottom:72}}>
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

          <div className={styles.headTest}>
            <Card type="inner" title={device_category_id_name||"植物神经功能检测报告"} >
              {isTest}
            </Card>
            <Card type="inner" className={styles.listCard}>
              <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={false}
                style={{display:'none'}}
              />
              <Row className={styles.footFont}>
                <Col span={2}>
                  <label>结论:</label>
                </Col>
                <Col span={22}>
                  <TextArea
                    autosize={{minRows:4,maxRows:12}}
                    placeholder="请输入"
                    onChange={this.onChangeOfSummary}
                    value={conclusion}
                  />
                </Col>
              </Row>
            </Card>
          </div>
          <FooterToolbar>
            <Button type="primary" onClick={this.submit}>提交</Button>
            {/*<Button type="primary" disabled={!log_id} onClick={this.submit}>提交</Button>*/}
            <Button onClick={this.cancel} className={styles.cancelBtn}>取消</Button>
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  }
}
