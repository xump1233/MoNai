import { defineComponent } from "vue";
import "./index.less"


export default defineComponent({
  setup(_,{slots}){
    return ()=>(

      <div class="props-edit-box"> 
        {slots.default && slots.default()}
      </div>
    )
  }
})