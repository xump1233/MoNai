import { defineComponent } from "vue";
import { NButton } from "naive-ui";


export default defineComponent({
  props:{
    value:{
      type:String
    },
    onClick:{
      type:Function
    }
  },
  setup(props) {

    return ()=>(
      <NButton 
        type="primary"
        onClick={()=>{
          typeof props.onClick === "function" && props.onClick();
        }}
      >{props.value || "按钮"}</NButton>
    )
  },
})