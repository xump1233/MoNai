import { defineComponent,ref } from "vue";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import './index.less'
import type { IBasicComponent } from "@/interface";
import useDrag from "@/hooks/useDrag";
import useStoreMove from "./hooks/useStoreMove";
import useResize from "./hooks/useResize";

import ToWindowIcon from "./components/ToWindowIcon";
import ToMinIcon from "./components/ToMinIcon";

export default defineComponent({
  props:{

  },
  setup(){
    const StoreState = ref<"left" | "min" | "float">("left");
    const ClassMap = {
      "left":"",
      "min":"min-state",
      "float":"float-state"
    }
    const { dragStart } = useDrag();
    const { mouseDown,storePosition }  = useStoreMove({
      top:50,
      left:200
    });
    const { targetRect,resizeDown,offsetX,offsetY } = useResize({
      width:600,
      height:500
    });
    const componentList = config.componentList;


    return ()=>(
      <div 
        class={`page-editor-component-store unselectable ${ClassMap[StoreState.value]}`}
        style={StoreState.value === "float" && {
          top:storePosition.value.top + offsetY.value + "px",
          left:storePosition.value.left + offsetX.value + "px",
          width:targetRect.value.width + "px",
          height:targetRect.value.height + "px"
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
        {StoreState.value === "float" && (<>
          <div class="edge-lr edge-left" onMousedown={(e:MouseEvent)=>{
            resizeDown(e,"left");
          }}></div>
          <div class="edge-lr edge-right" onMousedown={(e:MouseEvent)=>{
            resizeDown(e,"right");
          }}></div>
          <div class="edge-tb edge-top" onMousedown={(e:MouseEvent)=>{
            resizeDown(e,"top");
          }}></div>
          <div class="edge-tb edge-bottom" onMousedown={(e:MouseEvent)=>{
            resizeDown(e,"bottom");
          }}></div>
        </>)}
      </div>
    )
  }
})