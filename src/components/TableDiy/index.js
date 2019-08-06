import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class TableDiy extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const { data={}, loading, columns,rowKey, ...restProps } = this.props;
    const { list = [], pagination={} } = data;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          // rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...restProps}
        />
      </div>
    );
  }
}

export default TableDiy;
