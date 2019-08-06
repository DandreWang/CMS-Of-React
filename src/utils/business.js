export const business = {
  questionnaire_parser:(data)=>{
    // 暂定：0显示绿色、1显示黄色、2显示粉色、3红、4蓝、
    // const colors = ['RGBA(133, 220, 171, 1)', 'RGBA(252, 193, 96, 1)', 'RGBA(250, 145, 145, 1)', 'RGBA(179, 24, 24, 1)', 'RGBA(81, 130, 228, 1)'];

    // const colors = ['#AFD8FA','#7AD1D3','#ADE2B3','#FACC14','#F04864'];

    const ret = {piePic:[],pieDesc:[],barPic:[],pieData:[]};

    data.forEach((value,index) => {
      const {
        calculate_level_total_score,
        calculate_level_name,
        level2_group_list,
        group_name,
        calculate_level_avg_score,
        parent_group,
        calculate_level_desc,
      } = value;

      ret.piePic.push({
        x: group_name,
        y: calculate_level_avg_score,
      });

      ret.pieDesc.push({
        group_name,
        calculate_level_name,
        calculate_level_desc,
      });

      try{
        if(value.level2_group_list.length>0){
          value.level2_group_list.forEach(item=>{
            let color;
            if(item.parent_group==='心理学维度'){
              color = '#AFD8FA';
            }else if(item.parent_group==='社会学维度'){
              color = '#7AD1D3';
            }else{
              if(item.group_name==='脑功能状态'){
                // color = '#FACC14';
                color = '#62E251';
              }else if(item.group_name==='自主神经功能状态'){
                // color = '#F04864';
                color = '#62E251';
              }else{
                color = '#ADE2B3';
              }
            }
            ret.barPic.push({
              x:item.group_name,
              y:item.calculate_level_avg_score,
              color,
            });
            ret.pieData.push({
              value:item.calculate_level_avg_score,
              type:item.parent_group,
              name:item.group_name,
            })
          });
        }else{
          ret.pieData.push({
            count:calculate_level_total_score,
            item:group_name,
          })
        }

      }catch (e) {

      }


    });
    return ret;
  },
  scale_parser:(report)=>{
    //暂定：0显示绿色、1显示黄色、2显示粉色、3及以上显示红色
    const colors = ['RGBA(133, 220, 171, 1)','RGBA(252, 193, 96, 1)','RGBA(250, 145, 145, 1)','RGBA(179, 24, 24, 1)'];
    return report.map(value=>{
      const {
        calculate_level_avg_score,
        calculate_level_desc,
        calculate_level_index,
        calculate_level_name,
        calculate_level_total_score,
        calculate_type,
        group_name,
        parent_group
      } = value;
      return {
        x:group_name,
        y:calculate_type-0===1?calculate_level_avg_score:calculate_level_total_score,
        color:colors[calculate_level_index>3?3:calculate_level_index],
      }
    });
  },
};
