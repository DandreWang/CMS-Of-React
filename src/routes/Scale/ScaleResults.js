import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Button, Row, Table, Input, Divider } from 'antd';
import { BarDiy2, Radar,RadarDiy,Gauge,GaugeDiy,BrokenLineDiy,DotDiy } from 'components/Charts';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ScaleResults.less';
import { tableHandler } from '../../utils/tableHandler';
import { dataHandler } from '../../utils/dataHandler';
import { router } from '../../utils/router';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { message } from 'antd/lib/index';
import { business } from '../../utils/business';
import lodash from 'lodash';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
const { TextArea } = Input;


let case_id, flow_id, evaluate_test_record_id;

@connect(() => ({}))
@Form.create()
export default class scaleResults extends PureComponent {
  state = {
    loading: true,
    patient_case_basic_info: {},
    evaluate_test_record_result: {},
  };

  componentDidMount() {

    const { params = {} } = this.props.match;
    case_id = params.case_id;
    flow_id = params.flow_id;
    evaluate_test_record_id = params.evaluate_test_record_id;

    this.get_patient_case_basic_info();

    this.get_evaluate_test_record_result();

  }

  render() {
    const { loading, patient_case_basic_info = {}, evaluate_test_record_result={} } = this.state;

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

    const {  subject_name,picture_data,report_data,radar_data,line_data, table_data = [] } = evaluate_test_record_result||{};

    const { columns, table_source } = this.table_data_parser(table_data);

    // const comDiy = this.picture_data_com(radar_data,subject_name);
    // const comDiy = this.picture_data_com(line_data,subject_name);
    const comDiy = this.picture_data_com(picture_data,subject_name);

    // const picData = business.scale_parser(report);

    const {conclusion='',advice=''} = report_data||{};

    return (
      <PageHeaderLayout contentStyle={{ marginBottom: 72 }}>
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

          <Row gutter={16} className={styles.treatSituation}>
            <Col span={4}>
              <label className={`${styles.label} ${styles.required}`}>测评参考:</label>
            </Col>
            <Col span={20}>
                  <TextArea
                    autosize={{minRows:4,maxRows:12}}
                    placeholder='请输入'
                    defaultValue={conclusion}
                    onChange={this.onChangeOfConclusion}
                  />
            </Col>
          </Row>

          <Row gutter={16} className={styles.treatSituation}>
            <Col span={4}>
              <label className={`${styles.label}`}>建议:</label>
            </Col>
            <Col span={20}>
                  <TextArea
                    autosize={{minRows:4,maxRows:12}}
                    placeholder='请输入'
                    defaultValue={advice}
                    onChange={this.onChangeOfAdvice}
                  />
            </Col>
          </Row>

          <FooterToolbar>
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            <Button onClick={this.cancel} className={styles.cancelBtn}>取消</Button>
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  };



  onChangeOfConclusion = (event)=>{
    const { value } = event.target;
    const { evaluate_test_record_result } = this.state;
    const result = dataHandler.deepClone(evaluate_test_record_result);
    result.report_data.conclusion = value;
    this.setState({
      evaluate_test_record_result: result,
    });
  };

  onChangeOfAdvice = (event)=>{
    const { value } = event.target;
    const { evaluate_test_record_result } = this.state;
    const result = dataHandler.deepClone(evaluate_test_record_result);
    result.report_data.advice = value;
    this.setState({
      evaluate_test_record_result: result,
    });
  };


  get_evaluate_test_record_result = () => {

    // // todo del
    // const evaluate_test_record_result = {
    //   report_data:{
    //     conclusion:'1\r\n2\r\n3\r\n4\r\n5\r\n6',
    //     advice:'456',
    //   },
    //   'subject_id':1,
    //   'subject_name':'量表名称',
    //   'table_data': [['其他', -12, '交通运输', -10, '产业工人', -11], ['医学', -8, '历史', 7], ['天文学', -4], ['建筑', -11, '技术', -10, '教育', -1], ['数学', -11, '文学', 7, '新闻', 0], ['服务行业', 1, '林业', -10, '法律', 3], ['物理', -9, '生物学', -10, '电子技术', -11], ['艺术', 1, '轻工业', -11]],
    //   'picture_data': {
    //     'picture_type': 3, // 1 雷达，2折线图+点图， 3仪表盘， 4柱状图，
    //     'max_score': 100,
    //     'score':50,
    //     'x':10,
    //     'y':20,
    //     'data': [{ 'field_name': '其他', 'field_score': -12 }, {
    //       'field_name': '交通运输',
    //       'field_score': -10,
    //     }, { 'field_name': '产业工人', 'field_score': -11 }, {
    //       'field_name': '农业',
    //       'field_score': -10,
    //     }, { 'field_name': '医学', 'field_score': -8 }, { 'field_name': '历史', 'field_score': 7 }, {
    //       'field_name': '地理',
    //       'field_score': -6,
    //     }, { 'field_name': '地质', 'field_score': -5 }, {
    //       'field_name': '天文学',
    //       'field_score': -4,
    //     }, { 'field_name': '建筑', 'field_score': -11 }, {
    //       'field_name': '技术',
    //       'field_score': -10,
    //     }, { 'field_name': '教育', 'field_score': -1 }, {
    //       'field_name': '数学',
    //       'field_score': -11,
    //     }, { 'field_name': '文学', 'field_score': 7 }, { 'field_name': '新闻', 'field_score': 0 }, {
    //       'field_name': '服务行业',
    //       'field_score': 1,
    //     }, { 'field_name': '林业', 'field_score': -10 }, { 'field_name': '法律', 'field_score': 3 }, {
    //       'field_name': '物理',
    //       'field_score': -9,
    //     }, { 'field_name': '生物学', 'field_score': -10 }, {
    //       'field_name': '电子技术',
    //       'field_score': -11,
    //     }, { 'field_name': '艺术', 'field_score': 1 }, { 'field_name': '轻工业', 'field_score': -11 }],
    //   },
    //   'radar_data': {
    //     'picture_type': 1, // 1 雷达， 3仪表盘， 4柱状图，
    //     'data': [
    //       { 'field_name': '其他', 'field_score': 12 }, {
    //       'field_name': '交通运输',
    //       'field_score': 10,
    //     }, { 'field_name': '产业工人', 'field_score': 11 }, {
    //       'field_name': '农业',
    //       'field_score': 10,
    //     }, { 'field_name': '医学', 'field_score': 8 },
    //       { 'field_name': '历史', 'field_score': 7 }, {
    //       'field_name': '地理',
    //       'field_score': 6,
    //     }, { 'field_name': '地质', 'field_score': 5 }, {
    //       'field_name': '天文学',
    //       'field_score': 4,
    //     }, { 'field_name': '建筑', 'field_score': 11 }, {
    //       'field_name': '技术',
    //       'field_score': 10,
    //     }, { 'field_name': '教育', 'field_score': 1 }, {
    //       'field_name': '数学',
    //       'field_score': 11,
    //     }, { 'field_name': '文学', 'field_score': 7 },
    //       { 'field_name': '新闻', 'field_score': 0 }, {
    //       'field_name': '服务行业',
    //       'field_score': 1,
    //     }, { 'field_name': '林业', 'field_score': 10 },
    //       { 'field_name': '法律', 'field_score': 3 }, {
    //       'field_name': '物理',
    //       'field_score': 9,
    //     }, { 'field_name': '生物学', 'field_score': 10 }, {
    //       'field_name': '电子技术',
    //       'field_score': 11,
    //     }, { 'field_name': '艺术', 'field_score': 1 },
    //       { 'field_name': '轻工业', 'field_score': 11 }],
    //   },
    //   'line_data': {
    //     'picture_type': 2, // 1 雷达， 3仪表盘， 4柱状图，
    //     'x':10,
    //     'y':20,
    //     'data': [
    //       { 'field_name': '其他', 'field_score': 12 }, {
    //         'field_name': '交通运输',
    //         'field_score': 10,
    //       }, { 'field_name': '产业工人', 'field_score': 11 }, {
    //         'field_name': '农业',
    //         'field_score': 10,
    //       }, { 'field_name': '医学', 'field_score': 8 },
    //       { 'field_name': '历史', 'field_score': 7 }, {
    //         'field_name': '地理',
    //         'field_score': 6,
    //       }, ],
    //   },
    // };
    // this.setState({ evaluate_test_record_result, loading: false });
    // return;
    // // end

    request(urls.get_evaluate_test_record_result, {
      body: { flow_id, evaluate_test_record_id },
      success: evaluate_test_record_result => {
        this.setState({ evaluate_test_record_result });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
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

  cancel = () => {
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/patient-test/${case_id}`,
    });
  };

  picture_data_com = (pic_data,subject_name)=>{
    try {
      const {picture_type} = pic_data;
      if(picture_type-0===4){
        // 柱状图
        const { max_score, data } = pic_data;
        const dataTrans = data.map(v=>{
          return {
            x:v.field_name,
            y:v.field_score,
          }
        });

        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col span={24} className={styles.salesBar} style={{backgroundColor:'#fff'}}>
                <BarDiy2
                  height={280}
                  color={['y', (y) => {
                    return y<0?'RGBA(255, 0, 0, 0.8)':'#1890FF';
                  }]}
                  // title={evaluate_form_name}
                  data={dataTrans}
                />
              </Col>
            </Row>
          </Fragment>

        )
      }
      else if(picture_type-0===3){
        // 仪表盘
        const {score,max_score} = pic_data;
        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col span={24} offset={0}>
                <GaugeDiy
                  score={score}
                  max_score={max_score}
                  // forceFit={false}
                />
              </Col>
            </Row>
          </Fragment>


        )
      }
      else if(picture_type-0===1){
      //  雷达图
        const {data} = pic_data;
        const data_ok = data.map((value,index)=>{
          return {
            name:'',
            value:value.field_score,
            label:value.field_name,
          }
        });
        return (
          <Fragment>
            <Row>
              <div className={styles.subjectName}>{subject_name}</div>
            </Row>
            <Row>
              <Col span={24} offset={0}>
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

        )
      }
      else if(picture_type-0===2){
        // 折线图 + 点图
        const {x,y,data} = pic_data;
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

              <Col span={16}>
                <BrokenLineDiy data={data} height={height} />
              </Col>



            </Row>
          </Fragment>


        )
      }
    }catch (e) {
      return null
    }
  };





  handleSubmit = () => {

    try {
      const { dispatch } = this.props;
      const { evaluate_test_record_result } = this.state;
      const {report_data} = evaluate_test_record_result||{};
      const {conclusion,advice} = report_data||{};

      if(conclusion){
        request(urls.revise_evaluate_test_record_result, {
          body: { flow_id, evaluate_test_record_id, ...report_data },
          success: data => {
            router.jump({
              dispatch,
              pathname: `/patient/patient-test/${case_id}`,
            });
          },
          fail: errmsg => {
            message.error(errmsg || '提交失败');
          },
          complete: () => {
          },
        });
      }else{
        message.error('请输入测评参考');
      }


    }catch (e) {
      message.error('操作失败');
    }

  };


  table_data_parser = (data) => {

    try {
      const row0 = data[0];
      const keys = lodash.range(row0.length).map(v => v + '');

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
}
