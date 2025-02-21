import { defineComponent,ref } from "vue";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import './index.less'
import type { IBasicComponent } from "@/interface";
import useDrag from "@/hooks/useDrag";
import useStoreMove from "./hooks/useStoreMove";

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
    const { mouseDown,offsetX,offsetY }  = useStoreMove(()=>{
      storePosition.value.top = storePosition.value.top - offsetY.value;
      storePosition.value.left = storePosition.value.left - offsetX.value;
    });
    const componentList = config.componentList;

    const storePosition = ref<{top:number,left:number}>({top:50,left:200});
    return ()=>(
      <div 
        class={`page-editor-component-store unselectable ${ClassMap[StoreState.value]}`}
        style={StoreState.value === "float" && {
          top:storePosition.value.top - offsetY.value + "px",
          left:storePosition.value.left - offsetX.value + "px"
        }}
      >
        <div class="store-top" onMousedown={(e:MouseEvent)=>{
          StoreState.value === "float" && mouseDown(e);
        }}>
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
        <div class="store-container">
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
      </div>
    )
  }
})