import { computed, defineComponent,onMounted,ref, watch } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  props:{
    xAxis:{
      type:String
    },
    yAxis:{
      type:String
    },
    value:{
      type:String
    }
  },
  setup(props) {
    const container = ref();

    watch(()=>props.value,()=>{
      if(!props.value){
        return;
      }
      try{
        dataSource.value = JSON.parse(props.value)
      }catch(err){
        console.log(err)
      }
      
    })
    const dataSource = ref<{name:string,value:number}[]>([{
      name:"Mon",
      value:150
    },{
      name:"Tue",
      value:230
    },{
      name:"Wed",
      value:220
    },{
      name:"Thu",
      value:180
    },{
      name:"Fri",
      value:132
    }])

    onMounted(()=>{
      if(!container.value){
        return;
      }
      const chart = echarts.init(container.value);
      const option = {
        xAxis: {
          type: 'category',
          data: dataSource.value.map(i=>i.name)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: dataSource.value.map(i=>i.value),
            type: 'line'
          }
        ]
      };
      chart.setOption(option);
    })
    return ()=>(
      <div ref={container} style={{width:"300px",height:"280px"}}></div>
    )
  },
})