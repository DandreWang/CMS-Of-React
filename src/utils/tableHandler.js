import { message } from 'antd/lib/index';
import { routerRedux } from 'dva/router';
import { dataHandler } from './dataHandler';
import moment from 'moment/moment';

export const tableHandler = {
  styles: {
    formItemLayoutOfListPage: {
      labelCol: {
        md: { span: 7 },
      },
      wrapperCol: {
        md: { span: 17 },
      },
    },
    formItemLayout: {
      labelCol: {
        md: { span: 7 },
      },
      wrapperCol: {
        md: { span: 10 },
      },
    },
    tailFormItemLayout: {
      wrapperCol: {
        md: {
          span: 10,
          offset: 7,
        },
      },
    },
  },
  list:(params)=>{
    const {dispatch,dirNameFirstLetterLower,payload} = params;
    const obj = {
      type: `${dirNameFirstLetterLower}/list`,
    };
    if(payload){
      obj.payload = payload;
    }
    dispatch(obj);
  },
  info:(params)=>{
    const {dispatch,dirNameFirstLetterLower,payload} = params;
    const obj = {
      type: `${dirNameFirstLetterLower}/info`,
    };
    if(payload){
      obj.payload = payload;
    }
    dispatch(obj);
  },
  submit: ({event,page,dirNameFirstLetterLower,dataHandler}) => {
    event.preventDefault();
    const { dispatch, form,match={} } = page.props;
    const {params={}} = match;
    const {id} = params;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const data = dataHandler(fieldsValue);
        const payload = {...fieldsValue,...data};
        if(id){
          payload.id = id;
        }
          dispatch({
          type:`${dirNameFirstLetterLower}/submit`,
          payload,
          callback:()=>{
            tableHandler.jump({
              dispatch,
              dirNameFirstLetterLower,
              page:'list',
              jumpType:'replace',
            });
          },
        });
      }
    });
  },
  remove:(params)=>{
    const {record:{id},dispatch,dirNameFirstLetterLower,callback} = params;
    dispatch({
      type: `${dirNameFirstLetterLower}/remove`,
      payload: { id },
      callback:()=>{
        if(typeof callback === 'function'){
          callback();
        }else{
          message.success('删除成功');// todo 是否会循环引用
        }
      },
    });
  },
  jump:(params)=>{
    const {record={},page,dispatch,dirNameFirstLetterLower,jumpType='push'} = params;
    const {id} = record;
    dispatch(routerRedux[jumpType]({
      pathname: `/${dataHandler.upper2specialLower(dirNameFirstLetterLower,'-')}/${page}` + (id ? `/${id}` : ``),
    }));
  },
  dateOfSearch:([monentInstance1,monentInstance2])=>{
    // [monentInstance1,monentInstance2] 转成 {startDate:'2018-01-02',endDate:'2018-11-22'}
    return [
      monentInstance1.format('YYYY-MM-DD'),
      monentInstance2.format('YYYY-MM-DD')
    ]
  },
  handleDateRange:({fieldsValue,key,startDateKey,endDateKey})=> {
    const searchDate = fieldsValue[key];
    if(searchDate&&Array.isArray(searchDate)&&searchDate.length===2){
      const dateArr = tableHandler.dateOfSearch(searchDate);
      fieldsValue[startDateKey] = dateArr[0];
      fieldsValue[endDateKey] = dateArr[1];
      delete fieldsValue[key];
    }
    return fieldsValue;
  },
  handleTableChange:({pagination, filtersArg, sorter,page,dirNameFirstLetterLower})=>{

    const { formValues } = page.state;
    const {dispatch} = page.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = dataHandler.getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      /* todo */
      // 根据接口调整
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    tableHandler.list({
      dirNameFirstLetterLower,
      dispatch,
      payload:params
    });
  },
  handleFormReset: ({page,dirNameFirstLetterLower}) => {
    const { form,dispatch } = page.props;
    form.resetFields();
    page.setState({
      formValues: {},
    });
    tableHandler.list({
      dirNameFirstLetterLower,
      dispatch
    });
  },
  handleSearch: ({event,page,dirNameFirstLetterLower,dataHandler}) => {

    event.preventDefault();

    const { form,dispatch } = page.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }


      // 特殊搜索项
      const specialParams = dataHandler(fieldsValue);


      const payload = {...fieldsValue,...specialParams};

      page.setState({
        formValues: payload,
      });

      tableHandler.list({
        dirNameFirstLetterLower,
        dispatch,
        payload,
      });
    });
  },
  back:(page)=>{
    page.props.history.go(-1);
  },
};

