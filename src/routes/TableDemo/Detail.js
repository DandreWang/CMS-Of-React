import React, { PureComponent } from 'react';
import { Form, Input, Tooltip, Icon, Card, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import { connect } from 'dva/index';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {router}from '../../utils/router';
import { tableHandler } from '../../utils/tableHandler';
import { dataHandler } from '../../utils/dataHandler';
import styles from './Detail.less';

const FormItem = Form.Item;
const { Description } = DescriptionList;
const dirNameFirstLetterLower = 'tableDemo';
@connect(({tableDemo,loading}) => ({
  tableDemo,
  loading:loading.models[dirNameFirstLetterLower]
}))
@Form.create()
export default class RegistrationForm extends React.Component {
  state = {};
  componentDidMount(){
    const {location, dispatch,match:{params:{id}}} = this.props;
    tableHandler.info({
      dispatch,
      dirNameFirstLetterLower,
      payload:{id},
    })
  }

  edit(){
    const { dispatch,match:{params:{id}}} = this.props;
    tableHandler.jump({
      dispatch,
      record:{id},
      page:'edit',
      dirNameFirstLetterLower,
      jumpType:'replace',
    })
  }

  render() {
    const { tableDemo: { data }, loading } = this.props;
    const {list=[]} = data;
    const {id,name,sex,doctor,visitAt,description} = list[0]||{};
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="用户信息"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="编号">{id}</Description>
            <Description className={styles.infoItem} term="姓名">{name}</Description>
            <Description className={styles.infoItem} term="性别">{sex}</Description>
            <Description className={styles.infoItem} term="测评师">{doctor}</Description>
            <Description className={styles.infoItem} term="来访时间">{visitAt}</Description>
            <Description className={styles.infoItem} term="描述">{description}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}


