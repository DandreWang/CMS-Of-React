import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Checkbox,
  Tree,
  Modal,
  DatePicker,
  Tooltip,
  Button,
  Menu,
  Dropdown,
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

import styles from './Authorization.less';
const TreeNode = Tree.TreeNode;

const treeData = [{
  title: '病历管理',
  key: '1',
  children: [{
    title: '所有患者信息',
    key: '1-1',
    children: [
      { title: '测评信息', key: '1-1-1' },
      { title: '治疗信息', key: '1-1-2' },
      { title: '诊断信息', key: '1-1-3' },
    ],
  }],
}, {
  title: '报表管理',
  key: '2',
  children: [
    { title: '全局统计', key: '2-1' },
    { title: '流水统计', key: '2-2' },
    { title: '开单情况汇总', key: '2-3' },
  ],
}, {
  title: '量表管理',
  key: '3',
  children: [
    { title: '医院对应关系管理', key: '3-1' },
    { title: '科室对应关系管理', key: '3-2' },
    { title: '平台量表管理', key: '3-3' },
  ],
}, {
  title: '报表管理',
  key: '4',
  children: [
    { title: '全局统计', key: '4-1' },
    { title: '流水统计', key: '4-2' },
    { title: '开单情况汇总', key: '4-3' },
  ],
}, {
  title: '量表管理',
  key: '5',
  children: [
    { title: '医院对应关系管理', key: '5-1' },
    { title: '科室对应关系管理', key: '5-2' },
    { title: '平台量表管理', key: '5-3' },
  ],
}];

@connect(({ }) => ({
}))
export default class MsgRecordManage extends Component {
  state = {
    expandedKeys: [],
    defaultExpandAll: true,
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    checked: false,
    checked1: false,
    checked2: false,

  };
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  roleTree = (e) =>{
    let Key = e.target.checked ? ['1','2','3'] : [];
    this.setState({
      checkedKeys : Key,
    });
  };

  onChangeRole = (e) =>{
    console.log(e.target.checked);
    this.setState({
      checked:e.target.checked,
      checked1:e.target.checked,
      checked2:e.target.checked,
    })
  };
  checked0 = (e) =>{
    this.setState({
      checked:e.target.checked,
    })
  };
  checked1 = (e) =>{
    this.setState({
      checked1:e.target.checked,
    })
  };
  checked2 = (e) =>{
    this.setState({
      checked2:e.target.checked,
    })
  };

  render() {
    const { checked ,checked1,checked2} = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <Row>
            <Col span={11}>
              <Card
                className={styles.cardStyle}
                title={<Checkbox onChange={this.onChangeRole}></Checkbox>}
                extra={<span>人员角色</span>}>
                <div className={styles.roleBox}>
                  <Checkbox disabled>医院管理员</Checkbox>
                </div>
                <div className={styles.roleBox}>
                  <Checkbox checked={checked} onChange={this.checked0}>医生</Checkbox>
                </div>
                <div className={styles.roleBox}>
                  <Checkbox checked={checked1} onChange={this.checked1}>治疗师</Checkbox>
                </div>
                <div className={styles.roleBox}>
                  <Checkbox checked={checked2} onChange={this.checked2}>测评师</Checkbox>
                </div>

              </Card>
            </Col>
            <Col span={2} className={styles.btnCenter}>
              {/*<Button className={styles.rightBtn}>*/}
                {/*<Icon type="right" />*/}
              {/*</Button>*/}
              <div className={styles.rightBtn}>
                <Icon type="right" />
              </div>
            </Col>
            <Col span={11}>
              <Card
                className={styles.cardStyle}
                title={<Checkbox onChange={this.roleTree}></Checkbox>}
                bodyStyle={{ height: '469px', overflow: 'auto' }}
                extra={<span>功能模块</span>}>
                <Tree
                  checkable
                  defaultExpandAll={this.state.defaultExpandAll}
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
              </Card>
            </Col>
          </Row>
          <div className={styles.buttomButton}>
            <Button type="primary">保存</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
