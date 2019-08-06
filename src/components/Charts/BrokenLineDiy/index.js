import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import lodash from 'lodash';



class Basic extends React.Component {
  render() {
    const cols = {
      y: {
        min: 0,
        max:100,
        alias:'分数',
      },
      x: {
        range: [0, 1]
        // min: 0,
        // max:100,
        // alias:'分数',
      }
    };

    //可配置样式
    const tickLine = {
      lineWidth: 1, // 刻度线宽
      stroke: '#ccc', // 刻度线的颜色
      length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
    }



    const {data,forceFit=true,height=300} = this.props;
    const data_ok = data.map((value,index)=>{
      return {
        x:value.field_name,
        y:value.field_score,
      }
    });
    return (
      <div>
        <Chart
          height={height}
          data={data_ok}
          scale={cols}
          forceFit={forceFit}
          // padding={[0, 0, 70, 0]}
        >
          <Axis name="x" tickLine={tickLine} visible />
          <Axis name="y" tickLine={tickLine} visible line={{
            stroke: '#ccc',
            fill: '#ffffff',
            // lineDash: [2, 2, 3],
            lineWidth: 1
          }} />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="x*y" size={2} />
          <Geom
            type="point"
            position="x*y"
            size={4}
            shape={"circle"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default Basic;
