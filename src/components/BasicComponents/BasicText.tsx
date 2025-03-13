import { defineComponent,onMounted } from "vue";


export default defineComponent({
  props:{
    fontSize:{
      type:Number
    },
    color:{
      type:String
    },
    value:{
      type:String
    },
    onMounted:{
      type:Function
    },
    onClick:{
      type:Function
    }
  },
  setup(props){
    onMounted(()=>{
      props.onMounted && props.onMounted();
    })

    return ()=>(
      <div
        style={{
          fontSize:props.fontSize + "px",
          color:props.color
        }}
        onClick={()=>{
          typeof props.onClick === "function" && props.onClick();
        }}
      >{props.value || "默认文本"}</div>
    )
  }
})