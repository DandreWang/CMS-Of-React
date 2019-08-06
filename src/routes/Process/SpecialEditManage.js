import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Select,
  Table,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Checkbox,
  Dropdown,
  InputNumber,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SpecialEditManage.less';
import moment from 'moment/moment';
import { routerRedux } from 'dva/router';
import { tableHandler } from '../../utils/tableHandler';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ }) => ({
}))
export default class MsgRecordManage extends Component {
  state = {
    switch1: false,
    switch2: true,
    switch3: true,
    switch4: true,
    selectList: [
      {
        key: 1,
      }]
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  openSwitch1 = (key) =>{
    this.setState({
      switch1: key,
    })
  };
  openSwitch2 = (key) =>{
    this.setState({
      switch2: key,
    })
  };
  openSwitch3 = (key) =>{
    this.setState({
      switch3: key,
    })
  };
  openSwitch4 = (key) =>{
    this.setState({
      switch4: key,
    })
  };

  addList = () =>{
    console.log('33');
    let _list = this.state.selectList;
    _list.push(
      {
        key: 1,
      }
    );
    this.setState({
      selectList:_list,
    })
  };
  delList = (index) =>{
    let _list = this.state.selectList;
    _list.splice(index,1);
    this.setState({
      selectList:_list,
    })
  };

  save = () =>{
    let page = {
      name: '4',
      id: '3',
    };
    const id = 1;
    const name = 3;
    page = JSON.stringify(page);
    this.props.dispatch(routerRedux.push({
      pathname: `/patient/detection-success/${id}/${name}`,
      query: {
        id:1,
      },
    }));
  };

  renderSimpleInput = () => {
    return (
      <div className={styles.inputWrap}>
        <div className={styles.item}>
          <span className={styles.name}>流程名称:</span>
          <Input className={styles.input} placeholder="请输入" />
        </div>

        <div className={styles.item}>
          <span className={styles.name}>绑定金额:</span>
          <InputNumber min={1} className={styles.input} placeholder="请输入" />
        </div>

      </div>
    );
  };

  render() {

    const { selectList,switch1,switch2,switch3,switch4 } = this.state;
    return (
      <PageHeaderLayout>
        {this.renderSimpleInput()}
        <Card>
          <Row gutter={8}>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>主诉</label>
                  <Switch defaultChecked={switch1} onChange={this.openSwitch1} />
                </div>
                {switch1 ? <div /> : ''}
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>仪器检测</label>
                  <Switch defaultChecked onChange={this.openSwitch2} />
                </div>
                {
                  switch2 ?
                  (
                    <div>
                      <div className={styles.checkStyel}>
                        <Checkbox>脑电检测</Checkbox>
                      </div>
                      <div className={styles.checkStyel}>
                        <Checkbox>经颅磁刺激治疗</Checkbox>
                      </div>
                    </div>
                  ) : ''
                }
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>首访</label>
                  <Switch defaultChecked  onChange={this.openSwitch4}/>
                </div>
                {
                  switch4 ?
                    (
                      <div>
                        <div className={styles.selectStyle1}>
                          <Select defaultValue="1">
                            <Option value="1">冠心病问卷</Option>
                            <Option value="2">冠心病问卷1</Option>
                          </Select>
                        </div>
                      </div>
                    ) : ''
                }
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.mainCol}>
                <div className={styles.complaint}>
                  <label>量表检测</label>
                  <Switch defaultChecked  onChange={this.openSwitch3}/>
                </div>
                {
                  switch3 ?
                  (
                    <div>
                      {
                        selectList.map((item,index) =>(
                          <Row gutter={4} className={styles.selectStyle} key={index}>
                            <Col span={22}>
                              <Select defaultValue="1">
                                <Option value="1">简易智能精神状态量表</Option>
                                <Option value="2">简易智能精神状态量表1</Option>
                              </Select>
                            </Col>
                            <Col span={2} onClick={() => this.delList(index)}>
                              <Icon type="minus-circle-o" className={styles.icons}/>
                            </Col>
                          </Row>
                        ))
                      }
                      <div className={styles.addList} onClick={this.addList}>
                        <Icon type="plus-circle" />
                        <span>添加量表模版</span>
                      </div>
                    </div>
                  ) : ''
                }
              </div>
            </Col>
          </Row>
          <div className={styles.buttomButton}>
            <Button type="primary" onClick={this.save}>保存</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
