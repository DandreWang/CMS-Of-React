import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Select,
  Button,
  Input,
  Collapse,
  DatePicker,
  Icon,
  Row,
  Col,
  Steps,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import Result from 'components/Result';
import {images} from '../../utils/images';
import styles from './PatientEvaluation.less';
import {deepClone} from "../../utils/dataHandler";

const { Description } = DescriptionList;
const { TextArea } = Input;
const Step = Steps.Step;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};
const formTextArea = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 21,
  },
};

const description = (
  <DescriptionList className={styles.headerList} size="small" col="4">
    <Description term="姓名">曲丽丽</Description>
    <Description term="年龄">23</Description>
    <Description term="性别">男</Description>
    <Description term="身高">170</Description>
    <Description term="体重">45</Description>
  </DescriptionList>
);

const dotStyle = ['dotOrange', 'dotPurple', 'dotBlue'];

const extra = (
  <div className={styles.listContent}>
    <h3>检测结果</h3>
    <ul>
      <li className={dotStyle[0]}>疾病流程: 冠心病-心绞痛型</li>
      <li className={dotStyle[1]}>量表: 脑功能状态中度偏离</li>
      <li className={dotStyle[2]}>仪器: 脑功能状态中度偏离</li>
    </ul>
  </div>
);
const actions = (
  <Fragment>
    <Button type="primary">返回列表</Button>
    <Button>查看报告</Button>
  </Fragment>
);

@connect(({ success, loading }) => ({
  success,
  loading: loading.models.success,
}))
@Form.create()
export default class PatientEvaluation extends PureComponent {

  state = {
    current: 0,
    key: 1,
    thirtFormData: [
      {
        title: "量表检测",
        name: "广泛性焦虑量表",
        key: 0,
      },
      {
        title: "量表检测",
        name: "广泛性焦虑量表",
        key: 1,
      },
    ],
  };

  // 组件加载完成
  componentDidMount() {
    this.props.dispatch({
      type: 'success/fetch',
    });
  };

  componentWillReceiveProps(newProps){
    this.setState({
      optionsData: newProps.success.data,
    });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('表单信息', values);
        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  delList = (key) =>{
    console.log('下标',key);
    const items = this.state.thirtFormData;
    const nList = deepClone(items);
    nList.splice(key,1);
    this.setState({
      thirtFormData: nList,
    });
  };
  addList = () =>{
    const {key, thirtFormData: items = []} = this.state;
    const nList = deepClone(items);
    nList.push(
      {
        title: "量表检测",
        name: "广泛性焦虑量表",
        key: key + 1,
      },
    );
    this.setState({
      thirtFormData: nList,
      key: key + 1,
    });
  };

  // 第一个步骤界面
  firstStep(){
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.mainForm}>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem {...formItemLayout} label="发作频次">
              {getFieldDecorator('frequencies', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="发作时间">
              {getFieldDecorator('frequenciesTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<DatePicker />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="严重程度">
              {getFieldDecorator('degree', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<DatePicker />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formTextArea} label="症状描述">
              {getFieldDecorator('symptom', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<TextArea autosize={{minRows:4,maxRows:12}} placeholder="请输入" />)}
            </FormItem>

            <FormItem
              style={{ marginTop: 32 }}
              wrapperCol={{ span: 18, offset: 2 }}
            >
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <a onClick={() => this.next()}>
                跳过
              </a>
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
  // 第二个步骤界面
  sencondStep (){
    return(
      <div className={styles.sencondMainForm}>
        <h4>仪器检测</h4>
        <Row>
          <Col span={3}>
            <div className={styles.itemTest}>
              <Icon type="heart-o" /> 心电图检测
            </div>
          </Col>
          <Col span={6}>
            <Button>开始检测</Button>
          </Col>
        </Row>
      </div>
    )
  }
  // 第三个步骤界面
  thirtStep(){
    const { thirtFormData } = this.state;
    return(
      <div className={styles.thirtMainForm}>
        <h4>量表检测</h4>
        {
          thirtFormData.map((item,index) =>(
            <div className={styles.thirtFormList} key={item.key}>
              <Row gutter={4}>
                <Col span={5}>
                  {/* <div className={styles.itemTest1}> */}
                  {/* {item.name} */}
                  {/* </div> */}
                  <Select defaultValue="1">
                    <Option value="1">广泛性焦虑量表</Option>
                    <Option value="2">广泛性焦虑量表1</Option>
                    <Option value="3">广泛性焦虑量表2</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <Button>查看结果</Button>
                  <Button onClick={() =>this.delList(index)}>删除</Button>
                </Col>
              </Row>
            </div>
          ))
        }

        {/*<div className={styles.thirtFormList}>*/}
          {/*<Row gutter={4}>*/}
            {/*<Col span={5}>*/}
              {/*<div className={styles.itemTest}>*/}
                {/*简易智能精神状态量表*/}
              {/*</div>*/}
            {/*</Col>*/}
            {/*<Col span={3}>*/}
              {/*<Button>开始检测</Button>*/}
            {/*</Col>*/}
            {/*<Col span={6}>*/}
              {/*<Button>删除</Button>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        {/*</div>*/}
        <div className={styles.addCard} onClick={this.addList}>
          <Icon type="plus" /> <span>添加检测量表 (需刷卡)</span>
        </div>
      </div>
    )
  }
  // 第四个步骤界面
  fourStep(){
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.fourMainForm}>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="生物学纬度" key="1">
            <div className={styles.fourMainContent}>
              <h3>1.1 医学检查</h3>
              <div className={styles.qualityTest}>
                <div className={styles.title}>
                  <label>(1) 血液检查(血脂、血糖)：</label>
                  <span>（正常 > 严重异常）</span>
                </div>
                <div className={styles.listNumber}>
                  <ul>
                    <li>1</li>
                    <li>
                      <p>2</p>
                    </li>
                    <li>3</li>
                    <li>4</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.fourMainContent}>
              <h3>1.1 医学检查</h3>
              <div className={styles.qualityTest}>
                <div className={styles.title}>
                  <label>(1) 血液检查(血脂、血糖)：</label>
                  <span>（正常 > 严重异常）</span>
                </div>
                <div className={styles.listNumber}>
                  <ul>
                    <li>
                      1
                    </li>
                    <li>
                      <p>2</p>
                    </li>
                    <li>3</li>
                    <li>4</li>
                  </ul>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }

  // 第五个步骤界面
  fiveStep(){
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div className={styles.fiveMainForm}>
        <Result
          type="success"
          title="提交成功"
          description="患者可前往诊断并获取治疗方案"
          extra={extra}
          actions={actions}
          style={{ marginTop: 48, marginBottom: 16 }}
        />
      </div>
    )
  }


  render() {

    return null;

    const { success: { data }, loading,form } = this.props;
    const { current } = this.state;

    const steps = [{
      title: '填写主诉',
      content: this.firstStep(),
    }, {
      title: '仪器检测',
      content: this.sencondStep(),
    }, {
      title: '量表检测',
      content: this.thirtStep(),
    }, {
      title: '首访信息',
      content: this.fourStep(),
    }, {
      title: '完成',
      content: this.fiveStep(),
    }];

    const showBtn = (
      <div className={styles.bottomBtn}>
        <Button onClick={() => this.prev()}>上一步</Button>
        <Button type='primary' onClick={() => this.next()}>提交</Button>
      </div>
    );

    const isShowBottomBtn = (current !==0 && current !==4) ?  showBtn : '';

    return (
      <PageHeaderLayout
        title="编号：234231029431"
        logo={
          <img alt="" src={images.treatTitle} />
        }
        content={description}>
        <Card>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>

          <div className={styles['steps-content']}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              {steps[current].content}
            </Form>
            {isShowBottomBtn}
          </div>

        </Card>

      </PageHeaderLayout>
    );
  }
}
