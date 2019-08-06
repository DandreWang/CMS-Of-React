import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import './index.less';

export default class ModalDiy extends PureComponent {
  componentDidMount() {

  }

  render() {
    const {...props} = this.props;
    return (
      <Modal {...props} wrapClassName="vertical-center-modal">
        {this.props.children}
      </Modal>
    );
  }
}
