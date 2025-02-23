import { defineComponent } from "vue";
import "./index.less"

import usePageData from "@/hooks/usePageData";

export default defineComponent({
  props:{

  },
  setup(_){
    const { pageData } = usePageData();

    return ()=>(
      <div class="page-editor-operate-bar" onClick={()=>{
        console.log(JSON.stringify(pageData.value,null,2))
      }}>OperateBar</div>
    )
  }
})