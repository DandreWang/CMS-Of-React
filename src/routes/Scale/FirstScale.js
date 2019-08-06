import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List,Input,Row,Col,Modal,Tabs,Radio,Select,Checkbox,Form } from 'antd';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModalDiy from 'components/ModalDiy';

import styles from './HospitalScale.less';
import request from '../../utils/request';
import { urls } from '../../utils/urls';
import { message } from 'antd/lib/index';
import {images} from '../../utils/images';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const Option = Select.Option;


@connect(() => ({
}))
@Form.create()

export default class HospitalScale extends PureComponent {

  state = {
    visible:false,
    value:false,
    value1:false,
    value2:false,
    isDel:false,
    delId:'',

    list:[],
    loading:true,
  };

  componentDidMount() {
    this.questionnaire_form_list_simple();
  }

  questionnaire_form_list_simple = (body={}) => {

    this.setState({loading:true});

    request(urls.questionnaire_form_list_simple, {
      body,
      success: list => {
        this.setState({ list });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });

  };

  //编辑卡片
  editCard = () =>{
    this.setState({
      visible: true,
    })
  };
  //删除卡片
  deleteCard = (id) =>{
    this.setState({
      isDel: true,
      delId: id,
    })
  };

  //暂时关闭弹出框
  handleOk = () =>{
    this.setState({
      visible: false,
    })
  };

  //确认删除
  delOk = () =>{
    this.props.dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
        id: this.state.delId,
      },
    });
    this.setState({
      isDel: false,
    })
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  onChange1 = (e) => {
    this.setState({
      value1: e.target.value,
    });
  };
  onChange2 = (e) => {
    this.setState({
      value2: e.target.value,
    });
  };

  handleSearch = (e) =>{
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (!err){
        this.questionnaire_form_list_simple(fieldsValue);
      }
    });
  };

  render() {
    const { list = [], loading } = this.state;
    const { getFieldDecorator } = this.props.form;

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const radioStyle1 = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };

    return (
      <PageHeaderLayout>

        <div className={styles.search}>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row>
              <Col span={8}>
                <FormItem label="量表名称:">
                  {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={4}>
                <Button type="primary" htmlType="submit">搜索</Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            // dataSource={['', ...list]}
            renderItem={(item,index) =>
              item ? (
                <List.Item key={item.id}>
                  <Card className={styles.card}>
                    <Card.Meta
                      // avatar={<Icon type="book" style={{color:['#95e4ff','#88BBFF','#DB8EFF','#55FFD8'][index%4],fontSize:24}} />}
                      avatar={<img alt="" className={styles.cardAvatar} src={images[`scale${index%5+1}`]} />}
                      title={<span>{item.name}</span>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description||'这里展示首访相关的描述信息...'}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新增产品
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <ModalDiy
          title="量表编辑"
          bodyStyle={{ height: '500px', overflow: 'scroll',padding: '0' }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          width='816px'
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              保存
            </Button>,
          ]}
        >
          <Row className={styles.mainTab}>
            <Col span={14} className={styles.colTab}>
              <Tabs defaultActiveKey="2">
                <TabPane tab="数据" key="1">
                  数据
                </TabPane>
                <TabPane tab="编辑" key="2">
                  <div className={styles.setPaneForm}>
                    <Input defaultValue='汉密尔顿抑郁量表' />
                    <TextArea autosize={{minRows:4,maxRows:12}} defaultValue='可用于抑郁症、躁郁症、神经症等多种疾病的抑郁症状之评定，尤其适用于抑郁症。' />
                  </div>
                  <div className={styles.setPaneForm}>
                    <h4>焦虑心境</h4>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                      <Radio style={radioStyle} value={1}>无症状</Radio>
                      <Radio style={radioStyle} value={2}>轻</Radio>
                      <Radio style={radioStyle} value={3}>中等</Radio>
                      <Radio style={radioStyle} value={4}>重</Radio>
                      <Radio style={radioStyle} value={4}>极重</Radio>
                    </RadioGroup>
                  </div>
                  <div className={styles.setPaneForm}>
                    <div className={styles.title}>
                      <h4>记忆或注意障碍</h4>
                      <Icon type="delete" />
                    </div>
                    <RadioGroup onChange={this.onChange1} value={this.state.value1}>
                      <Radio style={radioStyle} value={1}>无症状</Radio>
                      <Radio style={radioStyle} value={2}>轻</Radio>
                      <Radio style={radioStyle} value={3}>中等</Radio>
                      <Radio style={radioStyle} value={4}>重</Radio>
                      <Radio style={radioStyle} value={5}>极重</Radio>
                    </RadioGroup>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col span={10} className={styles.colTab1}>
              <Tabs type="card" defaultActiveKey="2">
                <TabPane tab="添加字段" key="1">添加字段</TabPane>
                <TabPane tab="编辑字段" key="2">
                  <div className={styles.mainEdit}>
                    <h4>标题</h4>
                    <Input defaultValue='记忆或注意障碍' />
                  </div>
                  <div className={styles.mainEdit}>
                    <h4>选项</h4>
                    <RadioGroup onChange={this.onChange2} value={this.state.value2}>
                      <Radio style={radioStyle1} value={1}>
                        <Input defaultValue='无症状' />
                        <Select defaultValue="0">
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                        </Select>
                        <Icon type="plus-circle-o" />
                        <Icon type="minus-circle-o" />
                      </Radio>
                      <Radio style={radioStyle1} value={2}>
                        <Input defaultValue='轻' />
                        <Select defaultValue="0">
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                        </Select>
                        <Icon type="plus-circle-o" />
                        <Icon type="minus-circle-o" />
                      </Radio>
                      <Radio style={radioStyle1} value={3}>
                        <Input defaultValue='中等' />
                        <Select defaultValue="0">
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                        </Select>
                        <Icon type="plus-circle-o" />
                        <Icon type="minus-circle-o" />
                      </Radio>
                      <Radio style={radioStyle1} value={4}>
                        <Input defaultValue='重' />
                        <Select defaultValue="0">
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                        </Select>
                        <Icon type="plus-circle-o" />
                        <Icon type="minus-circle-o" />
                      </Radio>
                      <Radio style={radioStyle1} value={5}>
                        <Input defaultValue='极重' />
                        <Select defaultValue="0">
                          <Option value="0">0</Option>
                          <Option value="1">1</Option>
                        </Select>
                        <Icon type="plus-circle-o" />
                        <Icon type="minus-circle-o" />
                      </Radio>
                    </RadioGroup>
                  </div>
                  <div className={styles.mainEdit}>
                    <h4>校验</h4>
                    <Checkbox >必填</Checkbox>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </ModalDiy>
        <ModalDiy
          title="量表删除"
          visible={this.state.isDel}
          onOk={this.delOk}
          onCancel={this.delOk}
        >
          <p>确定删除！</p>
        </ModalDiy>
      </PageHeaderLayout>
    );
  }
}
