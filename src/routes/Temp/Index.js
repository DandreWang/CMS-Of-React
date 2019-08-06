import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Col, Button, Row, List, Radio, Table } from 'antd';
import { BarDiy2, Radar,RadarDiy,Gauge,GaugeDiy,BrokenLineDiy,DotDiy } from 'components/Charts';
import FooterToolbar from 'components/FooterToolbar';
import Ellipsis from 'components/Ellipsis';
import DescriptionList from 'components/DescriptionListDiy';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Index.less';
import { business } from '../../utils/business';


const { Description } = DescriptionList;

const barPic = [
  {
    "x": "医学检查",
    "y": 10,
    "color": "RGBA(133, 220, 171, 1)"
  },
  {
    "x": "脑功能状态",
    "y": 30,
    "color": "RGBA(133, 220, 171, 1)"
  },
  {
    "x": "自主神经功能状态",
    "y": 70,
    "color": "RGBA(133, 220, 171, 1)"
  },
  {
    "x": "机体功能状况",
    "y": 0,
    "color": "RGBA(133, 220, 171, 1)"
  },
  {
    "x": "内分泌状况",
    "y": 50,
    "color": "RGBA(133, 220, 171, 1)"
  },
  {
    "x": "应激相关反应",
    "y": 66,
    "color": "RGBA(252, 193, 96, 1)"
  },
  {
    "x": "情绪状态",
    "y": 44,
    "color": "RGBA(252, 193, 96, 1)"
  },
  {
    "x": "个体成长",
    "y": 88,
    "color": "RGBA(252, 193, 96, 1)"
  },
  {
    "x": "生活方式",
    "y": 11,
    "color": "RGBA(250, 145, 145, 1)"
  },
  {
    "x": "社会支持",
    "y": 22,
    "color": "RGBA(250, 145, 145, 1)"
  },
  {
    "x": "生活工作环境",
    "y": 100,
    "color": "RGBA(250, 145, 145, 1)"
  }
];


const radarOriginData = [
  {
    name: 'Series1',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: 'Series2',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: 'Series3',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];
const radarData = [];
const radarTitleMap = {
  ref: 'A',
  koubei: 'B',
  output: 'C',
  contribute: 'D',
  hot: 'E',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});


@connect(() => ({}))
@Form.create()
export default class Temp extends PureComponent {
  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <PageHeaderLayout>

        <Row gutter={24}>

          <Col span={12} className={styles.salesBar} style={{paddingLeft:0,paddingRight:0}}>
            <BrokenLineDiy />
          </Col>

          <Col span={12} className={styles.salesBar} style={{paddingLeft:0,paddingRight:0}}>
            <DotDiy />
          </Col>

        </Row>

        <Row gutter={24} style={{marginTop:20}}>

          <Col xl={24} lg={24} md={24} sm={24} xs={24} className={[styles.salesBar,{backgroundColor:'f00'}]}>

            <Card bordered={false}>
              <BarDiy2
                height={200}
                color={['color', (color) => {
                  return color;
                }]}
                title="Demo1"
                data={barPic}
              />
            </Card>

          </Col>

        </Row>

        <Row gutter={24} style={{marginTop:20}}>

          <div style={{width:372}}>
            <Card
              bordered={false}
              title="Demo2"
            >
              <RadarDiy hasLegend width={300} height={343} data={radarData} forceFit={false} />
            </Card>
          </div>

        </Row>

        <Row gutter={24} style={{marginTop:20}}>

          <Col xl={12} lg={24} md={24} sm={24} xs={24} className={[styles.salesBar,{backgroundColor:'00f'}]}>
            <Card
              title='Demo3'
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <GaugeDiy
              />
            </Card>
          </Col>

        </Row>



      </PageHeaderLayout>
    );
  }
}
