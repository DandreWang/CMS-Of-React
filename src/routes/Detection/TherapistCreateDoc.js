import React, { PureComponent, Fragment } from 'react';
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
  Row,
  Col,
  message,
  InputNumber,
  AutoComplete,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TherapistCreateDoc.less';
import { router } from '../../utils/router';
import { tableHandler } from '../../utils/tableHandler';
import { storageKeys } from '../../utils/storageKeys';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { dataHandler } from '../../utils/dataHandler';
import { validateValues } from '../../utils/validate';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
};

class CheckInputDiy extends React.Component {
  render() {
    const {
      data = {}, onChangeOfCheck = () => {
      }, onChangeOfInput = () => {
      },
    } = this.props;
    const { item_id, checked, item_name, item_count } = data;
    return (
      <span className={styles.linkAge} key={item_id}>
        <Checkbox checked={!!checked} onChange={(event) => onChangeOfCheck(event, item_id)}>{item_name}</Checkbox>
        {
          checked ? (
            <Fragment>
              <InputNumber className={styles.inputDiy} min={1} onChange={(number) => onChangeOfInput(number, item_id)}
                           defaultValue={item_count || ''}/>
              <span className={styles.timeSpan}>次</span>
            </Fragment>
          ) : null
        }
      </span>
    );
  }
}

@connect(() => ({}))
@Form.create()
export default class TherapistCreateDoc extends PureComponent {
  state = {
    treatment_item_list: [],
    edu_level_object:{},
    edu_level_object:{},
    marriage_type_object:{},
    dep:'',
    doc:'',
    doctors:[],
    departments:[],
    loading:true,
  };

  // 组件加载完成
  componentDidMount() {
    this.get_treatment_item_list();
    this.common_status_detail('分类-文化水平');
    this.common_status_detail('分类-婚姻类型');
    this.common_status_detail('分类-养育方式');
    this.get_departments();
    this.get_job_list();
  }

  onSelectDepartment = (value)=>{
    // 从下拉菜单选中
    this.setState({dep:value});
  };

  onSearchDepartment = (value)=>{
    // 输入时
    this.setState({dep:value});
  };


  onChangeDepartment = (value)=>{

    // 内容变化时
    const {dep,departments} = this.state;

    this.setState({dep:value});

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


  get_treatment_item_list = () => {
    request(urls.get_treatment_item_list, {
      body: {},
      success: treatment_item_list => {
        this.setState({ treatment_item_list });
      },
      fail: errmsg => {
        message.error(errmsg || '获取治疗项目类型列表失败');
      },
      complete: () => {
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

  onInputJob = (value)=>{
    this.setState({job:value});
  };



  onInputDoctor = (value)=>{
    this.setState({doc:value});
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
        this.setState({doctors,doc:''});
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
    const { form, dispatch } = this.props;

    const {doctors=[],doc='',job='',jobs=[],departments=[],dep=''} = this.state;

    if(!doc){
      return message.error('请选择医生');
    }
    if(!job){
      return message.error('请选择职业');
    }
    if(!dep){
      return message.error('请选择科室');
    }

    try {
      departments.find(v=>v.name===dep).id;
    }catch (event) {
      return message.error('科室不存在');
    }

    let config_doctor_id;
    try {
      config_doctor_id = doctors.find(v=>v.name===doc).id;
    }catch (event) {
      return message.error('医生不存在');
    }

    let job_id;
    try {
      job_id = jobs.find(v=>v.name===job).id;
    }catch (event) {
      return message.error('职业不存在');
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {child_index,child_count} = values;
        if(child_index>child_count){
          return message.error('家庭排行前者不可大于后者');
        }
        const {treatment_item_list=[]} = this.state;
        const treatments = treatment_item_list.filter(v=>{
          return v.checked && v.item_count>0
        });
        if(!treatments || treatments.length===0){
          return message.error('请选择治疗方案');
        }

        const body = {
          ...values,
          birthday: values.birthday.format('YYYY-MM-DD'),
          treatments:JSON.stringify(treatments),
          config_doctor_id,
          job_id,
        };

        request(urls.create_therapist_patient_case, {
          body,
          success: (data) => {
            message.success('建档成功');
            setTimeout(()=>{
              router.jump({
                dispatch,
                pathname:`/patient/treat/${data}`,
              })
            },1000)
          },
          fail: errmsg => {
            message.error(errmsg || '创建失败');
          },
          complete: () => {
          },
        });
      }
    });
  };

  onChangeOfInput = (number, item_id) => {
    const n = number - 0;
    const { treatment_item_list = [] } = this.state;
    const t = dataHandler.deepClone(treatment_item_list);
    const tTarget = t.find(v => v.item_id - 0 === item_id - 0);
    tTarget.item_count = n > 0 ? n : 0;
    this.setState({ treatment_item_list: t });
  };

  onChangeOfCheck = (event, item_id) => {
    const { treatment_item_list = [] } = this.state;
    let t = dataHandler.deepClone(treatment_item_list);
    const tTarget = t.find(v => v.item_id - 0 === item_id - 0);
    tTarget.checked = !tTarget.checked;
    this.setState({
      treatment_item_list: t,
    });
  };

  render() {
    const { form } = this.props;
    const { treatment_item_list = [],edu_level_object={},dep='',departments=[],doc='',doctors=[],jobs=[],job='',marriage_type_object={},raise_type_object={} } = this.state;
    const { getFieldDecorator } = form;

    const physical = treatment_item_list.filter(v => v.item_type - 0 === 1);
    const psychology = treatment_item_list.filter(v => v.item_type - 0 === 2);

    let dataSourceDepartment;
    let dataSourceDoctor = [];
    let dataSourceJob = [];

    if(!dep){
      dataSourceDepartment = departments.map(v=>v.name);
    }else{
      dataSourceDepartment = departments.filter(v=>v.name.indexOf(dep)===0).map(v=>v.name)
    }

    if(!doc){
      dataSourceDoctor = doctors.map(v=>v.name);
    }else{
      dataSourceDoctor = doctors.filter(v=>v.name.indexOf(doc)===0).map(v=>v.name)
    }

    if(!job){
      dataSourceJob = jobs.map(v=>v.name);
    }else{
      dataSourceJob = jobs.filter(v=>v.name.indexOf(job)===0).map(v=>v.name)
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false}>

          <Form onSubmit={this.handleSubmit} className={styles.formCon}>
            <FormItem {...formItemLayout} label="姓名">
              {
                getFieldDecorator('patient_name', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                })(<Input placeholder="请输入"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="出生年月">
              {
                getFieldDecorator('birthday', {
                  rules: [{
                    required: true,
                    message: '请选择起止日期',
                  }],
                  initialValue:moment('1992-01-01'),
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
                  initialValue:'1',
                })(
                  <RadioGroup>
                    <Radio key='hand1' value="1">男</Radio>
                    <Radio key='hand2' value="2">女</Radio>
                  </RadioGroup>,
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
                })(<InputNumber min={0} max={250} style={{ width: '100%' }}  placeholder="请输入"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="体重(kg)">
              {
                getFieldDecorator('weight', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                })(<InputNumber min={0} max={250} style={{ width: '100%' }} placeholder="请输入"/>)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="左右手">
              {
                getFieldDecorator('hand', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue:'1',
                })(
                  <RadioGroup>
                    <Radio value="1">右手</Radio>
                    <Radio value="2">左手</Radio>
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
                  initialValue:edu_level_object&&Object.keys(edu_level_object)&&Object.keys(edu_level_object).length?`${Object.keys(edu_level_object)[0]}`:'',
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
                  initialValue:marriage_type_object&&Object.keys(marriage_type_object)&&Object.keys(marriage_type_object).length?`${Object.keys(marriage_type_object)[0]}`:'',
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
                  initialValue:raise_type_object&&Object.keys(raise_type_object)&&Object.keys(raise_type_object).length?`${Object.keys(raise_type_object)[0]}`:'',
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
                value={job}
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
                value={dep}
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
                value={doc}
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
                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="子女情况">
              {
                getFieldDecorator('children_desc', {

                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="父母情况">
              {
                getFieldDecorator('parents_desc', {

                })(<Input placeholder="请输入" />)
              }
            </FormItem>

            {
              physical && physical.length ? (
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="物理治疗">
                  {
                    physical.map((value, i) => {
                      return (
                        <CheckInputDiy
                          key={`physical${i}`}
                          data={value}
                          onChangeOfCheck={this.onChangeOfCheck}
                          onChangeOfInput={this.onChangeOfInput}
                        />
                      );
                    })
                  }
                </FormItem>
              ) : null
            }


            {
              psychology && psychology.length ? (
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="心理治疗">
                  {
                    psychology.map((value, i) => {
                      return (
                        <CheckInputDiy
                          key={`psychology${i}`}
                          data={value}
                          onChangeOfCheck={this.onChangeOfCheck}
                          onChangeOfInput={this.onChangeOfInput}
                        />
                      );
                    })
                  }
                </FormItem>
              ) : null
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
