import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Select,
  Button,
  Radio,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;
import styles from './Success.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ success, loading }) => ({
  success,
  loading: loading.models.success,
}))
@Form.create()
export default class Answer extends PureComponent {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    optionsData :[
      {
        name: '',
        value: '',
      },{
        name: '',
        value: '',
      },{
        name: '',
        value: '',
      },
    ],
  };

  // 组件加载完成
  componentDidMount() {
    this.props.dispatch({
      type: 'success/fetch',
    });
  };

  componentWillReceiveProps(newProps){
    console.log("newProps",newProps.success);
    this.setState({
      optionsData: newProps.success.data,
    });
  }

  render() {
    const { success: { data }, loading } = this.props;
    const { optionsData } = this.state;

    // this.props.dispatch({
    //   type: 'list/getSuccessList',
    //   callback: (data) => {
    //     this.setState({
    //       optionsData: data,
    //     });
    //     console.log('提交成功success',this.state.optionsData);
    //   }
    // });

    return (
      <PageHeaderLayout >

        <Card className={styles.radioStyle} loading={loading}>
          <DescriptionList size="large">
            {
              optionsData.map((data,index) => {
                return(
                  <Description  key={index} term={data.name}>{data.value}</Description>
                )
              })
            }
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
