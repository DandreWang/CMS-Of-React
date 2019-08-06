import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Select,
  Button,
  Collapse,
  Modal,
  DatePicker,
  Checkbox,
  Input,
  Radio,
  message,
  InputNumber, AutoComplete,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PatientOwnFile.less';
import { router } from '../../utils/router';
import {tableHandler} from "../../utils/tableHandler";
import {storageKeys} from '../../utils/storageKeys';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { validateValues } from '../../utils/validate';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 10 },
  },
};

let case_id = null;

@connect(() => ({

}))
@Form.create()
export default class PatientOwnFile extends PureComponent {
  state = {
    diseaseList:[],
    edu_level_object:{},
    marriage_type_object:{},
    raise_type_object:{},
    doctors:[],
    departments:[],
    loading:true,
    jobs:[],
  };

  // 组件加载完成
  componentDidMount() {

    this.common_status_detail('分类-文化水平');
    this.common_status_detail('分类-婚姻类型');
    this.common_status_detail('分类-养育方式');

    this.get_job_list();

    try {
      const { params = {} } = this.props.match;
      case_id = params.case_id;
    }catch (e) {
      case_id = null;
    }

    if(case_id){
      this.get_data();
    }else{

      this.props.dispatch({
        type: 'patientOwnFile/get_disease_list_by_card',
        payload:{
          card_no:localStorage.getItem(storageKeys.card_no),
        },
        success:diseaseList=>{
          this.setState({
            diseaseList,
          })
        },
        fail:errmsg=>{
          message.error(errmsg||'疾病流程获取失败');
        },
      });

      this.get_departments();

    }


  }

  onSelectDepartment = (value)=>{
    this.setState({patient_from_department:value});
  };

  onSearchDepartment = (value)=>{
    this.setState({patient_from_department:value});
  };


  onChangeDepartment = (value)=>{

    const {departments} = this.state;

    this.setState({patient_from_department:value});

    if(!value){
      this.get_doctors_of_department(-1);
    }else{
      try{
        const id = departments.find(v=>v.name===value).id;
        this.get_doctors_of_department(id);
      }catch (e) {

      }
    }

  };

  onInputDoctor = (value)=>{
    this.setState({patient_from_doctor:value});
  };

  onInputJob = (value)=>{
    this.setState({patient_job_id_name:value});
  };

  get_data = () => {

    this.setState({ loading: true });
    request(urls.get_patient_case_basic_info, {
      body: { case_id },
      success: patient_info => {
        const {
          case_disease_name,
          case_disease_id,
          case_id,
        case_no,
        patient_age,
        patient_birthday,
        patient_child_count,
        patient_child_index,
        patient_children_desc,
        patient_edu_level,
        patient_from_department,
        patient_from_doctor,
        patient_hand,
        patient_height,
        patient_home_index,
        patient_id,
        patient_job_id,
        patient_job_id_name,
        patient_marriage_type,
        patient_mobile,
        patient_name,
        patient_native_place,
        patient_parents_desc,
        patient_raise_type,
        patient_sex,
        patient_weight} = patient_info;



        this.setState({
          case_no,
          patient_name,
          birthday:patient_birthday,
          sex:patient_sex?patient_sex+'':'',
          height:patient_height,
          weight:patient_weight,
          hand:patient_hand?patient_hand+'':'',
          native_place:patient_native_place,
          edu_level:patient_edu_level?patient_edu_level+'':'',
          child_index:patient_child_index,
          child_count:patient_child_count,
          patient_from_department,
          patient_from_doctor,
          marriage_type:patient_marriage_type?patient_marriage_type+'':'',
          children_desc:patient_children_desc,
          parents_desc:patient_parents_desc,
          mobile:patient_mobile,
          raise_type:patient_raise_type?patient_raise_type+'':'',
          patient_job_id_name,
          disease_id:case_disease_id,
          case_disease_name,
        });

        this.get_departments_init(patient_from_department);

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };


  get_job_list = () => {
    this.setState({loading:true});
    request(urls.admin_config_job_listAll, {
      body: {},
      success: jobs => {

        this.setState({jobs});

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };

  get_departments = () => {
    this.setState({loading:true});
    request(urls.admin_config_doctor_list_departments, {
      body: {},
      success: departments => {

        try {
          this.setState({departments});

          this.get_doctors_of_department(departments[0].id);

        }catch (e) {
          message.error('获取失败');
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };

  get_doctors_of_department = (config_department_id)=>{
    request(urls.admin_config_doctor_list_department_doctors, {
      body: {config_department_id},
      success: doctors => {
        this.setState({doctors,patient_from_doctor:''});
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };

  get_departments_init = (department_name) => {
    this.setState({loading:true});
    request(urls.admin_config_doctor_list_departments, {
      body: {},
      success: departments => {

        try {
          this.setState({departments});

          const department_id = departments.find(v=>v.name===department_name).id;

          this.get_doctors_of_department_init(department_id);

        }catch (e) {
          message.error('获取失败');
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };

  get_doctors_of_department_init = (config_department_id)=>{
    request(urls.admin_config_doctor_list_department_doctors, {
      body: {config_department_id},
      success: doctors => {
        this.setState({doctors});
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
      },
    });
  };


  common_status_detail = (name) => {
    request(urls.common_status_detail, {
      body: {name},
      method:'get',
      success: data => {
        if(name==='分类-文化水平'){
          this.setState({ edu_level_object:data });
        }else if(name==='分类-婚姻类型'){
          this.setState({ marriage_type_object:data });
        }else if(name==='分类-养育方式'){
          this.setState({ raise_type_object:data });
        }

      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {

      },
    });
  };




  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    const {doctors=[],patient_from_doctor='',disease_id,departments=[],patient_job_id_name='',jobs=[],patient_from_department=''} = this.state;
    let config_doctor_id;
    if(!patient_from_doctor){
      return message.error('请选择医生');
    }
    if(!patient_job_id_name){
      return message.error('请选择职业');
    }

    if(!patient_from_department){
      return message.error('请选择科室');
    }
    try {
      config_doctor_id = doctors.find(v=>v.name===patient_from_doctor).id;
    }catch (event) {
      return message.error('医生不存在');
    }

    try {
       departments.find(v=>v.name===patient_from_department).id;
    }catch (event) {
      return message.error('科室不存在');
    }

    // 已与毅辉确认，不需要科室id


    let job_id;
    try {
      job_id = jobs.find(v=>v.name===patient_job_id_name).id;
    }catch (event) {
      return message.error('职业不存在');
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {child_index,child_count} = values;
        if(child_index>child_count){
          return message.error('家庭排行前者不可大于后者');
        }

        const payload = {
          ...values,
          birthday:values.birthday.format('YYYY-MM-DD'),
          card_no:localStorage.getItem(storageKeys.card_no),
          config_doctor_id,
          job_id,
        };
        if(case_id){
          payload.disease_id = disease_id;
          this.setState({loading:true});
          request(urls.update_patient_case_basic_info, {
            body: {...payload,case_id},
            success: () => {
              message.success('修改成功');
              setTimeout(()=>{
                window.history.go(-1);
              },1000);

            },
            fail: errmsg => {
              message.error(errmsg || '操作失败');
            },
            complete: () => {
              this.setState({loading:false});
            },
          });
        }else{
          dispatch({
            type: 'patientOwnFile/save_new_patient',
            payload,
            success:data=>{
              const {case_id,case_no} = data;
              router.jump({
                dispatch,
                pathname:`/patient/new-success/${case_id}/${case_no}`,
              })
            },
            fail:errmsg=>{
              message.error(errmsg||'建档失败');
            },
          });
        }

      }
    });
  };

  render() {
    const {  form } = this.props;
    const {
      diseaseList=[],
      edu_level_object=[],
      loading,
      departments=[],
      doctors=[],
      jobs=[],
      patient_job_id_name='',
      patient_name='',
      birthday,
      sex,
      height,
      weight,
      hand,
      native_place,
      edu_level,
      child_index,
      child_count,
      marriage_type,
      raise_type,
      children_desc,
      parents_desc,
      mobile,
      disease_id,
      case_disease_name,
      patient_from_department,
      patient_from_doctor,
      marriage_type_object={},
      raise_type_object={},
    } = this.state;


    const { getFieldDecorator } = form;

    let dataSourceDepartment=[];
    let dataSourceDoctor = [];
    let dataSourceJob = [];
    if(!patient_from_department){
      dataSourceDepartment = departments.map(v=>v.name);
    }else{
      dataSourceDepartment = departments.filter(v=>v.name.indexOf(patient_from_department)===0).map(v=>v.name)
    }

    if(!patient_from_doctor){
      dataSourceDoctor = doctors.map(v=>v.name);
    }else{
      dataSourceDoctor = doctors.filter(v=>v.name.indexOf(patient_from_doctor)===0).map(v=>v.name)
    }

    if(!patient_job_id_name){
      dataSourceJob = jobs.map(v=>v.name);
    }else{
      dataSourceJob = jobs.filter(v=>v.name.indexOf(patient_job_id_name)===0).map(v=>v.name)
    }



    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={loading}>

          <Form onSubmit={this.handleSubmit} className={styles.formCon}>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {
                getFieldDecorator('patient_name', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:patient_name,
                })(<Input placeholder="请输入" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="出生年月">
              {
                getFieldDecorator('birthday', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:moment(birthday||'1992-01-01'),
                })(<DatePicker />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              {
                getFieldDecorator('sex', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:sex||'1',
                })(
                  <RadioGroup>
                    <Radio value="1">男</Radio>
                    <Radio value="2">女</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="身高(cm)">
              {
                getFieldDecorator('height', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:height||'',
                })(<InputNumber min={0} max={250} style={{width:'100%'}}  placeholder="请输入" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="体重(kg)">
              {
                getFieldDecorator('weight', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:weight||'',
                })(<InputNumber min={0} max={250} style={{width:'100%'}}  placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="左右手">
              {
                getFieldDecorator('hand', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:hand||'1',
                })(
                  <RadioGroup>
                    <Radio key='hand1' value="1">右手</Radio>
                    <Radio key='hand2' value="2">左手</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="籍贯">
              {
                getFieldDecorator('native_place', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:native_place||'',
                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="文化水平">
              {
                getFieldDecorator('edu_level', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:edu_level||(edu_level_object&&Object.keys(edu_level_object)&&Object.keys(edu_level_object).length?`${Object.keys(edu_level_object)[0]}`:''),
                })(
                  <Select placeholder="请选择">
                    {
                      Object.keys(edu_level_object).map(v=>{
                        return (<Option key={`edu${v}`} value={v}>{edu_level_object[v]}</Option>)
                      })
                    }
                  </Select>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="家庭排行" className='Scale_PatientOwnFile_family'>
              {
                getFieldDecorator('child_index', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:child_index||'',
                })(
                  <InputNumber min={1} />
                )
              }
              <span>&nbsp;/&nbsp;</span>
              {
                getFieldDecorator('child_count', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:child_count||'',
                })(
                  <InputNumber min={1} />
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="婚姻状况">
              {
                getFieldDecorator('marriage_type', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:marriage_type||(marriage_type_object&&Object.keys(marriage_type_object)&&Object.keys(marriage_type_object).length?`${Object.keys(marriage_type_object)[0]}`:''),
                })(
                  <Select placeholder="请选择">
                    {
                      Object.keys(marriage_type_object).map(v=>{
                        return (<Option key={`marriage_type${v}`} value={v}>{marriage_type_object[v]}</Option>)
                      })
                    }
                  </Select>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="养育方式">
              {
                getFieldDecorator('raise_type', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:raise_type||(raise_type_object&&Object.keys(raise_type_object)&&Object.keys(raise_type_object).length?`${Object.keys(raise_type_object)[0]}`:''),
                })(
                  <Select placeholder="请选择">
                    {
                      Object.keys(raise_type_object).map(v=>{
                        return (<Option key={`raise_type${v}`} value={v}>{raise_type_object[v]}</Option>)
                      })
                    }
                  </Select>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="职业" required>
              <AutoComplete
                dataSource={dataSourceJob}
                style={{ width: '100%' }}
                onSelect={this.onInputJob}
                onSearch={this.onInputJob}
                onChange={this.onInputJob}
                placeholder=""
                value={patient_job_id_name||''}
              />
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="来源科室"
              required
            >
              <AutoComplete
                dataSource={dataSourceDepartment}
                style={{ width: '100%' }}
                onSelect={this.onSelectDepartment}
                onSearch={this.onSearchDepartment}
                onChange={this.onChangeDepartment}
                placeholder=""
                value={patient_from_department}
              />
            </FormItem>

            <FormItem {...formItemLayout} label="临床医生" required>
              <AutoComplete
                dataSource={dataSourceDoctor}
                style={{ width: '100%' }}
                onSelect={this.onInputDoctor}
                onSearch={this.onInputDoctor}
                onChange={this.onInputDoctor}
                placeholder=""
                value={patient_from_doctor}
              />
            </FormItem>

            <FormItem {...formItemLayout} label="联系电话">
              {
                getFieldDecorator('mobile', {
                  rules: [{
                    pattern: validateValues.phone.regex, message: validateValues.phone.invalidMsg,
                  }, {
                    required: false, message: validateValues.phone.emptyMsg,
                  }],
                  initialValue:mobile||'',
                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="子女情况">
              {
                getFieldDecorator('children_desc', {
                  initialValue:children_desc||'',
                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="父母情况">
              {
                getFieldDecorator('parents_desc', {
                  initialValue:parents_desc||'',
                })(<Input placeholder="请输入" />)
              }
            </FormItem>


            {
              case_id?(
                <FormItem {...formItemLayout} label="疾病流程">
                  <span>{case_disease_name}</span>
                </FormItem>
              ):(
                <FormItem {...formItemLayout} label="疾病流程" required>
                  {
                    getFieldDecorator('disease_id', {
                      rules: [{
                        // required: true,
                        message: '请输入',
                      }],
                      valuePropName:'value',
                      initialValue:diseaseList&&diseaseList[0]?diseaseList[0].disease_id+'':'',
                    })(
                      <Select placeholder="请选择">
                        {
                          diseaseList.map(v=>{
                            return (<Option key={`disId${v.disease_id}`} value={v.disease_id+''}>{v.disease_name}</Option>)
                          })
                        }
                      </Select>
                    )
                  }
                </FormItem>
              )
            }


            <FormItem style={{ marginTop: 32 }} wrapperCol={{ span: 18, offset: 8 }}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => tableHandler.back(this)} className={styles.cancelBtn}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
