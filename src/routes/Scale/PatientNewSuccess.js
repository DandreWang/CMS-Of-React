import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from 'components/Result';
import ButtonSimple from 'components/Button';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { router } from '../../utils/router';
import { connect } from 'dva/index';

class Action1 extends Component {
  render() {
    return (
      <Fragment>
        <ButtonSimple
          type='green'
          onClick={() => {
            const { dispatch } = this.props;
            router.jump({
              dispatch,
              pathname: '/workbench/staff',
            });
          }}
        >
          返回首页
        </ButtonSimple>
        <Button
          type="primary"
          onClick={() => {
            const { case_id, dispatch } = this.props;
            router.jump({
              dispatch,
              pathname: `/patient/patient-test/${case_id}`,
            });
          }}
        >
          开始检测
        </Button>
      </Fragment>
    );
  }
}

@connect(({}) => ({}))
export default class SuccessDiy extends Component {

  render() {

    // console.log('state', this.props.location.state);
    // console.log('query', this.props.location.query);
    // console.log('id', this.props.match.params);

    const { case_id, case_no } = this.props.match.params;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Result
            type="success"
            title="建档成功"
            description={`档案编号: ${case_no}`}
            actions={<Action1 dispatch={this.props.dispatch} case_id={case_id}/>}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
