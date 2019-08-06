import React, { Component } from 'react';
import lodash from 'lodash';
import { Chart, Axis, Tooltip, Geom, Label } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class BarDiy extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  render() {
    const {
      height,
      size=16,
      title,
      forceFit = true,
      data,
      // color的设置方式很灵活。详见https://github.com/alibaba/BizCharts/blob/master/doc/api/geom.md
      color = 'rgba(24, 144, 255, 0.85)',
      padding,
      crosshairs = false,
      labelOptions = {
        offset:10,
        textStyle: {
          fontSize: '12', // 文本大小
          rotate: 15,
          textAlign: 'center',
          textBaseline: 'top',
        },
        autoRotate:false,
      },
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
      },
    };

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    // lodash.find()
    // let height = 200;
    try{
      // const maxTextLength = lodash.maxBy(data, v=> { return v.x.length; }).x.length;
      // labelOptions.textStyle.rotate = maxTextLength>5?6:10;
    }catch (e) {

    }



    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={data}
            padding={padding || 'auto'}
          >
            <Axis
              name="x"
              title={false}
              // label={labelOptions}
              label={autoHideXLabels ? false : labelOptions}
              tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="y" />
            <Tooltip showTitle={false} crosshairs={crosshairs} />
            <Geom size={size} type="interval" position="x*y" color={color} tooltip={tooltip}>
              {/*<Label content='y' offset={0} />*/}
            </Geom>
          </Chart>
        </div>
      </div>
    );
  }
}

export default BarDiy;
