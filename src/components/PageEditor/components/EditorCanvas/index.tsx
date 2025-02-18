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
    const { pageData,unFocusAllUnit,lines } = usePageData();
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
          {lines.value?.y && Array.from(lines.value.y).map((top:number)=>{
            return <div class="line-y" style={{top:top+"px"}}></div>
          })}
          {lines.value?.x && Array.from(lines.value.x).map((left:number)=>{
            return <div class="line-x" style={{left:left+"px"}}></div>
          })}
        </div>
      </div>
    )
  }
})