import { defineComponent,ref } from "vue";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import './index.less'
import type { IBasicComponent } from "@/interface";
import useDrag from "@/hooks/useDrag";

export default defineComponent({
  props:{

  },
  setup(props){
    const { dragStart } = useDrag();
    const componentList = config.componentList;

    

    return ()=>(
      <div class="page-editor-component-store">
        {componentList && componentList.map((item:IBasicComponent)=>{
          const Render = item.preview;
          return (
            <div
              class="store-item"
              draggable="true"
              onDragstart={(e)=>dragStart(e,item)}
            >
              <Render></Render>
            </div>
          )
        })}
      </div>
    )
  }
})