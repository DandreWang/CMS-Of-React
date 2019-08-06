import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class TableDiy2 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    const { data=[], columns,rowKey, ...restProps } = this.props;


    return (
      <div className={styles.standardTable2}>
        <Table
          rowKey={rowKey || 'key'}
          dataSource={data}
          columns={columns}
          pagination={false}
          size='small'
          {...restProps}
        />
      </div>
    );
  }
}

export default TableDiy2;
