import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Button, Row } from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import DescriptionList from 'components/DescriptionListDiy';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {images} from '../../utils/images';
import styles from './Treatment.less';
import { router } from '../../utils/router';

const { Description } = DescriptionList;

@connect(({ success, loading }) => ({
  success,
  loading: loading.models.success,
}))
@Form.create()
export default class Synthesis extends PureComponent {
  state = {
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'success/fetch',
    });
  }

  componentWillReceiveProps() {
  }

  // 患者信息
  description = () => {
    const personalDetail = {
      name: '刘士宇',
      sex: '男',
      age: 27,
      height: 175,
      weight: 55,
    }
    // const { patientTest: {personalDetail = {}} = {} } = this.props;
    return (
      <DescriptionList className={styles.headerList} size="small" col="4">
        <Description term="姓名">{personalDetail.name}</Description>
        <Description term="性别">{personalDetail.sex}</Description>
        <Description term="年龄">{`${personalDetail.age}岁`}</Description>
        <Description term="身高">{`${personalDetail.height}cm`}</Description>
        <Description term="体重">{`${personalDetail.weight}kg`}</Description>
      </DescriptionList>
    );
  };


  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout
        contentStyle={{marginBottom:72}}
        title='编号：2018000'
        logo={
          <img alt="" src={images.treatTitle} />
        }
        content={this.description()}
      >
        <Card bordered={false} loading={loading} className={styles.con}>
          <div className={styles.time}>治疗时间：2018-08-16 16:24</div>
          <Card type="inner" title="经颅磁刺激治疗" extra="7/20" className={styles.cardItem}>
            <DescriptionList className={styles.cardItemCon} size="small" col="1">
              <Description term="磁感应强度" termclass={styles.termStyle}>1档（低档）：3mT~5mT</Description>
            </DescriptionList>
            <DescriptionList className={styles.cardItemCon} size="small" col="1">
              <Description term="治疗时间" termclass={styles.termStyle}>60分钟</Description>
            </DescriptionList>
            <DescriptionList className={styles.cardItemCon} size="small" col="1">
              <Description term="震动幅度" termclass={styles.termStyle}>三档</Description>
            </DescriptionList>
          </Card>
          <Card type="inner" title="精神分析治疗" extra="7/20" className={styles.cardItem}>
            <DescriptionList className={styles.cardList} size="small" col="1">
              <Description term="治疗情况" termclass={styles.termStyle}>
                <span className={styles.listContentItem}>
                  (1)有所焦虑：庞大的河马身居狭小浅水之中，表现出了某种不协调。<br />
                  (2)有所冲突：焦虑的河马，张开大口朝向蠢蠢欲动的蛇。<br />
                  (3)有所牺牲：艾伦在左边摆放了一个祭坛，可能代表了某种童年或以往的创伤性经历。艾伦初始沙盘的左上方以上都可看做是艾伦在其初始沙盘中所表现出来的“受伤的主题”，反映着促使艾伦开始其沙盘游戏分析时的基本心理状态。同时，我们也可以从艾伦的初始沙盘中看到这样的象征与表现。<br />
                  (4)有所期待：左下角的水车，期待着“水”；右上角的风车，期待着“风”；同时，艾伦在右下方留下了明显的印痕，也留下了右面（靠近沙盘游戏分析师）可利用的空间，实际上这也是留给其沙盘游戏心理分析的空间和机会。<br />
                </span>
              </Description>
            </DescriptionList>
            <DescriptionList className={styles.cardList} size="small" col="1">
              <Description term="现场照片" termclass={styles.termStyle}>
                <span className={styles.listContentItem}>
                  <img src={images.treatimg} className={styles.img} alt="" />
                  <img src={images.treatimg} className={styles.img} alt="" />
                </span>
              </Description>
            </DescriptionList>
          </Card>
        </Card>
        {/*<FooterToolbar>*/}
          {/*<Button type="primary">导出</Button>*/}
          {/*<Button type="primary" className={styles.print}>打印</Button>*/}
        {/*</FooterToolbar>*/}
      </PageHeaderLayout>
    );
  }
}
