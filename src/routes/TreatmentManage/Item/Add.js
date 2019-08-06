import React, { Fragment, PureComponent } from 'react';
import {
  Form,
  Input,
  Tooltip,
  InputNumber,
  Icon,
  Card,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker,
  TimePicker,
  message,
} from 'antd';
import { connect } from 'dva/index';
import { validateValues } from '../../../utils/validate';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { urls } from '../../../utils/urls';
import lodash from 'lodash';
import { tableHandler } from '../../../utils/tableHandler';
import moment from 'moment';
import styles from './AddEdit.less';
import request from '../../../utils/request';
import { router } from '../../../utils/router';
import { dataHandler } from '../../../utils/dataHandler';

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;

const item_properties_map = {
  '1': '单选框',
  '2': '数字输入框',
  '3': '单行文本',
  '4': '多行文本',
  '5': '图片',
};

@connect(() => ({}))
@Form.create()
export default class AnyClass extends React.Component {
  state = {
    item_type_all: {},
    items: [

    ],
    property_type:'1',
  };


  componentDidMount() {

    this.common_status_detail();
  }



  onChangeType = (property_type)=>{
    this.setState({
      property_type,
    })
  }

  addType = ()=>{
    const {property_type,items=[]} = this.state;
    const itemsCopy = dataHandler.deepClone(items);
    if(property_type-0===1){
      itemsCopy.push({
        property_options: [
          {
            text: '',
            value: '',
          },
          {
            text: '',
            value: '',
          },
        ],
        property_type: property_type-0,
        property_name: '',
      })
    }else if(property_type-0===5){
      if(!itemsCopy.find(v=>v.property_type-0===5)){
        itemsCopy.push({
          property_type: property_type-0,
        })
      }else{
        message.error('图片项目最多一个（支持上传多张图片）');
      }
    }else{
      itemsCopy.push({
        property_type: property_type-0,
        property_name: '',
      },)
    }
    this.setState({items:lodash.sortBy(itemsCopy, ['property_type'])});

  };

  onDeleteProperty = (i)=>{
    const {items=[]} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    itemsCopy.splice(i,1);
    this.setState({items:itemsCopy});
  };

  onAddOfOne = (i)=>{
    const {items=[]} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    itemsCopy[i].property_options.push({
      text:'',
      value:'',
    });
    this.setState({ items:itemsCopy })
  };

  onDeleteOfOne = (i,j)=>{
    const {items=[]} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    itemsCopy[i].property_options.splice(j,1);
    this.setState({ items:itemsCopy });
  };

  onChangeOfOne_desc = (e,i)=>{
    const {value} = e.target;
    const {items = []} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    itemsCopy[i].property_name = value;
    this.setState({items:itemsCopy});
  };

  onChangeOfOne_option = (e,i,j)=>{
    const {value} = e.target;
    const {items = []} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    const property_option = itemsCopy[i].property_options[j];
    property_option.value = value;
    property_option.text = value;
    this.setState({items:itemsCopy});
  };

  onChangeOfTwo = (e,i)=>{
    const {value} = e.target;
    const {items = []} = this.state;
    let itemsCopy = dataHandler.deepClone(items);
    itemsCopy[i].property_name = value;
    this.setState({items:itemsCopy});
  };

  itemsIsValid = ()=>{
    const {items=[]} = this.state;
    let status = true;
    for(let i=0;i<items.length;i++){
      const im = items[i];
      const type = im.property_type-0;
      if(type===1){
        if(!im.property_name || im.property_options.some(v=>!v.value||!v.text)){
          message.error(`请填写完整的单选框内容`)
          status = false;
        }
      }else if(type !== 5){
        if(!im.property_name){
          message.error(`请填写完整的${item_properties_map[type+'']}内容`);
          status =  false;
        }
      }

      return status;
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {

        if(this.itemsIsValid()){
          const {items=[]} = this.state;
          request(urls.admin_treatment_item_save, {
            body: {
              ...fieldsValue,
              item_properties:JSON.stringify(items),
            },
            success: () => {
              message.success('操作成功');
              setTimeout(() => {
                router.jump({
                  dispatch,
                  pathname: `/treatment-manage/item-list`,
                });
              }, 1500);
            },
            fail: (errMsg) => {
              message.error(errMsg || '操作失败');
            },
          });
        }

      }
    });
  };

  common_status_detail = () => {

    request(urls.common_status_detail, {
      body: { name: '分类-治疗项目类型' },
      method: 'get',
      success: item_type_all => {
        this.setState({ item_type_all });
      },
      fail: errmsg => {
        message.error(errmsg || '获取失败');
      },
      complete: () => {
        this.setState({ loading: false });
      },
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { item_type_all = {}, loading, items, property_type,status } = this.state;
    const { styles: { formItemLayout, tailFormItemLayout } } = tableHandler;
    let item_type_init_value = '';
    try {
      item_type_init_value = Object.keys(item_type_all)[0];
    } catch (e) {
      item_type_init_value = '';
    }
    return (
      <PageHeaderLayout title="">
        <Card
          bordered={false}
          loading={loading}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label={'项目编码'}
            >
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label={'项目名称'}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'价格（元）'}
            >
              {getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <InputNumber min={1} />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={'描述'}
            >
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Input />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="状态">
              {
                getFieldDecorator('status', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                  initialValue:'0',
                })(
                  <Select placeholder="请选择">
                    <Option value="0">正常</Option>
                    <Option value="4">逻辑删除</Option>
                  </Select>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label="治疗项目类型">
              {
                getFieldDecorator('item_type', {
                  rules: [{
                    required: true,
                    message: '请选择',
                  }],
                  initialValue: item_type_init_value,
                })(
                  <Select placeholder="请选择">
                    {
                      Object.keys(item_type_all).map(v => {
                        return (<Option key={`${v}`} value={v}>{item_type_all[v + '']}</Option>);
                      })
                    }
                  </Select>,
                )
              }
              {

              }
            </FormItem>

            <FormItem {...formItemLayout} label="治疗项目属性">
              <Row style={{display:'flex',flexDirection:'row'}}>
                <Col style={{flex:1}}>
                  {
                    <Select onChange={this.onChangeType} placeholder="请选择" defaultValue={'1'} value={property_type}>
                      {
                        Object.keys(item_properties_map).map(v=>{
                          return (<Option key={`${v}`} value={v}>{item_properties_map[v + '']}</Option>)
                        })
                      }
                    </Select>
                  }
                </Col>
                <Col style={{marginLeft:10}}>
                  <Button type='primary' icon='plus' size='small' onClick={this.addType} />
                </Col>
              </Row>
              <div>
                {
                  items.map((value,i)=>{
                    let ele;
                    const {property_options=[]} = value;
                    const title = item_properties_map[value.property_type+''];
                    switch (value.property_type-0){
                      case 1:
                        ele = property_options&&property_options.length?(
                          <div className={styles.one}>
                            <div className={styles.titleWrap}>
                              <div className={styles.title}>{title}</div>
                              <Button className={styles.minus} onClick={()=>{this.onDeleteProperty(i)}} type='danger' icon='minus' size='small' />
                            </div>
                            <div className={styles.content}>
                              <div className={styles.title}>
                                <span className={styles.desc}>描述</span>
                                <Input className={styles.input} value={value.property_name} onChange={(e)=>this.onChangeOfOne_desc(e,i)}/>
                              </div>
                              {
                                property_options.map((item,j)=>{
                                  return (
                                    <div className={styles.option} key={`one${i}${j}`}>
                                      <span className={styles.desc}>{`选项${j+1}`}</span>
                                      <Input className={styles.input} value={item.value} onChange={(e)=>{this.onChangeOfOne_option(e,i,j)}}/>
                                      {
                                        j===property_options.length-1?(<Button className={styles.plus} onClick={()=>this.onAddOfOne(i)} type='primary' icon='plus' size='small' />):null
                                      }
                                      {
                                        property_options.length>2?(<Button className={styles.minus} onClick={()=>{this.onDeleteOfOne(i,j)}} type='danger' icon='minus' size='small' />):null
                                      }
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        ):null;
                        break;
                      case 2:
                      case 3:
                      case 4:
                        ele = value?(
                          <div className={styles.two}>
                            <div className={styles.titleWrap}>
                              <div className={styles.title}>{title}</div>
                              <Button className={styles.minus} onClick={()=>{this.onDeleteProperty(i)}} type='danger' icon='minus' size='small' />
                            </div>
                            <div className={styles.content}>
                              <div className={styles.title}>
                                <span className={styles.desc}>描述</span>
                                <Input className={styles.input} value={value.property_name} onChange={(e)=>{this.onChangeOfTwo(e,i)}}/>
                              </div>
                            </div>
                          </div>
                        ):null;
                        break;
                      // case 3:
                      //   break;
                      // case 4:
                      //   break;
                      case 5:
                        ele = value?(
                          <div className={styles.five}>
                            <span>图片</span>
                            <span className={styles.imgPlaceHolder} />
                            <Button className={styles.minus} onClick={()=>{this.onDeleteProperty(i)}} type='danger' icon='minus' size='small' />
                          </div>
                        ):null;
                        break;
                      default:
                        ele = null;
                        break;
                    }
                    return ele;
                  })
                }
              </div>
            </FormItem>


            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => tableHandler.back(this)} className={styles.cancelBtn}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>

    );
  }
}


