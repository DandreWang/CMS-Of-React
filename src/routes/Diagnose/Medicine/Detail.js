import React, { PureComponent } from 'react';
import { Form, Input, Tooltip, Icon, Card, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import { connect } from 'dva/index';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {router} from '../../../utils/router';
import { tableHandler } from '../../../utils/tableHandler';
import { dataHandler } from '../../../utils/dataHandler';
import styles from './Detail.less';
import request from '../../../utils/request';
import { urls } from '../../../utils/urls';
import { message } from 'antd/lib/index';

const FormItem = Form.Item;
const { Description } = DescriptionList;
let id;
@connect(() => ({
}))
@Form.create()
export default class RegistrationForm extends React.Component {
  state = {
    loading:true,
    detail:{},
  };
  componentDidMount(){
    const {params={}} = this.props.match;
    id = params.id;
    this.admin_medicine_get();
  }



  // common_status_detail = (use_type) => {
  //
  //   request(urls.common_status_detail, {
  //     body: {name:'分类-药物服用方式'},
  //     success: data => {
  //       try{
  //         const {detail={}} = this.state;
  //         const d = dataHandler.deepClone(detail);
  //         d.use_type = data[use_type];
  //         this.setState({detail:d})
  //       }catch (e) {
  //
  //       }
  //     },
  //     fail: errmsg => {
  //       message.error(errmsg || '获取失败');
  //     },
  //     complete: () => {
  //       this.setState({loading:false});
  //     },
  //   });
  // };

  admin_medicine_get = () => {

    this.setState({loading:true});

    request(urls.admin_medicine_get, {
      body: {id},
      success: detail => {
        this.setState({ detail });
        // this.common_status_detail(detail.use_type+'');
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({loading:false});
      },
    });
  };

  edit(){
    const { dispatch} = this.props;
    router.jump({
      dispatch,
      pathname:`/diagnose/medicine-edit/${id}`,
      operator:'replace',
    })
  }

  render() {
    const { detail={}, loading } = this.state;
    const {code,name,use_typeName,create_worker_account_id_account_name,modify_worker_account_id_account_name,hospital_id_name,create_time,modify_time} = detail||{};
    let create_time_str='',modify_time_str='';
    try{
      create_time_str = moment(create_time).format('YYYY-MM-DD');
      modify_time_str = moment(modify_time).format('YYYY-MM-DD');
    }catch (e) {
      create_time_str = '';
      modify_time_str = '';
    }
    return (
      <PageHeaderLayout wrapperClassName={styles.wrapperClassName}>
        <Card
          loading={loading}
          title="药物详情"
          className={styles.infoWrap}
          bordered={false}
          extra={<a href="javascript:void(0);" onClick={()=>this.edit()}>编辑</a>}
        >
          <DescriptionList
            size="small"
            className={styles.infoList}
            col={3}
          >
            <Description className={styles.infoItem} term="药物编码">{code}</Description>
            <Description className={styles.infoItem} term="药物名称">{name}</Description>
            <Description className={styles.infoItem} term="服用方式">{use_typeName}</Description>
            {/*<Description className={styles.infoItem} term="创建人员">{create_worker_account_id_account_name}</Description>*/}
            {/*<Description className={styles.infoItem} term="修改人员">{modify_worker_account_id_account_name}</Description>*/}
            {/*<Description className={styles.infoItem} term="所属医院">{hospital_id_name}</Description>*/}
            {/*<Description className={styles.infoItem} term="创建时间">{create_time_str}</Description>*/}
            {/*<Description className={styles.infoItem} term="修改时间">{modify_time_str}</Description>*/}
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}


