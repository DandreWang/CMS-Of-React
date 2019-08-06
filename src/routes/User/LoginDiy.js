import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert,message } from 'antd';
import Login from 'components/LoginDiy';
import styles from './LoginDiy.less';

const { Password, Submit, UserName } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
        fail:(errmsg)=>{
          message.error(errmsg||'登录失败');
        },
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <div key="account">
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="account_name" placeholder="请输入用户名" rules={[{ required: true, message: '请输入用户名' }]} />
            <Password name="account_pwd" placeholder="请输入密码" rules={[{ required: true, message: '请输入密码' }]} />
          </div>

          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other} />
        </Login>
      </div>
    );
  }
}
