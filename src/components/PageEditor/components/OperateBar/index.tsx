import { defineComponent } from "vue";
import "./index.less"

import usePageData from "@/hooks/usePageData";
import { useMessage } from "naive-ui"



export default defineComponent({
  props:{

  },
  setup(_){
    const { savePageData } = usePageData();
    const message = useMessage();
    return ()=>(
      <div class="page-editor-operate-bar" onClick={()=>{
        savePageData(()=>{
          message.success("保存成功！")
        },()=>{
          message.error("保存异常！！")
        });
      }}>
        保留区域
      </div>
    )
  }
})