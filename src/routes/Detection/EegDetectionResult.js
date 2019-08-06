import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Col, Row, Button,Icon,Input,List,message } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import FooterToolbar from 'components/FooterToolbar';
import styles from './EegDetection.less';
import {images} from '../../utils/images';
import {tableHandler} from "../../utils/tableHandler";
import { router } from '../../utils/router';
import request from '../../utils/request';
import {urls} from '../../utils/urls';
import {parse} from 'qs';
import DescriptionList from 'components/DescriptionListDiy';

const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const listData = ['基本波率','慢波','快波','睁闭眼','异常波','功能脑电地形分析'];

let device_test_record_id,case_id,timerId;


@connect(() => ({
}))
@Form.create()
export default class EegDetection extends PureComponent {
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

            <Card type="inner" title={device_category_id_name||"功能脑电检测报告"}>
              {isTest}
            </Card>
            <Card type="inner" className={styles.listCard}>
              <List
                style={{display:'none'}}
                size="small"
                dataSource={listData}
                renderItem={(item) => (<List.Item className={styles.listItem}>{item}</List.Item>)}
              />
              <Row className={styles.footFont}>
                <Col span={2}>
                  <label>结论:</label>
                </Col>
                <Col span={22}>
                  <div>{conclusion||'无'}</div>
                </Col>
              </Row>
            </Card>
          </div>
          <FooterToolbar>
            <Button type="primary" onClick={this.cancel}>确认</Button>
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  }
}
