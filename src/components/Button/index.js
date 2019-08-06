import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';

class Button extends Component{

  render(){
    const {buttonclass,type,onClick,children} = this.props;
    const buttonString = classNames(styles.button,buttonclass,{
      [styles.red]: type==='red',
      [styles.green]: type==='green',
    });
    return (
      <button type="button" onClick={onClick} className={buttonString}>
        <span>{children}</span>
      </button>
    )
  }
}


export default Button;
