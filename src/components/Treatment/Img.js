import React, { PureComponent, Component, Fragment } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Row,
  Col,
  Collapse,
  Modal,
  Progress,
  Timeline,
  Upload,
  Icon,
  message,
  Input,
  Tooltip,
  Radio,
  InputNumber,
} from 'antd';
import { urls } from '../../utils/urls';
import ModalDiy from 'components/ModalDiy';

export default class ImgDiy extends Component {

  constructor(props) {
    super(props);
    // const { data: { property_value = [] } = {} } = props;
    // const fileList=property_value.slice().map(value=>({random:Math.random(),url:value,uid:value||Math.random(),response:{data:value}}));
    this.state = {
      previewVisible:false,
      previewImage:'',
      // fileList,
    };
  }
  showPreview = (file)=>{
    this.setState({
      previewVisible:true,
      previewImage:file.url||file.thumbUrl||file.response.data,
    })
  };
  hidePreview = ()=>{
    this.setState({
      previewVisible:false,
    })
  };
  beforeUpload = (file={}) => {
    const {type,size} = file;
    const typesValid = ['image/jpeg','image/png','image/jpg'];
    const isValidType = typesValid.indexOf(type) !== -1;
    if (!isValidType) {
      message.error('请上传格式为jpeg、jpg、png的图片!');
      return false;
    }
    const tooBig = size / 1024 / 1024 > 5;
    if (tooBig) {
      message.error('图片应不大于5MB!');
      return false;
    }
    return true;
  };

  // componentWillReceiveProps(newProps){
  //   const { data: { property_value = [] } = {} } = newProps;
  //   let fileList=property_value.slice().map(value=>({random:Math.random(),url:value,uid:value||Math.random(),response:{data:value}}));
  //   if(property_value[property_value.length-1].status){
  //     fileList[fileList.length-1] = property_value[property_value.length-1];
  //   }
  //   this.setState({ fileList });
  //   this.forceUpdate();
  // }
  render() {
    const { styles, onChange, data: { property_name, property_value = [] } = {}, i , j } = this.props;
    const {previewVisible,previewImage,fileList} = this.state;
    // console.log(property_value.length);
    const uploadButton = (
      <div>
        <Icon type="picture" style={{ fontSize: 20 }} />
        <div className="ant-upload-text">添加图片</div>
      </div>
    );
    return (
      <Row gutter={24} className={styles.timeLineItem}>
        <Col span={21} offset={3}>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={18}>
              <Upload
                action={urls.file_plupload_common}
                name='file'
                // methods='post'
                // headers={{ 'Content-Type':'multipart/form-data',Accept: 'application/json' }}
                listType="picture-card"
                defaultFileList={property_value.slice().map(value=>({url:value,uid:value,response:{data:value}}))}
                // fileList={fileList}
                // beforeUpload={this.beforeUpload}
                onPreview={this.showPreview}
                onChange={({ fileList,file,event })=>onChange({ fileList,file,event,i, j })}
                showUploadList={{showPreviewIcon:false,showRemoveIcon:true}}
              >
                {property_value.length >= 5 ? null : uploadButton}
              </Upload>
              <ModalDiy visible={previewVisible} footer={null} onCancel={this.hidePreview}>
                <img alt="无法显示" style={{ width: '100%' }} src={previewImage} />
              </ModalDiy>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
