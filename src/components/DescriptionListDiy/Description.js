import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'antd';
import styles from './index.less';
import responsive from './responsive';

const Description = ({ term, column,termclass,detailclass, className, children, ...restProps }) => {
  const clsString = classNames(styles.description, className);
  const termString = classNames(styles.term,termclass);
  const detailString = classNames(styles.detail,detailclass);
  return (
    <Col className={clsString} {...responsive[column]} {...restProps}>
      {term && <div className={termString}>{term}</div>}
      {children && <div className={detailString}>{children}</div>}
    </Col>
  );
};

Description.defaultProps = {
  term: '',
};

Description.propTypes = {
  term: PropTypes.node,
};

export default Description;
