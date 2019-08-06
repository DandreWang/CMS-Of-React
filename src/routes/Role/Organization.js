import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Tree,
  Icon,
  Card,
  Tabs,
  Table,
  Modal,
  DatePicker,
  Tooltip,
  Button,
  Menu,
  Dropdown,
  Divider,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Organization.less';
import TableDiy from 'components/TableDiy';
import { tableHandler } from '../../utils/tableHandler';

const TreeNode = Tree.TreeNode;
const dirNameFirstLetterLower = 'tableDemo';

@connect(({ tableDemo, loading }) => ({
  tableDemo,
  loading: loading.models[dirNameFirstLetterLower],
}))
export default class MsgRecordManage extends Component {
  state = {

  };

  constructor(props) {
    super(props);
    this.columns/*todo*/ = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
      },
      {
        title: '测评师',
        dataIndex: 'doctor',
        align: 'center',
      },
      {
        title: '来访时间',
        dataIndex: 'visitAt',
        align: 'center',
        // sorter:true
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (text, record) => {
          const {status} = record||{};
          return (
            <div className="editable-row-operations">
              <Fragment>
                <a onClick={() => this.jump({ page: 'detail', record })}>查看</a>
                <Divider type="vertical"/>
                <a onClick={() => this.jump({ page: 'edit', record })}>编辑</a>
                {
                  status-0===0?(
                    <Fragment>
                      <Divider type="vertical" />
                      <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove({ record })}>
                        <a>删除</a>
                      </Popconfirm>
                    </Fragment>
                  ):null
                }
              </Fragment>
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.tableReload();
  }

  onSelect = (selectedKeys, e) => {
    const {selected, selectedNodes, node, event} = e;
    console.log('selected', selectedKeys, selected, selectedNodes, node, event);
    if(selected){
      this.tableReload();
    }
  };

  tableReload = ()=>{
    const { dispatch } = this.props;
    tableHandler.list({
      dirNameFirstLetterLower,
      dispatch,
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    tableHandler.handleTableChange({ pagination, filtersArg, sorter, page: this, dirNameFirstLetterLower });
  };

  jump = ({ page, record }) => {
    tableHandler.jump({
      page,
      record,
      dirNameFirstLetterLower,
      dispatch: this.props.dispatch,
    });
  };

  remove = ({ record }) => {
    tableHandler.remove({
      record,
      dirNameFirstLetterLower,
      dispatch: this.props.dispatch,
    });
  };

  render() {

    const { tableDemo: { data }, loading } = this.props;
    const columns = this.columns;

    return (
      <PageHeaderLayout>
        <Row>
          <Col span={6} className={styles.treeWrap}>
            <Tree
              showLine
              defaultExpandedKeys={['0-0-0','0-0-1','0-0-2']}
              onSelect={this.onSelect}
            >
              <TreeNode selectable={false} title="东方新世界" key="0-0">
                {
                  [1,1,1,1,1,1,1,1,1].map((v,i)=>{
                    return (
                      <TreeNode selectable={false} title="演示医院" key={`0-0-${i}`}>
                        <TreeNode title="心理科" key={`0-0-${i}-0`} />
                        <TreeNode title="心内科" key={`0-0-${i}-1`} />
                        <TreeNode title="心理科" key={`0-0-${i}-2`} />
                      </TreeNode>
                    )
                  })
                }
              </TreeNode>
            </Tree>
          </Col>
          <Col span={18} className={styles.tableWrap}>
            <TableDiy
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleTableChange}
              scroll={{ x: '130%' }} /*todo*/ //列数很多时才设置
            />
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
