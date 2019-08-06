import React, { PureComponent, Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Input,
  Collapse,
  Modal,
  Icon,
  Checkbox,
  Radio,
  Divider,
} from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { images } from '../../utils/images';
import styles from './TreatPlan.less';
import { tableHandler } from '../../utils/tableHandler';
import { dataHandler } from '../../utils/dataHandler';
import { router } from '../../utils/router';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { message } from 'antd/lib/index';
import lodash from 'lodash';
import ModalDiy from 'components/ModalDiy';

const { Description } = DescriptionList;
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const FormItem = Form.Item;

const { Option } = Select;

const TestResult = ({ data }) => {
  const Empty = (<p>无</p>);
  if (!data) {
    return Empty;
  } else {
    const {chief='',device_name_list=[],subject_name_list=[],disease_name} = data||{};
    return (
      <Fragment>
        {
          chief?(
            <div className={styles.testResult}>
              <div className={styles.title}>主诉</div>
              <p>{chief || '无'}</p>
            </div>
          ):null

        }

        {/*{*/}
        {/*<div className={styles.testResult}>*/}
        {/*<div className={styles.title}>首访</div>*/}
        {/*<p>{'无'}</p>*/}
        {/*</div>*/}
        {/*}*/}

        {
          device_name_list&&device_name_list.length ? (
            <div className={styles.testResult}>
              <div className={styles.title} style={{ marginBottom: 0 }}>仪器检测</div>
              <div style={{ marginTop: 10,fontSize: 14}}>{device_name_list.join('、')}</div>
            </div>
          ) : null
        }

        {
          subject_name_list&&subject_name_list.length ? (
            <div className={styles.testResult}>
              <div className={styles.title} style={{ marginBottom: 0 }}>量表检测</div>
              <div style={{ marginTop: 10,fontSize: 14}}>{subject_name_list.join('、')}</div>
            </div>
          ) : null
        }
      </Fragment>
    );
  }
};

class Action1 extends Component {
  render() {
    const { click } = this.props;
    return (
      <Button className={styles.headButton} onClick={click}>查看报告</Button>
    );
  }
}

let case_id;

@connect(() => ({}))
@Form.create()
export default class TreatPlan extends PureComponent {

  state = {
    diseaseLevelVisible: false,
    diseaseLevelIndex: 0,
    diseaseLevelValue: '轻度',
    diseaseLevelType:1, // 1 症候，2 次要症候
    impression_desc: '',
    patient_case_basic_info: {},
    patient_case_simple_test_report: {},
    impression_list: [
      // {
      //   impression_id:1,
      //   impression_name:'',
      //   value:'', // 程度等级
      //   checked:false, // 是否选中
      // },
    ],
    secondary_impression_list: [],
    dev_trace:'',
    psy_factor:'',
    medicine_options: [], //接口返回的用药，下拉框

    //药物治疗
    medicines: [
      // {
      //   medicine_id: 1,
      //   medicine_name: '',
      // medicine_use_type:1, //1 ml，2 片
      //   use_amount: 10,
      //   use_rate: 1,
      //   use_days: 10,
      // },
    ],
    //物理治疗、心理治疗
    treatments: [
      // {item_id:1,item_count:10},
    ],

    patient_case_diagnosis_report:{},

    mainLevel1Arr:[],
    mainLevel1Id:'',

    mainLevel2Arr:[],
    mainLevel2Id:'',

    mainLevel3Arr:[],
    mainLevel3Id:'',

    assistedLevel1Arr:[],
    assistedLevel1Id:'',

    assistedLevel2Arr:[],
    assistedLevel2Id:'',

    symptom_diagnosis:'',
    pre_diagnosis:'',
    medical_analysis:'',

  };

  // 组件加载完成
  componentDidMount() {
    const { match: { params = {} } = {} } = this.props;
    case_id = params.case_id;
    this.get_patient_case_basic_info();
    this.get_patient_case_simple_info();

    this.get_medicine_list();
    this.get_treatment_item_list();

    this.main_level_init();

    this.assisted_level_init();

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
      },
    });
  };

  get_medicine_list = () => {
    request(urls.get_medicine_list, {
      body: { case_id },
      success: medicine_options => {
        this.setState({ medicine_options });

        this.setState({medicines:[medicine_options[0]]});
      },
      fail: errmsg => {
        message.error(errmsg||'获取药物列表失败');
      },
      complete: () => {
      },
    });
  };

  get_treatment_item_list = () => {
    request(urls.get_treatment_item_list, {
      body: { case_id },
      success: treatments => {
        this.setState({ treatments });
      },
      fail: errmsg => {
        message.error(errmsg||'获取治疗项目类型列表失败');
      },
      complete: () => {
      },
    });
  };


  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      diseaseLevelValue: value,
    });
  };

  scanReport = () => {
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/synthesis/${case_id}`,
      newTab:true,
    });
  };

  testCheck = (e,id) => {
    const {treatments} = this.state;
    let t = dataHandler.deepClone(treatments);
    const tTarget = t.find(v=>v.item_id-0===id-0);
    tTarget.checked = !tTarget.checked;
    this.setState({
      treatments: t,
    });
  };

  renderCureHint = () => {
    const { treatments } = this.state;
    const t = treatments.filter(v => v.checked && v.item_count - 0 > 0);
    if (t && t.length) {
      const flat = [];
      t.forEach(v => {
        const { item_count } = v;
        flat.push(lodash.range(item_count).map(() => v));
      });
      const zip = lodash.zip(...flat);
      // const group = lodash.groupBy(zip,lodash.isEqual);
      const group = this.cubeGroup(zip);
      return (
        <div className={styles.cureHintWrap}>
          <div className={styles.title}>治疗提示</div>
          {
            group.map(g=> {
              const { count, value } = g;
              const valueExcludeNull = lodash.compact(value);
              return (
                <div className={styles.content}>
                  <div>{valueExcludeNull.map(v=>v.item_name).join('、')}：共{count}次，每次{valueExcludeNull.map(v=>v.item_price).reduce((a,b)=>a+b,0)}</div>
                </div>
              )
            })
          }
        </div>
      )


    } else {
      return null;
    }
  };

  cubeGroup = (ad) => {

    const ret = [];

    b(ad);

    function b(data) {
      const filter = data.filter(v=>lodash.isEqual(v,data[0]));
      ret.push({count:filter.length,value:filter[0]});
      const rest = lodash.difference(data, filter);
      if(rest&&rest.length){
        b(rest);
      }
    }

    return ret;

  };

  // 取消弹框或者继续
  handleOk = () => {
    const { diseaseLevelValue, diseaseLevelIndex, impression_list,diseaseLevelType,secondary_impression_list } = this.state;
    const list = diseaseLevelType===1?impression_list:diseaseLevelType===2?secondary_impression_list:[];
    const imList = dataHandler.deepClone(list);
    const checkedItem = imList.find(v=>v.checked);
    if(diseaseLevelType===1&&checkedItem){
      checkedItem.checked=false;
    } // 互斥
    imList[diseaseLevelIndex].checked = true;
    imList[diseaseLevelIndex].value = diseaseLevelValue;
    if(diseaseLevelType===1){
      this.setState({ impression_list: imList });
    }else if(diseaseLevelType===2){
      this.setState({ secondary_impression_list: imList });
    }
    this.setState({
      diseaseLevelVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      diseaseLevelVisible: false,
    });
  };


  // 选择疾病程度弹框
  selectDegree = (e, index,type) => {
    const { checked } = e.target;
    if (checked) {
      this.setState({
        diseaseLevelVisible: true,
        diseaseLevelIndex: index,
        diseaseLevelType:type,
      });
    } else {
      let imList;
      if(type===1){
        const { impression_list } = this.state;
        imList = dataHandler.deepClone(impression_list);
        imList[index].checked = false;
        this.setState({ impression_list: imList });
      }else if(type===2){
        const { secondary_impression_list } = this.state;
        imList = dataHandler.deepClone(secondary_impression_list);
        imList[index].checked = false;
        this.setState({ secondary_impression_list: imList });
      }
    }
  };

  submit = () => {
    const {dispatch} = this.props;
    const { treatments,chief} = this.state;

    const {
      mainLevel1Id:level1_diagnosis_id,mainLevel2Id:level2_diagnosis_id,mainLevel3Id:level3_diagnosis_id,
      assistedLevel1Id:level1_assist_diagnosis_id,assistedLevel2Id:level2_assist_diagnosis_id,
      symptom_diagnosis,pre_diagnosis,medical_analysis} = this.state;


    let {medicines} = this.state;


    // 用药建议，JSON数组，无时传[],格式:[{'medicine_id':1,'use_amount':10(每次用量),'use_rate':1(每日频率),'use_days':10(使用天数)}]
    try{
      const m = lodash.uniqBy(medicines, 'medicine_id');
      if(m.length>0 && m.length<medicines.length){
        return message.error('一种药物只能选择一次');
      }
      medicines = medicines.filter(v=>{
        return v.use_amount-0>0&&v.use_days-0>0&&v.use_rate-0>0
      })
      // for(let k in medicines){
      //   const v = medicines[k];
      //   if(!(v.use_amount-0>0)){
      //     return message.error('请输入药物用量');
      //   }
      //   if(!(v.use_days-0>0)){
      //     return message.error('请输入药物使用天数');
      //   }
      //   if(!(v.use_rate-0>0)){
      //     return message.error('请输入药物使用频率');
      //   }
      // }
    }catch (e) {

    }
    const t = treatments.filter(v=>v.checked&&v.item_count-0>0);

    const body = { case_id,
      treatments:JSON.stringify(t),
      medicines:JSON.stringify(medicines),
      chief,
      level1_diagnosis_id,
      level2_diagnosis_id,
      symptom_diagnosis,pre_diagnosis,medical_analysis};

    if(!chief){
      return message.error('请输入复诊主诉');
    }
    if(!level1_diagnosis_id||level1_diagnosis_id===-1){
      return message.error('缺少主诊断一级参数')
    }
    if(!level2_diagnosis_id||level2_diagnosis_id===-1){
      return message.error('缺少主诊断二级参数')
    }
    if(level3_diagnosis_id&&level3_diagnosis_id!==-1){
      body.level3_diagnosis_id = level3_diagnosis_id;
    }
    if(level1_assist_diagnosis_id&&level1_assist_diagnosis_id!==-1){
      body.level1_assist_diagnosis_id = level1_assist_diagnosis_id;
    }
    if(level2_assist_diagnosis_id&&level2_assist_diagnosis_id!==-1){
      body.level2_assist_diagnosis_id = level2_assist_diagnosis_id;
    }

    request(urls.create_new_patient_case_report_by_doctor, {
      body,
      success: data => {
        router.jump({
          operator:'replace',
          dispatch,
          pathname:`/patient/patient-diagnosis-success/${data}`,
        })
      },
      fail: errmsg => {
        message.error(errmsg||'提交失败');
      },
      complete: () => {
      },
    });
  };

  addTreatList = () => {
    const {medicines=[],medicine_options=[]} = this.state;
    const m = dataHandler.deepClone(medicines);
    m.push({
      medicine_id:medicine_options[0].medicine_id,
      medicine_name:medicine_options[0].medicine_name,
      medicine_use_type:medicine_options[0].medicine_use_type,
    });
    this.setState({
      medicines:m,
    });
  };

  delTreatList = (index) => {
    const {medicines=[]} = this.state;
    let m = dataHandler.deepClone(medicines);
    m.splice(index,1);
    this.setState({
      medicines:m,
    });
  };
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  handleNumberChange = (number,id) => {
    const n = number-0;
    const {treatments=[]} = this.state;
    const t = dataHandler.deepClone(treatments);
    const tTarget = t.find(v=>v.item_id-0===id-0);
    tTarget.item_count = n>0?n:0;
    this.setState({treatments:t});
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

  list_level1_diagnosis = (callback) => {

    request(urls.list_level1_diagnosis,{
      body:{},
      success:mainLevel1Arr=>{
        try{
          this.setState({mainLevel1Arr,mainLevel1Id:mainLevel1Arr[0].id},()=>{
            callback && callback(mainLevel1Arr[0].id);
          });
        }catch (e) {
        }

      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
      },
    });

  };


  list_level2_diagnosis = (level1_diagnosis_id,callback) => {

    request(urls.list_level2_diagnosis,{
      body:{level1_diagnosis_id},
      success:mainLevel2Arr=>{
        try{
          this.setState({mainLevel2Arr,mainLevel2Id:mainLevel2Arr[0].id},()=>{
            callback && callback(mainLevel2Arr[0].id);
          });
        }catch (e) {

        }

      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{

      },
    });

  };

  list_level3_diagnosis = (level1_diagnosis_id,level2_diagnosis_id,callback) => {
    request(urls.admin_config_diagnosis_level3_list,{
      body:{level1_diagnosis_id,level2_diagnosis_id,pageSize:999999},
      success:data=>{
        let mainLevel3Arr = [{id:-1,name:'无'}];
        try {
          const {list=[]} = data||{};
          mainLevel3Arr = [{id:-1,name:'无'}].concat(list||[]);
        }catch (e) {
          mainLevel3Arr = [{id:-1,name:'无'}];
        }
        this.setState({mainLevel3Arr,mainLevel3Id:mainLevel3Arr[0].id},()=>{
          // callback && callback(level1_diagnosis_id,mainLevel3Arr[0].id);

        });
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{

      },
    });

  };

  onChangeOfArea = (event,type)=>{
    const {value} = event.target;
    switch (type) {
      case 1:
        this.setState({symptom_diagnosis:value});
        break;
      case 2:
        this.setState({pre_diagnosis:value});
        break;
      case 3:
        this.setState({medical_analysis:value});
        break;
      default:
        break;
    }

  };

  main_level_init = ()=>{
    this.list_level1_diagnosis((level1_diagnosis_id)=>{
      this.list_level2_diagnosis(level1_diagnosis_id,(level2_diagnosis_id)=>{
        this.list_level3_diagnosis(level1_diagnosis_id,level2_diagnosis_id);
      })
    })
  };

  assisted_level_init = ()=>{
    this.list_level1_diagnosis_of_assist((level1_diagnosis_id)=>{
      this.list_level2_diagnosis_of_assist(level1_diagnosis_id)
    })
  };

  list_level1_diagnosis_of_assist = (callback) => {

    request(urls.list_level1_diagnosis_of_assist,{
      body:{},
      success:data=>{
        try{
          const assistedLevel1Arr = [{id:-1,name:'无'}].concat(data||[]);
          this.setState({assistedLevel1Arr,assistedLevel1Id:assistedLevel1Arr[0].id},()=>{
            callback && callback(assistedLevel1Arr[0].id);
          });
        }catch (e) {
        }
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
      },
    });

  };

  list_level2_diagnosis_of_assist = (level1_diagnosis_id) => {

    request(urls.admin_config_assist_diagnosis_level2_list,{
      body:{level1_diagnosis_id,pageSize:999999},
      success:data=>{
        try{
          const {list=[]} = data||{};
          const assistedLevel2Arr = [{id:-1,name:'无'}].concat(list||[]);
          this.setState({assistedLevel2Arr,assistedLevel2Id:assistedLevel2Arr[0].id});
        }catch (e) {
        }
      },
      fail:errmsg=>{
        message.error(errmsg || '获取失败');
      },
      complete:()=>{
      },
    });

  };




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

  onChangeOfDiseaseDescription = (event) => {
    const { value } = event.target;
    this.setState({
      impression_desc: value,
    });
  };

  onChangeOfDevTrace = (event) => {
    const { value } = event.target;
    this.setState({
      dev_trace: value,
    });
  };
  onChangeOfPsyFactor = (event) => {
    const { value } = event.target;
    this.setState({
      psy_factor : value,
    });
  };

  onChangeOfMedicines = (value,index,type)=>{
    const {medicines=[],medicine_options=[]} = this.state;
    const m = dataHandler.deepClone(medicines);
    const v = value-0>0?value-0:0;
    if(type===99){
      const mTarget = medicine_options.find(value=>value.medicine_id-0===v);
      m[index].medicine_id = mTarget.medicine_id;
      m[index].medicine_name = mTarget.medicine_name;
      m[index].medicine_use_type = mTarget.medicine_use_type;
    }else{
      const keys = ['use_amount', 'use_days', 'use_rate'];
      m[index][keys[type]] = v;
    }
    this.setState({medicines:m});
  };

  onChangeOfChief=(event)=>{
    const {value} = event.target;
    this.setState({
      chief:value,
    })
  };

  onChange_mainLevel1 = (value)=>{
    const level1_diagnosis_id = value;
    this.setState({mainLevel1Id:level1_diagnosis_id});
    this.list_level2_diagnosis(level1_diagnosis_id,(level2_diagnosis_id)=>{
      this.list_level3_diagnosis(level1_diagnosis_id,level2_diagnosis_id);
    })
  };

  onChange_mainLevel2 = (value)=>{
    const level2_diagnosis_id = value;
    this.setState({mainLevel2Id:level2_diagnosis_id});
    const {mainLevel1Id:level1_diagnosis_id} = this.state;
    this.list_level3_diagnosis(level1_diagnosis_id,level2_diagnosis_id);
  };

  onChange_mainLevel3 = (value)=>{
    this.setState({mainLevel3Id:value});
  };

  onChange_assistedLevel1 = (value)=>{
    const level1_diagnosis_id = value;
    this.setState({assistedLevel1Id:level1_diagnosis_id});
    if(level1_diagnosis_id===-1){
      this.setState({assistedLevel2Id:-1,assistedLevel2Arr:[{id:-1,name:'无'}]});
    }else{
      this.list_level2_diagnosis_of_assist(level1_diagnosis_id)
    }

  };

  onChange_assistedLevel2 = (value)=>{
    this.setState({assistedLevel2Id:value});
  };


  render() {
    const {
      patient_case_basic_info = {},
      medicine_options = [],
      medicines = [],
      treatments=[],
      patient_case_simple_test_report = {},
      diseaseLevelValue,
      patient_case_diagnosis_report={},
      chief, //复诊主诉
      mainLevel1Arr=[],
      mainLevel1Id='',
      mainLevel2Arr=[],
      mainLevel2Id='',
      mainLevel3Arr=[],
      mainLevel3Id='',
      assistedLevel1Arr=[],
      assistedLevel1Id=[],
      assistedLevel2Arr=[],
      assistedLevel2Id=[],
    } = this.state;

    const physical = treatments.filter(v=>v.item_type-0===1);
    const psychology = treatments.filter(v=>v.item_type-0===2);

    return (
      <PageHeaderLayout
        contentStyle={{marginBottom:72}}
        title={patient_case_basic_info.case_no ? `编号：${patient_case_basic_info.case_no}` : ''}
        // logo={
        //   <img alt="" src={images.treatTitle}/>
        // }
        content={this.renderPatientCaseBasicInfo(patient_case_basic_info)}
        action={<Action1 click={this.scanReport} />}
      >
        <Card className={styles.mainPage}>
          <Collapse defaultActiveKey={['心身测评结果','复诊主诉','诊断结论',  '治疗方案']}>
            <Panel header="心身测评结果" key="心身测评结果">
              <Row gutter={{ xs: 4, sm: 4, md: 8, lg: 16 }}>
                <Col span={24} className={styles.mainCard}>
                  <Card>
                    <TestResult data={patient_case_simple_test_report} value={patient_case_diagnosis_report} />
                  </Card>
                </Col>
              </Row>
            </Panel>

            <Panel header="复诊主诉" key="复诊主诉">
              <Row gutter={{ xs: 4, sm: 4, md: 8, lg: 16 }}>
                <Col span={24}>
                    <TextArea
                      autosize={{minRows:4,maxRows:12}}
                      placeholder='请输入复诊主诉'
                      defaultValue={chief}
                      onChange={this.onChangeOfChief}
                    />
                </Col>
              </Row>
            </Panel>

            <Panel header="诊断结论" key="诊断结论">

              <div className={styles.rowDia}>

                <label className={`${styles.required} ${styles.title}`}>诊断选择：</label>

                <Select onChange={(value)=>this.onChange_mainLevel1(value)}
                        value={mainLevel1Id}
                        style={{ width: 220 }}>
                  {
                    mainLevel1Arr&&mainLevel1Arr.length?(

                      mainLevel1Arr.map(v=>{
                        return <Option key={`mainLevel1Arr${v.id}`}  value={v.id}>{v.name}</Option>
                      })

                    ):null
                  }

                </Select>

                <label className={styles.sep}>-</label>

                <Select onChange={(value)=>this.onChange_mainLevel2(value)}
                        value={mainLevel2Id}
                        style={{ width: 220 }}>
                  {
                    mainLevel2Arr&&mainLevel2Arr.length?(

                      mainLevel2Arr.map(v=>{
                        return <Option key={`mainLevel2Arr${v.id}`}  value={v.id}>{v.name}</Option>
                      })

                    ):null
                  }

                </Select>


                <label className={styles.sep}>-</label>

                <Select onChange={(value)=>this.onChange_mainLevel3(value)}
                        value={mainLevel3Id}
                        style={{ width: 220 }}>
                  {
                    mainLevel3Arr&&mainLevel3Arr.length?(

                      mainLevel3Arr.map(v=>{
                        return <Option key={`mainLevel3Arr${v.id}`}  value={v.id}>{v.name}</Option>
                      })

                    ):null
                  }
                </Select>




              </div>

              <div className={styles.rowDia} style={{marginTop:20}}>

                <label className={`${styles.title}`}>其它诊断(可选)：</label>

                <Select onChange={(value)=>this.onChange_assistedLevel1(value)}
                        value={assistedLevel1Id}
                        style={{ width: 220 }}>
                  {
                    assistedLevel1Arr&&assistedLevel1Arr.length?(

                      assistedLevel1Arr.map(v=>{
                        return <Option key={`assistedLevel1Arr${v.id}`}  value={v.id}>{v.name}</Option>
                      })

                    ):null
                  }
                </Select>

                <label className={styles.sep}>-</label>

                <Select onChange={(value)=>this.onChange_assistedLevel2(value)}
                        value={assistedLevel2Id}
                        style={{ width: 220 }}>
                  {
                    assistedLevel2Arr&&assistedLevel2Arr.length?(

                      assistedLevel2Arr.map(v=>{
                        return <Option key={`assistedLevel2Arr${v.id}`}  value={v.id}>{v.name}</Option>
                      })

                    ):null
                  }
                </Select>

              </div>

              <Divider/>


              <div className={styles.rowDia} style={{marginTop:20,alignItems:'flex-start'}}>

                <label className={`${styles.title}`} style={{width:137}}>症状学诊断：</label>

                <TextArea autosize={{minRows:4,maxRows:12}} placeholder='选填' onChange={(event)=>{this.onChangeOfArea(event,1)}} />

              </div>

              <div className={styles.rowDia} style={{marginTop:20,alignItems:'flex-start'}}>

                <label className={`${styles.title}`} style={{width:137}}>初步诊断：</label>

                <TextArea autosize={{minRows:4,maxRows:12}} placeholder='选填' onChange={(event)=>{this.onChangeOfArea(event,2)}} />

              </div>

              <div className={styles.rowDia} style={{marginTop:20,alignItems:'flex-start'}}>

                <label className={`${styles.title}`} style={{width:137,whiteSpace:'wrap'}}>整体医学分析（包括相关心身因素及应激）：</label>

                <TextArea autosize={{minRows:4,maxRows:12}} placeholder='选填' onChange={(event)=>{this.onChangeOfArea(event,3)}} />

              </div>


            </Panel>

            <Panel header="治疗方案" key="治疗方案">


              <div className={styles.medicine} style={{marginTop:0}}>
                <h3>药物治疗</h3>

                {
                  medicines.map((item, index) => {
                    const unit = item.medicine_use_type-0===1?'ml':item.medicine_use_type-0===2?'片':'未知';
                    return (
                      <div className={styles.rowFlex} key={`${item.medicine_id}${index}`}>
                        <div className={styles.colFlex}>
                          <label>用药选择：</label>
                          <Select key={`Select${item.medicine_id}${index}`} onChange={(value)=>this.onChangeOfMedicines(value,index,99)} defaultValue={item.medicine_id} style={{ width: 200 }}>
                            {
                              medicine_options.map((value, i) => {
                                return (
                                  <Option key={`Option${value.medicine_id}${index}${i}`} value={value.medicine_id}>{value.medicine_name}</Option>
                                );
                              })
                            }
                          </Select>
                        </div>
                        <div className={styles.colFlex1}>
                          <label>用量：</label>
                          <InputNumber min={1} style={{ width: 60 }} defaultValue={item.use_amount-0||''} onChange={(value)=>this.onChangeOfMedicines(value,index,0)}/>
                          <label htmlFor=""> {unit}</label>
                        </div>
                        <div className={styles.colFlex1}>
                          <label>天数：</label>
                          <InputNumber min={1} style={{ width: 60 }} defaultValue={item.use_days-0||''} onChange={(value)=>this.onChangeOfMedicines(value,index,1)} />
                        </div>
                        <div className={styles.colFlex1}>
                          <label>用法：</label>
                          <InputNumber min={1} style={{ width: 60 }} defaultValue={item.use_rate-0||''} onChange={(value)=>this.onChangeOfMedicines(value,index,2)} />
                          <label htmlFor=""> 次/天</label>
                        </div>
                        {medicines.length !== 1 ?
                          (
                            <div className={styles.colFlexIcon} onClick={() => this.delTreatList(index)}>
                              <Icon type="minus-circle-o"
                                    style={{ fontSize: '20px', lineHeight: '35px', color: '#4a7dff' }}/>
                            </div>
                          )
                          : ''}
                        {medicines.length - 1 === index ?
                          (
                            <div className={styles.colFlexIcon} onClick={() => this.addTreatList()}>
                              <Icon type="plus-circle"
                                    style={{ fontSize: '20px', lineHeight: '35px', color: '#4a7dff' }}/>
                            </div>
                          )
                          : ''}
                      </div>
                    )
                  })
                }
              </div>

              {
                physical&&physical.length?(
                  <div className={styles.medicine}>
                    <h3>物理治疗</h3>
                    <Row gutter={24}>
                      {
                        physical.map((value,i)=>{
                          return (
                            <Col span={7} className={styles.linkAge} key={value.item_id}>
                              <Checkbox checked={!!value.checked} onChange={(event)=>this.testCheck(event,value.item_id)}>{value.item_name}</Checkbox>
                              {
                                value.checked?(
                                  <Fragment>
                                    <InputNumber min={1} onChange={(number)=>this.handleNumberChange(number,value.item_id)} defaultValue={value.item_count||''} />
                                    <span className={styles.timeSpan}>次</span>
                                  </Fragment>
                                ):null
                              }
                            </Col>
                          )
                        })
                      }
                    </Row>
                  </div>
                ):null
              }
              {
                psychology&&psychology.length?(
                  <div className={styles.medicine}>
                    <h3>心理治疗</h3>
                    <Row gutter={24}>
                      {
                        psychology.map((value,i)=>{
                          return (
                            <Col span={7} className={styles.linkAge} key={value.item_id}>
                              <Checkbox checked={!!value.checked} onChange={(event)=>this.testCheck(event,value.item_id)}>{value.item_name}</Checkbox>
                              {
                                value.checked?(
                                  <Fragment>
                                    <InputNumber min={1} onChange={(number)=>this.handleNumberChange(number,value.item_id)} defaultValue={value.item_count||''} />
                                    <span className={styles.timeSpan}>次</span>
                                  </Fragment>
                                ):null
                              }
                            </Col>
                          )
                        })
                      }
                    </Row>
                  </div>
                ):null
              }

              {this.renderCureHint()}

            </Panel>
          </Collapse>

          {/*<div className={styles.cardButtomBtn}>*/}
            {/*<Button>复制治疗信息</Button>*/}
          {/*</div>*/}

        </Card>
        <ModalDiy
          className={styles.chooseDegree}
          title={
            <Fragment>
              <Icon type="profile" style={{color:'#98beff',marginRight:5}} />选择疾病程度
            </Fragment>
          }
          visible={this.state.diseaseLevelVisible}
          closable={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>
              取消
            </Button>,

            <Button key="submit" type="primary" onClick={this.handleOk}>
              确认
            </Button>,
          ]}
        >
          <RadioGroup onChange={this.onChange} value={diseaseLevelValue}>
            <Radio value='1'>轻度</Radio>
            <Radio value='2'>中度</Radio>
            <Radio value='3'>重度</Radio>
            <Radio value='4'>严重</Radio>
          </RadioGroup>
        </ModalDiy>

        <FooterToolbar>
          <Button type='primary' onClick={() => this.submit()}>提交</Button>
          <Button onClick={() => tableHandler.back(this)} className={styles.cancelBtn}>取消</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
