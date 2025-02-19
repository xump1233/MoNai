import { defineComponent,ref } from "vue";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import './index.less'
import type { IBasicComponent } from "@/interface";
import useDrag from "@/hooks/useDrag";

import ToWindowIcon from "./components/ToWindowIcon";
import ToMinIcon from "./components/ToMinIcon";

export default defineComponent({
  props:{

  },
  setup(props){
    const StoreState = ref<"left" | "min" | "float">("left");

    const ClassMap = {
      "left":"",
      "min":"min-state",
      "float":"float-state"
    }


    const { dragStart } = useDrag();
    const componentList = config.componentList;
    return ()=>(
      <div class={`page-editor-component-store ${ClassMap[StoreState.value]}`}>
        <div class="store-top">
          <div class="top-title"></div>
          <div class="top-operate">
            <ToMinIcon onClick={()=>{
              StoreState.value = "min"
            }}></ToMinIcon>
            <ToWindowIcon onClick={()=>{
              if(StoreState.value === "float"){
                StoreState.value = "left";
              }else{
                StoreState.value = "float";
              }
            }}></ToWindowIcon>
          </div>
        </div>
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