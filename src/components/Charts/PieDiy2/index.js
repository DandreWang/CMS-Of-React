import React from 'react';
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  View,
} from 'bizcharts';
import DataSet from '@antv/data-set';

export default class Sunburst extends React.Component {
  render() {
    const { DataView } = DataSet;
    const {data=[],height=400} = this.props;
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "value",
      dimension: "type",
      as: "percent"
    });
    // alert(dv);
    const cols = {
      percent: {
        formatter: val => {
          val = `${(val * 100).toFixed(2)}%`;
          return val;
        }
      }
    };
    const dv1 = new DataView();
    dv1.source(data).transform({
      type: "percent",
      field: "value",
      dimension: "name",
      as: "percent"
    });
    return (
      <div>
        <Chart
          height={height}
          data={dv}
          scale={cols}
          padding={[15, 0, 0, 0]}
          forceFit
        >
          <Coord type="theta" radius={0.5} />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color={[
              "type",
              type=>{
                if(type==='生物学维度'){
                  return '#ADE2B3'
                }else if(type==='社会学维度'){
                  return '#7AD1D3'
                }else if(type==='心理学维度'){
                  return '#AFD8FA'
                }
              }
            ]}
            tooltip={[
              "type*percent",
              (item, percent) => {
                percent = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
            select={false}
          >
            <Label content="type" offset={-10} />
          </Geom>
          <View data={dv1} scale={cols}>
            <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
            <Geom
              type="intervalStack"
              position="percent"
              color={[
                "name*type",
                (name,type)=>{
                  if(name==='脑功能状态'){
                    // return '#FACC14'
                    return '#62E251'
                  }else if(name==='自主神经功能状态'){
                    // return '#F04864'
                    return '#62E251'
                  }else{
                    if(type==='生物学维度'){
                      return '#ADE2B3'
                    }else if(type==='社会学维度'){
                      return '#7AD1D3'
                    }else if(type==='心理学维度'){
                      return '#AFD8FA'
                    }
                  }
                }
              ]}
              tooltip={[
                "name*percent",
                (item, percent) => {
                  percent = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: item,
                    value: percent
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
              select={false}
            >
              <Label content="name" />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}


