import { defineComponent } from "vue";
import "./index.less"


export default defineComponent({
  setup(_,{slots}){
    return ()=>(

      <div class="preview-box"> 
        {slots.default && slots.default()}
      </div>
    )
  }
})