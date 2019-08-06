import React, { Component, Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Modal,
  Button,
  Divider,
  message,
} from 'antd';
import classnames from 'classnames'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {images} from '../../utils/images';
import {router} from '../../utils/router';
import styles from './Staff.less';
import {storageHandler} from '../../utils/storageHandler';
import { storageKeys } from '../../utils/storageKeys';
import { getAuthority } from '../../utils/authority';
import ModalDiy from 'components/ModalDiy';
import request from '../../utils/request';
import { urls } from '../../utils/urls';

const login = storageHandler.getLogin();

const Action = (data=[]) => {
  return (
    <div className={styles.extraContent}>
      {
        data.map(v=>{
          return (
            <div className={styles.statItem} key={v.stats_name}>
              <p>{v.stats_name}</p>
              <p>{v.stats_count}</p>
            </div>
          )
        })
      }
    </div>
  )
};

@connect(({ staff, loading }) => ({
  // functions:staff.functions,
  // stats:staff.stats,
  staff,
  loading: loading.effects['staff/fetch'],
}))
export default class Index extends Component {


  constructor(props){
    super(props);
    this.cardRender = this.cardRender.bind(this);
  }

  state = {
    cardVerifyStatus:0, // 0 隐藏， 1 验证中， 2 验证成功
    cardInfo:{}, // 刷卡成功后的卡信息
    card_no_input:'',
  };

  componentDidMount() {

    const {params:{other}={}} = this.props.match;
    if(other === 'new'){
      this.showModel('刷卡建档')
    }

    this.props.dispatch({
      type:'staff/get_user_index',
    })
  }

  componentWillUnmount() {
  }

  showModel = (data) => {
    const {dispatch} = this.props;
    const authority = getAuthority();
    // 'therapist', 'tester', 'doctor'
    const pathMap = {

      '病历信息':{
        page:{
          tester:'/medical-record/tester-case-done',
          doctor:'/medical-record/doctor-case',
        },

      },
      '检测':{
        page:{
          tester:'/medical-record/tester-case',
          doctor:'/medical-record/tester-case',
        },

      },
      '复诊':{
        page:{
          tester:'/medical-record/tester-case',
          doctor:'/medical-record/doctor-case-done',
        },

      },
      '治疗':{
        page:{
          therapist:'/medical-record/therapist-case',
        },
      },
      '治疗方案':{
        page:{
          tester:'/medical-record/tester-case',
          doctor:'/medical-record/doctor-case',
        },

      },
    };
    if (data === '刷卡建档') {
      this.setState({
        cardVerifyStatus:1,
        card_no_input:'',
      },()=>{

        setTimeout(()=>{
          // document.getElementById('card_no_id').focus();
          this.card_no_ref.focus();
        },100)

      });
      // setTimeout(() => {
      //
      // },1500);
    } else if(['病历信息','检测','复诊','治疗方案'].indexOf(data)!==-1){
      router.jump({
        dispatch,
        pathname: pathMap[data].page[authority],
        payload:pathMap[data].payload,
      });
    }else if(data==='治疗'){
      router.jump({
        dispatch,
        pathname: pathMap[data].page[authority],
        payload:pathMap[data].payload,
      });
    }else{
      message.error('出错了');
    }
  };

  handleCancel = () => {
    this.setState({
      cardVerifyStatus:0,
      card_no_input:'',
    });
  };

  onChangeOfCard = (event)=>{
    this.setState({
      card_no_input:event.target.value,
    })

  };

  cardRender() {
    const {cardVerifyStatus,card_no_input='',cardInfo:{card_no,card_price,card_type}={}} = this.state;

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
        <Button type="primary" onClick={this.continue}>
          继续
        </Button>
      </div>
    ):null;
  }

  continue = () => {
    const {dispatch} = this.props;
    router.jump({
      dispatch,
      pathname: '/patient/patient-own-file',
    });
  };


  benchCard(params) {
    const {description, icon, picture , amount, highlight} = params;
    return (
      <div className={styles.cardMain}>
        <img className={styles.cardBackImg} src={picture} alt="" />
        <div className={
          classnames({
            [`${styles.cardList}`]: highlight,
            [`${styles.cardList1}`]: !highlight,
            [`${styles.card}`]: true,
          })
        }
        />
        <div className={styles.cardCon} onClick={() => highlight && this.showModel(description)}>
          <div className={styles.cardCenton}>
            <img src={icon} alt="" />
            <p className={styles.cardTitle}>{description}</p>
          </div>
           {amount-0 > 0 ? <div className={styles.headCount}>{amount}</div> : null}
        </div>
      </div>
    );
  }

  checkCard = ({card_no,callback})=>{
    request(urls.check_evaluate_card, {
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

  onKeyDownOfCard = (event)=>{
    const {dispatch} = this.props;
    const {card_no_input=''} = this.state;
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

          localStorage.setItem(storageKeys.card_no,card_no);
          this.setState({ cardInfo:{card_no,card_price} },()=>{
            this.setState({ cardVerifyStatus:2 })
          });

        }});
    }
  };

  quick = (type)=>{
    const {dispatch} = this.props;
    if(type===0){
      window.open('http://tieba.baidu.com/p/2213298277?traceid=');
    }else if(type===1){
      router.jump({
        dispatch,
        pathname:`/scale/first-scale`,
      })
    }else if(type===2){
      message.error('开发中...');
    }else if(type===3){
      window.open('https://tieba.baidu.com/p/2627223035');
    }
  };

  render() {

    // [{'function_name':'刷卡建档','function_available':0(0不可用，1可用),'function_number':0(0不显示阳角标)}...]

    const {cardVerifyStatus} = this.state;

    const {staff:{functions=[],stats=[]}={}} = this.props;

    return (
      <PageHeaderLayout >
        <Row gutter={24} className={styles.mainPage}>
          <div className={styles.con}>
            <div className={styles.leftCol}>
              <Card title="工作台">
                <Row>
                  <Col span={7}>{
                    this.benchCard({
                      description:'刷卡建档',
                      icon:images.skjdIcon,
                      picture:images.shuaKaJianDang,
                      amount:functions[0]?functions[0].function_number||0:0,
                      highlight:functions[0]?functions[0].function_available||0:0,
                    })}
                  </Col>
                  <Col span={1} className={styles.line}>
                    <img className={styles.lineImg} src={images.bo} alt="" />
                  </Col>
                  <Col span={8}>{
                    this.benchCard({
                      description:'检测',
                      icon:images.jcIcon,
                      picture:images.jianCe,
                      amount:functions[1]?functions[1].function_number||0:0,
                      highlight:functions[1]?functions[1].function_available||0:0,
                    })}
                  </Col>
                  <Col span={1} className={styles.line}>
                    <img className={styles.lineImg1} src={images.bo} alt="" />
                  </Col>
                  <Col span={7}>{
                    this.benchCard({
                      description:'病历信息',
                      icon:images.blxxIcon,
                      picture:images.bingLiXinXi,
                      amount:functions[2]?functions[2].function_number||0:0,
                      highlight:functions[2]?functions[2].function_available||0:0,
                    })}
                  </Col>
                  <Col span={7} className={styles.line2}>
                    <img className={styles.lineImg2} src={images.xuJianTou} alt="" />
                  </Col>
                  <Col offset={1} span={8} className={styles.line3}>
                    <img src={images.xuJianTouDown} alt="" />
                  </Col>
                  <Col offset={1} span={7} className={styles.line1}>
                    <img src={images.bo} alt="" />
                  </Col>

                  <Col span={7}>{
                    this.benchCard({
                      description:'复诊',
                      icon:images.fzIcon,
                      picture:images.fuZhen,
                      amount:functions[3]?functions[3].function_number||0:0,
                      highlight:functions[3]?functions[3].function_available||0:0,
                    })}
                  </Col>
                  <Col offset={1} span={8}>{
                    this.benchCard({
                      description:'治疗',
                      icon:images.zlIcon,
                      picture:images.zhiLiao,
                      amount:functions[4]?functions[4].function_number||0:0,
                      highlight:functions[4]?functions[4].function_available||0:0,
                    })}
                  </Col>

                  <Col span={1} className={styles.line}>
                    <img className={styles.lineImg1} src={images.bo} alt="" />
                  </Col>

                  <Col span={7}>{
                    this.benchCard({
                      description:'治疗方案',
                      icon:images.zlfaIcon,
                      picture:images.zhiLiaoFangAn,
                      amount:functions[5]?functions[5].function_number||0:0,
                      highlight:functions[5]?functions[5].function_available||0:0,
                    })}
                  </Col>
                </Row>
              </Card>
            </div>
            <div className={styles.rightCol}>
              <Card title="便捷导航">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className={styles.convenientNav} onClick={()=>this.quick(0)}>
                      <img src={images.zhiShiFenXiang} alt="" />
                      <p>知识分享</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.convenientNav} onClick={()=>this.quick(1)}>
                      <img src={images.liangBiao} alt="" />
                      <p>量表</p>
                    </div>
                  </Col>
                </Row>
                <Row gutter={16} style={{marginTop:'20px'}}>
                  <Col span={12}>
                    <div className={styles.convenientNav} onClick={()=>this.quick(2)}>
                      <img src={images.gongZuoTongJi} alt="" />
                      <p>工作统计</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.convenientNav} onClick={()=>this.quick(3)}>
                      <img src={images.taoLunZu} alt="" />
                      <p>讨论组</p>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </Row>

        <ModalDiy
          title="刷卡建档"
          wrapClassName="vertical-center-modal"
          visible={cardVerifyStatus===1||cardVerifyStatus===2}
          footer={null}
          onCancel={this.handleCancel}
          bodyStyle={{ textAlign: 'center' }}
          width="360px"
        >
          {this.cardRender()}
        </ModalDiy>

      </PageHeaderLayout>
    );
  }
}
