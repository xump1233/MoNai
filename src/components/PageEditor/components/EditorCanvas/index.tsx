import { defineComponent,ref,onMounted  } from "vue";
import type { IComponentUnit } from "@/interface";
import RenderUnit from "./components/RenderUnit";
import "./index.less"


import usePageData from "@/hooks/usePageData";
import useDrag from "@/hooks/useDrag";
import useSelectFocus from "./hooks/useSelectFocus";

import { DragState } from "@/constant";

export default defineComponent({
  props:{
    
  },
  setup(){
    const { setCanvas,dragState } = useDrag();
    const { pageData,unFocusAllUnit } = usePageData();
    const { mouseDown,selectMaskStyle } = useSelectFocus();
    const canvasContainer = ref<HTMLElement>();
    const moveContainer = ref<HTMLElement>();

    const pageContainer = pageData.value.pageContainer;
    const canvasSize = {
      width:typeof pageContainer.width === 'string' ? pageContainer.width : pageContainer.width + 'px',
      height:typeof pageContainer.height === 'string' ? pageContainer.height : pageContainer.height + 'px'
    };
    
    
    onMounted(()=>{
      if(canvasContainer.value){
        setCanvas(canvasContainer.value);
      }
    })

    return ()=>(
      <div class="page-editor-canvas-container unselectable">
        <div class="canvas-content" style={canvasSize} ref={moveContainer} onMousedown={(e)=>{
          unFocusAllUnit();
          mouseDown(e);
        }}>
          {pageData.value.components && pageData.value.components.map((unit:IComponentUnit)=>{
            return <RenderUnit unit={unit} key={unit.id}></RenderUnit>
          })}
          <div class="drag-mask" style={dragState.value === DragState.DRAGGING ? {display:"block"} : {}}  ref={canvasContainer}></div>
          <div class="select-mask" style={selectMaskStyle.value}></div>
        </div>
      </div>
    )
  }
})