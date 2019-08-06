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

const timeOut = 3000;

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
        // this.setState({log_id:18,img:'http://xinshijie.sidlu.com:8080/api/photos/device/2018071623474856459.jpg'});
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
