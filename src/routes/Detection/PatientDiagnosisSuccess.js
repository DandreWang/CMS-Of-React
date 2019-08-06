import React, { Fragment, Component } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from 'components/Result';
import ButtonSimple from 'components/Button';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { router } from '../../utils/router';
import { connect } from 'dva/index';

class Action extends Component {

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
              pathname: `/patient/synthesis/${case_id}`,
              newTab:true,
            });
          }}
        >
          查看报告
        </Button>
      </Fragment>
    );
  }
}

@connect(({}) => ({}))
export default class SuccessDiy extends Component {

  componentDidMount() {

  };

  render() {

    // console.log('state', this.props.location.state);
    // console.log('query', this.props.location.query);
    // console.log('id', this.props.match.params);
    const { match: { params:{case_id} = {} } = {} } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Result
            type="success"
            title="保存成功"
            description={`已更新对患者的诊断描述`}
            actions={<Action dispatch={this.props.dispatch} case_id={case_id} />}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
        {/*<Card bordered={false}>*/}
        {/*<Result*/}
        {/*type="success"*/}
        {/*title="提交成功"*/}
        {/*description="提交结果页用于反馈一系列操作任务的处理结果，*/}
        {/*如果仅是简单操作，使用 Message 全局提示反馈即可。*/}
        {/*本文字区域可以展示简单的补充说明，如果有类似展示*/}
        {/*“单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"*/}
        {/*extra={extra}*/}
        {/*actions={actions}*/}
        {/*style={{ marginTop: 48, marginBottom: 16 }}*/}
        {/*/>*/}
        {/*</Card>*/}
      </PageHeaderLayout>
    );
  }
}
