import { defineComponent } from "vue";
import "./index.less"


export default defineComponent({
  props:{

  },
  setup(props){

    return ()=>(
      <div class="page-editor-bottom-bar">
        canvas
      </div>
    )
  }
})
