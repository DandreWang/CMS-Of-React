import React, { PureComponent, Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  Button,
  Row,
  Col,
  Collapse,
  Modal,
  Progress,
  Timeline,
  Upload,
  Icon,
  message,
  Input,
  Tooltip,
  Radio,
  InputNumber,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import ButtonSimple from 'components/Button';
import { images } from '../../utils/images';
import { router } from '../../utils/router';
import styles from './Treat.less';
import classnames from 'classnames';
import { dataHandler } from '../../utils/dataHandler';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import classNames from 'classnames';
import ModalDiy from 'components/ModalDiy';
import {parse,stringify} from 'qs';
import { storageKeys } from '../../utils/storageKeys';

const { Description } = DescriptionList;

const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;

const { Option } = Select;

class RadioDiy extends Component {
  render() {
    const { onChange, data: { property_name, property_options = [], property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={20}>
          <RadioGroup onChange={onChange} value={property_value}>
            {
              property_options.map((item, i) => {
                const { value, text } = item;
                return <Radio key={`property_options${value}`} value={value}>{text}</Radio>;
              })
            }
          </RadioGroup>
        </Col>
      </Row>
    );
  }
}

class InputNumberDiy extends Component {
  render() {
    const { onChange, data: { property_name, property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={4}>
          <InputNumber min={1} onChange={onChange} value={property_value}/>
        </Col>
      </Row>
    );
  }
}

class InputTextDiy extends Component {
  render() {
    const { onChange, data: { property_name, property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={4}>
          <Input onChange={onChange} value={property_value}/>
        </Col>
      </Row>
    );
  }
}

class TextareaDiy extends Component {
  render() {
    const { onChange, data: { property_name, property_value } = {} } = this.props;
    return (
      <Row gutter={12} className={styles.timeLineItem}>
        <Col span={4}>
          <label className={styles.label}>{property_name}:</label>
        </Col>
        <Col span={20}>
          <TextArea
            placeholder="请输入"
            autosize={{minRows:4,maxRows:12}}
            value={property_value}
            onChange={onChange}
          />
        </Col>
      </Row>
    );
  }
}

class ImgDiy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible:false,
      previewImage:'',
      // fileList,
    };
  }
  showPreview = (file)=>{
    this.setState({
      previewVisible:true,
      previewImage:file.url||file.thumbUrl||file.response.data,
    })
  };
  hidePreview = ()=>{
    this.setState({
      previewVisible:false,
    })
  };
  beforeUpload = (file={}) => {
    const {type,size} = file;
    const typesValid = ['image/jpeg','image/png','image/jpg'];
    const isValidType = typesValid.indexOf(type) !== -1;
    if (!isValidType) {
      message.error('请上传格式为jpeg、jpg、png的图片!');
      return false;
    }
    const tooBig = size / 1024 / 1024 > 5;
    if (tooBig) {
      message.error('图片应不大于5MB!');
      return false;
    }
    return true;
  };

  // componentWillReceiveProps(newProps){
  //   const { data: { property_value = [] } = {} } = newProps;
  //   let fileList=property_value.slice().map(value=>({random:Math.random(),url:value,uid:value||Math.random(),response:{data:value}}));
  //   if(property_value[property_value.length-1].status){
  //     fileList[fileList.length-1] = property_value[property_value.length-1];
  //   }
  //   this.setState({ fileList });
  //   this.forceUpdate();
  // }
  render() {
    const { onChange, data: { property_name, property_value = [] } = {}, i , j } = this.props;
    const {previewVisible,previewImage,fileList} = this.state;
    // console.log(property_value.length);
    const uploadButton = (
      <div>
        <Icon type="picture" style={{ fontSize: 20 }} />
        <div className="ant-upload-text">添加图片</div>
      </div>
    );
    return (
      <Row gutter={24} className={styles.timeLineItem}>
        <Col span={20} offset={4}>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={18}>
              <Upload
                action={urls.file_plupload_common}
                name='file'
                // methods='post'
                // headers={{ 'Content-Type':'multipart/form-data',Accept: 'application/json' }}
                listType="picture-card"
                defaultFileList={property_value.slice().map(value=>({url:value,uid:value,response:{data:value}}))}
                // fileList={fileList}
                // beforeUpload={this.beforeUpload}
                onPreview={this.showPreview}
                onChange={({ fileList,file,event })=>onChange({ fileList,file,event,i, j })}
                // showUploadList={{showPreviewIcon:false,showRemoveIcon:true}}
              >
                {property_value.length >= 5 ? null : uploadButton}
              </Upload>
              <ModalDiy visible={previewVisible} footer={null} onCancel={this.hidePreview} width={'400px'}>
                <img alt="无法显示" style={{ width: '100%' }} src={previewImage} />
              </ModalDiy>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}


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
export default class Treat extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    electro: true,
    fileList: [],
    itemList: [{
      id: 0,
      type: 1,
      name: '经颅磁刺激治疗',
    }, {
      id: 1,
      type: 2,
      name: '音乐放松治疗',
    }, {
      id: 2,
      type: 0,
      name: '精神分析治疗',
    }, {
      id: 3,
      type: 1,
      name: '行为认知治疗',
    }],


    patient_case_test_report:{},
    patient_case_basic_info: {},
    patient_case_info_for_therapist: {},
    patient_case_next_treatment: {},
    patient_case_ongoing_treatment_flow: {},
    activeKey:[],

    card_no_input:'',
    cardVerifyStatus:0, // 0 隐藏， 1 验证中， 2 验证成功
    cardInfo:{}, // 刷卡成功后的卡信息

  };

  // 组件加载完成
  componentDidMount() {
    const { match: { params = {} } = {} } = this.props;
    case_id = params.case_id;

    this.get_patient_case_basic_info();
    this.get_patient_case_info_for_therapist();
    this.get_patient_case_final_report();

  }

  onChangeOfDiy = (any, i, j, type) => {
    const { patient_case_ongoing_treatment_flow = {} } = this.state;
    const p = dataHandler.deepClone(patient_case_ongoing_treatment_flow);
    const { treatment_item_list = [] } = p;
    if (type === 'img') {
      treatment_item_list[i].treatment_item_properties[j].property_value.push(any);
    } else if (type === 'number') {
      treatment_item_list[i].treatment_item_properties[j].property_value = any;
    } else {
      const { value } = any.target;
      treatment_item_list[i].treatment_item_properties[j].property_value = value;
    }
    this.setState({ patient_case_ongoing_treatment_flow: p });
  };

  /* 以下注释的onChangeOfImg暂时不要删!!!!!*/
  // onChangeOfImg = ({ fileList,file,event,i, j }) => {
  //   try{
  //     const {patient_case_ongoing_treatment_flow} = this.state;
  //     const p = dataHandler.deepClone(patient_case_ongoing_treatment_flow);
  //     let properties = p.treatment_item_list[i].treatment_item_properties[j];
  //     const url = file&&file.response&&file.response.data;
  //     if(file.status==='uploading'){
  //       properties.property_value[fileList.length-1] = file;
  //     }
  //     else if(file.status==='done'){
  //       properties.property_value[fileList.length-1] = url;
  //     }else if(file.status==='removed'){
  //       properties.property_value = properties.property_value.filter(item=>item!==url)
  //     }
  //     console.log(properties);
  //     this.setState({patient_case_ongoing_treatment_flow:p});
  //   }catch (e) {
  //     // message.error('操作失败');
  //   }
  // };

  onChangeOfImg = ({ fileList,file,event,i, j }) => {
    try{
      const {patient_case_ongoing_treatment_flow} = this.state;
      const p = dataHandler.deepClone(patient_case_ongoing_treatment_flow);
      let v = p.treatment_item_list[i].treatment_item_properties[j].property_value;
      const url = file&&file.response&&file.response.data;
      if(file.status==='done'){
        v.push(url);
      }else if(file.status==='removed'){
        v.splice(v.findIndex(item=>item===url),1);
        // v = v.filter(item=>item!==url)
      }
      this.setState({patient_case_ongoing_treatment_flow:p});
    }catch (e) {
      // message.error('操作失败');
    }
  };

  onKeyDownOfCard = (event)=>{
    const isEnter = event.keyCode-0===13;
    const isEsc = event.keyCode-0===27;
    if(isEnter){
      const {value} = event.target;
      if(!value){
        return message.error('请刷卡');
      }

      this.setState({ card_no_input:''});

      this.checkCard({card_no:value,callback:(data)=>{

          const {card_no,price:card_price} = data||{};

          this.setState({ cardInfo:{card_no,card_price} },()=>{
            this.setState({ cardVerifyStatus:2 })
          });

        }});

    }
  };

  onChangeOfCard = (event)=>{
    this.setState({
      card_no_input:event.target.value,
    })
  };

  get_patient_case_final_report = () => {
    request(urls.get_patient_case_final_report, {
      body: { case_id },
      success: patient_case_test_report => {
        this.setState({ patient_case_test_report });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
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

  get_patient_case_info_for_therapist = () => {

    request(urls.get_patient_case_info_for_therapist, {
      body: { case_id },
      success: patient_case_info_for_therapist => {
        this.setState({ patient_case_info_for_therapist });
        const { case_status } = patient_case_info_for_therapist;
        if (case_status - 0 === 2) {
          // 治疗中
          this.get_patient_case_ongoing_treatment_flow();
        } else if (case_status - 0 === 1) {
          // 待治疗
          this.get_patient_case_next_treatment();
        }
      },
      fail: errmsg => {
        message.error(errmsg || '获取病例信息失败');
      },
      complete: () => {
      },
    });

  };

  get_patient_case_next_treatment = () => {

    request(urls.get_patient_case_next_treatment, {
      body: { case_id },
      success: patient_case_next_treatment => {
        this.setState({ patient_case_next_treatment });
      },
      fail: errmsg => {
        message.error(errmsg || '获取下次治疗信息失败');
      },
      complete: () => {
      },
    });

  };



  get_patient_case_ongoing_treatment_flow = () => {

    request(urls.get_patient_case_ongoing_treatment_flow, {
      body: { case_id },
      success: patient_case_ongoing_treatment_flow => {
        this.setState({ patient_case_ongoing_treatment_flow });
      },
      fail: errmsg => {
        message.error(errmsg || '开始治疗失败');
      },
      complete: () => {
      },
    });
  };

  start_patient_case_next_treatment = (card_no) => {

    request(urls.start_patient_case_next_treatment, {
      body: { case_id,card_no },
      success: data => {
        this.get_patient_case_info_for_therapist();
      },
      fail: errmsg => {
        message.error(errmsg || '开始治疗失败');
      },
      complete: () => {
      },
    });
  };

  save_detail_data_ok = (treatment_item_properties = []) => {
    return treatment_item_properties.every(v => v.property_value);
  };

  save_patient_case_treatment_flow_detail = (detail_record_id) => {
    const { patient_case_ongoing_treatment_flow = {} } = this.state;
    const { treatment_item_list = [] } = patient_case_ongoing_treatment_flow;
    const properties = treatment_item_list.find(v => v.treatment_record_id - 0 === detail_record_id - 0);
    const { treatment_item_properties = [] } = properties;
    console.log(treatment_item_properties);
    if (this.save_detail_data_ok(treatment_item_properties)) {
      request(urls.save_patient_case_treatment_flow_detail, {
        body: { detail_record_id, properties: JSON.stringify(treatment_item_properties) },
        success: () => {
          const p = dataHandler.deepClone(patient_case_ongoing_treatment_flow);
          p.treatment_item_list.find(v => v.treatment_record_id - 0 === detail_record_id - 0).treatment_item_status = 1;
          this.setState({ patient_case_ongoing_treatment_flow: p });

          const {activeKey=[]} = this.state;
          const a = dataHandler.deepClone(activeKey);
          this.setState({
            activeKey:a.filter(v=>v-0!==detail_record_id-0),
          })
        },
        fail: errmsg => {
          message.error(errmsg || '操作失败');
        },
        complete: () => {
        },
      });
    } else {
      message.error('请检查内容是否完整');
    }
  };

  save_patient_case_treatment_flow = () => {
    const { dispatch } = this.props;
    const { patient_case_ongoing_treatment_flow: { current_flow_id } = {} } = this.state;
    request(urls.save_patient_case_treatment_flow, {
      body: { current_flow_id },
      success: () => {
        router.jump({
          dispatch,
          pathname: `/patient/treat-success/${case_id}`,
        });
      },
      fail: errmsg => {
        message.error(errmsg || '操作失败');
      },
      complete: () => {
      },
    });
  };

  startTreat = () => {
    this.setState({
      cardVerifyStatus: 1,
      card_no_input:'',
    },()=>{
      setTimeout(()=>{
        this.card_no_ref.focus();
      },100)
    });
  };

  cardRender() {
    const {cardVerifyStatus,card_no_input='',cardInfo:{card_id,card_no,card_price,card_type}={}} = this.state;

    return cardVerifyStatus===1?(
      <div className={styles.cardModelContent}>
        <img src={images.card} alt="" />
        <h3>请将磁卡置于机器上方</h3>
        <p>刷卡成功后继续操作</p>
        <input
          type="text"
          ref={input=>{this.card_no_ref = input}}
          id="card_no_id"
          style={{position: 'fixed',left: '-999px'}}
          // autofocus="autofocus"
          value={card_no_input}
          onChange={this.onChangeOfCard}
          onKeyDown={this.onKeyDownOfCard}
          // style={{display:'none'}}
        />
      </div>
    ):cardVerifyStatus===2?(
      <div className={styles.cardModelContent}>
        <Icon type="check-circle" />
        <h3>刷卡成功</h3>
        <div className={styles.cardModelList}>
          {
            card_no&&(
              <div>
                <label>编号：</label>
                <p>{card_no}</p>
              </div>
            )
          }

          {
            card_type&&(
              <div>
                <label>类型：</label>
                <p>{card_type}</p>
              </div>
            )
          }

          {
            card_price&&(
              <div>
                <label>面值：</label>
                <p>{card_price}元</p>
              </div>
            )
          }

        </div>
        <Button type="primary" onClick={()=>this.continue(card_no)}>
          继续
        </Button>
      </div>
    ):null;
  }

  checkCard = ({card_no,callback})=>{
    request(urls.check_treatment_card, {
      body: {card_no},
      success: (data) => {
        callback && callback(data);
      },
      fail: errmsg => {
        message.error(errmsg || '请检查卡是否有效');
      },
      complete: () => {
      },
    });
  };


  continue = (card_no)=>{
    this.setState({
      cardVerifyStatus:0,
    },()=>{
      this.start_patient_case_next_treatment(card_no);
    });

  };

  handleCancel = () => {
    this.setState({
      cardVerifyStatus:0,
      card_no_input:'',
    });
  };

  endTreat = () => {
    const { save_patient_case_treatment_flow } = this;
    confirm({
      title: '提示',
      content: '确认结束本次治疗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        save_patient_case_treatment_flow();
      },
      onCancel() {
        console.log('取消');
      },
    });
  };

  updateItem = (treatment_record_id) => {
    const {patient_case_ongoing_treatment_flow={}} = this.state;
    const p = dataHandler.deepClone(patient_case_ongoing_treatment_flow);
    const {treatment_item_list=[]} = p;
    const t = treatment_item_list.find(v=>v.treatment_record_id-0===treatment_record_id-0);
    t.treatment_item_status = 2;
    this.setState({patient_case_ongoing_treatment_flow:p});

    const {activeKey=[]} = this.state;
    const a = dataHandler.deepClone(activeKey);
    a.push(treatment_record_id+'');
    this.setState({activeKey:a});
  };

  toggleItem = (id, close) => {
    const { itemList } = this.state;
    const nList = dataHandler.deepClone(itemList);
    nList.find(item => item.id === id).close = close;
    this.setState({
      itemList: nList,
    });
  };

  collTitle = ({ treatment_item_name, treatment_item_status, treatment_record_id }) => {
    const status = treatment_item_status-0; // 未完成0，已完成1，已终止99，治疗中2
    return (
      <div className={styles.titleMain}>
        <Row gutter={8}>
          <Col span={12}>
            <div className={styles.panelTitle}>
              {treatment_item_name}
              {
                status===1 ? (
                  <a
                    className={styles.updateBtn}
                    onClick={() => {this.updateItem(treatment_record_id,status)}}
                  >
                    修改
                  </a>
                ) : null
              }
            </div>
          </Col>
          <Col>
            <div className={styles.panelNum}>
              {
                status === 2 ? '治疗中' : status === 1 ? (
                  <span className={styles.completeItem}>
                    本次治疗已完成<img className={styles.imgSelect} src={images.select} alt="" />
                  </span>
                ) : status === 99? (<span style={{color:'#f00'}}>已终止</span>) : null
              }
            </div>
          </Col>
        </Row>
        <div className={styles.panelTitBtn}>
          {
            status===0 ? (
              <Button type="primary" onClick={() => this.updateItem(treatment_record_id,status)}>开始治疗</Button>
            ) : null
          }
        </div>
      </div>
    );
  };


  generate = (item = {}, index) => {
    const {treatment_record_id} = item;
    const {activeKey=[]} = this.state;
    return (
      <Collapse
        // defaultActiveKey={['1']}
        activeKey={activeKey}
        // onChange={(idx) => {
        //   this.toggleItem(item.id, idx.length);
        // }}
      >
        <Panel
          // header=''
          header={this.collTitle(item, index)}
          key={treatment_record_id+''}
          showArrow={false}
          disabled
          // disabled={item.type !== 1}
        >
          {this.generateChild(item, index)}
        </Panel>
      </Collapse>
    );
  };

  generateChild = (item = {}, i) => {
    const { treatment_record_id, treatment_item_name, treatment_item_status, treatment_item_properties = [] } = item;
    return (
      <div>
        {
          treatment_item_properties.map((value = {}, j) => {
            const { property_type } = value;
            let comp;
            switch (property_type) {
              case 1:
                comp = <RadioDiy onChange={(event) => this.onChangeOfDiy(event, i, j)} data={value} i={i} j={j}/>;
                break;
              case 2:
                comp =
                  <InputNumberDiy onChange={(v) => this.onChangeOfDiy(v, i, j, 'number')} data={value} i={i} j={j}/>;
                break;
              case 3:
                comp = <InputTextDiy onChange={(event) => this.onChangeOfDiy(event, i, j)} data={value} i={i} j={j}/>;
                break;
              case 4:
                comp = <TextareaDiy onChange={(event) => this.onChangeOfDiy(event, i, j)} data={value} i={i} j={j}/>;
                break;
              case 5:
                comp = <ImgDiy onChange={this.onChangeOfImg} data={value} i={i} j={j} />;
                break;
              default:
                comp = null;
                break;
            }
            return comp;
          })
        }

        <div className={styles.timeLineButton}>
          <Button
            type="primary"
            onClick={() => {
              this.save_patient_case_treatment_flow_detail(treatment_record_id);
            }}
          >
            保存并结束本项治疗
          </Button>
        </div>

      </div>
    );
  };

  startTreatmenting = (data = {}) => {

    const { previewVisible, previewImage, itemList, fileList } = this.state;

    const { treatment_item_list = [] } = data;

    return (
      <div>
        <Timeline className={styles.timeLineWrap}>
          {
            treatment_item_list && treatment_item_list.length ? (
              treatment_item_list.map((value, i) => {
                return (
                  <Timeline.Item key={`treatment_record_id${value.treatment_record_id}`}>
                    {
                      this.generate(value, i)
                    }
                  </Timeline.Item>
                );
              })
            ) : null
          }

        </Timeline>
        <div style={{ textAlign: 'center' }}>
          <ButtonSimple onClick={this.endTreat} type='red' key='end'>
            结束本次治疗
          </ButtonSimple>
        </div>
      </div>
    );
  };

  treatment = (data, time, price) => {
    return (
      <Row gutter={8} className={`${styles.panelMain} ${time > 0 ? '' : styles.isComplete}`}>
        <Col span={16}>
          <div className={styles.panelTitle}>
            <div>{data}</div>
            <span className={styles.price}>{`${price}/次`}</span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.panelNum}>剩余{<span className={styles.time}>{time}</span>}次</div>
        </Col>
      </Row>
    );
  };

  startTreatment = (treatment_item_list) => {
    return (
      <div>
        <ul>
          <li>
            <h3>治疗方案</h3>
            <Row gutter={48}>
              {
                treatment_item_list && treatment_item_list.length ? (
                  treatment_item_list.map((value, i) => {
                    return <Col key={`${value.treatment_item_name}${i}`}
                                span={8}>{this.treatment(value.treatment_item_name, value.treatment_item_remain_times, value.treatment_item_price)}</Col>;
                  })
                ) : null
              }
            </Row>
          </li>
        </ul>
        <div className={styles.startButton}>
          <span className={styles.startTreat} onClick={this.startTreat} key="start">
            开始本次治疗
          </span>
        </div>
      </div>
    );
  };

  scanRecord = () => {
    const { dispatch } = this.props;
    router.jump({
      dispatch,
      pathname: `/patient/treat-record/${case_id}`,
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

  render() {
    const { electro, cardVerifyStatus,card_no_input } = this.state;

    const {
      patient_case_basic_info = {},
      patient_case_info_for_therapist: { evaluate_list = [], case_status } = {},
      patient_case_next_treatment = {},
      patient_case_ongoing_treatment_flow = {},
      patient_case_test_report = {},
    } = this.state;

    let last_treatment_time, flow_index, treatment_item_list = [], treat = null;
    switch (case_status) {
      case 1:
        last_treatment_time = patient_case_next_treatment.last_treatment_time;
        flow_index = patient_case_next_treatment.next_flow_index;
        treatment_item_list = patient_case_next_treatment.treatment_item_list;
        treat = this.startTreatment(treatment_item_list);
        break;
      case 2:
        last_treatment_time = patient_case_ongoing_treatment_flow.last_treatment_time;
        flow_index = patient_case_ongoing_treatment_flow.current_flow_index;
        treat = this.startTreatmenting(patient_case_ongoing_treatment_flow);
        break;
    }

    const {diagnosis_report={}} = patient_case_test_report||{};
    const {impression_name, impression_level_desc, impression_desc,
      chief_report, medicine_treatments, physics_treatments,
      mentality_treatments, secondary_impression_name,
      diagnosis_selections, assist_diagnosis_selections, symptom_diagnosis, pre_diagnosis, medical_analysis,
      secondary_impression_level_desc, dev_trace, psy_factor,} = diagnosis_report||{};


    return (
      <PageHeaderLayout
        title={patient_case_basic_info.case_no ? `编号：${patient_case_basic_info.case_no}` : ''}
        // logo={<img alt="" src={images.treatTitle}/>}
        content={this.renderPatientCaseBasicInfo(patient_case_basic_info)}
        action={<Action1 click={this.scanReport} />}
        className={styles.mainPage}
      >
        <Row gutter={{ xs: 24, sm: 24, md: 24 }}>
          <Col span={5}>
            <div className={styles.impression}>
              <Fragment>
                <div className={styles.titleWrap}>
                  <span className={styles.sep} />
                  <span className={styles.title}>诊断选项</span>
                </div>
                <div>
                  {
                    diagnosis_selections?(<span className={styles.emptyText}>{diagnosis_selections}</span>):<div className={styles.emptyText}>无</div>
                  }
                </div>
              </Fragment>
              <Fragment>
                <div className={styles.titleWrap} style={{marginTop:15}}>
                  <span className={styles.sep} />
                  <span className={styles.title}>辅助诊断选项</span>
                </div>
                <div>
                  {
                    assist_diagnosis_selections?(<span className={styles.emptyText}>{assist_diagnosis_selections}</span>):(<div className={styles.emptyText}>无</div>)
                  }
                </div>
              </Fragment>
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.impression}>
              <Fragment>
                <div className={styles.titleWrap}>
                  <span className={styles.sep} />
                  <span className={styles.title}>症状学诊断</span>
                </div>
                <div>
                  {
                    symptom_diagnosis?(<span className={styles.emptyText}>{symptom_diagnosis}</span>):<div className={styles.emptyText}>无</div>
                  }
                </div>
              </Fragment>
              <Fragment>
                <div className={styles.titleWrap} style={{marginTop:15}}>
                  <span className={styles.sep} />
                  <span className={styles.title}>初步诊断</span>
                </div>
                <div>
                  {
                    pre_diagnosis?(<span className={styles.emptyText}>{pre_diagnosis}</span>):(<div className={styles.emptyText}>无</div>)
                  }
                </div>
              </Fragment>
              <Fragment>
                <div className={styles.titleWrap} style={{marginTop:15}}>
                  <span className={styles.sep} />
                  <span className={styles.title}>整体医学分析</span>
                </div>
                <div>
                  {
                    medical_analysis?(<span className={styles.emptyText}>{medical_analysis}</span>):(<div className={styles.emptyText}>无</div>)
                  }
                </div>
              </Fragment>
            </div>
          </Col>
          <Col span={10}>
            <div className={styles.treatScheme}>
              <div className={styles.titleWrap}>
                <span className={styles.sep} />
                <span className={styles.title}>治疗方案</span>
              </div>
              {
                (medicine_treatments && medicine_treatments.length)||(physics_treatments && physics_treatments.length)||(mentality_treatments && mentality_treatments.length)?
                  (
                    <div className={styles.content}>
                      {
                        medicine_treatments && medicine_treatments.length ? (
                          <DescriptionList className={styles.cardList} size="small" col="1">
                            <Description className={styles.description} term="用药建议" termclass={styles.termStyle}>
                              {
                                medicine_treatments.map((value, i) => {
                                  const { medicine_name, medicine_use_type_desc, medicine_use_amount, medicine_use_rate, medicine_use_days } = value;
                                  return (
                                    <div
                                      className={styles.desc}
                                      key={medicine_name}>{[medicine_name, `${medicine_use_amount}${medicine_use_type_desc}`, `${medicine_use_rate}次/日`, `共${medicine_use_days}日`].join('    ')}</div>
                                  );
                                })
                              }
                            </Description>
                          </DescriptionList>
                        ) :null
                      }

                      {
                        physics_treatments && physics_treatments.length ? (
                          <DescriptionList className={styles.cardList} size="small" col="1">
                            <Description className={styles.description} term="物理治疗" termclass={styles.termStyle}>
                              {
                                physics_treatments.map((value, i) => {
                                  return (
                                    <div
                                      key={value.item_name}
                                      className={styles.desc}>{value.item_name}&nbsp;X&nbsp;{value.item_count}</div>
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
                            <Description className={styles.description} term="心理治疗" termclass={styles.termStyle}>
                              {
                                mentality_treatments.map((value, i) => {
                                  return (
                                    <div key={value.item_name}
                                         className={styles.desc}>{value.item_name}&nbsp;X&nbsp;{value.item_count}</div>
                                  );
                                })
                              }
                            </Description>
                          </DescriptionList>
                        ) : null
                      }

                    </div>
                  ):(<div className={styles.emptyText}>无</div>)
              }

            </div>




          </Col>
        </Row>

        <Card style={{ marginTop: '24px' }}>
          <Row gutter={8} className={styles.record}>
            <Col span={18} className={styles.recordTitle}>
              {
                last_treatment_time ? (<div>第 <span>{flow_index}</span> 次治疗 上一次治疗时间：{last_treatment_time}</div>) : (
                  <div>第 <span>{flow_index}</span> 次治疗</div>)
              }

            </Col>
            {
              flow_index > 1 ? (
                <Col span={6} className={styles.recordA}>
                  <a onClick={this.scanRecord}>查看治疗记录</a>
                </Col>
              ) : null
            }

          </Row>

          {/* 切换不同的界面 */}
          {treat}
        </Card>

        <ModalDiy
          title="刷卡治疗"
          visible={cardVerifyStatus===1||cardVerifyStatus===2}
          footer={null}
          onCancel={this.handleCancel}
          bodyStyle={{ textAlign: 'center' }}
          width="360px"
        >
          {this.cardRender()}
        </ModalDiy>

        {/*{useCard ? (*/}
          {/*<div className={styles.cardModelContent}>*/}
            {/*<img src={images.card} alt="" />*/}
            {/*<h3>请将磁卡置于机器上方</h3>*/}
            {/*<p>刷卡成功后继续操作</p>*/}
            {/*<input*/}
              {/*type="text"*/}
              {/*ref={input=>{this.card_no_ref = input}}*/}
              {/*id="card_no_id"*/}
              {/*style={{position: 'fixed',left: '-999px'}}*/}
              {/*// autofocus="autofocus"*/}
              {/*value={card_no_input}*/}
              {/*onChange={this.onChangeOfCard}*/}
              {/*onKeyDown={this.onKeyDownOfCard}*/}
              {/*// style={{display:'none'}}*/}
            {/*/>*/}
          {/*</div>*/}
        {/*) : null}*/}


      </PageHeaderLayout>
    );
  }
}
