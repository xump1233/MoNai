import { defineComponent,ref,onMounted, render  } from "vue";
import type { IComponentUnit } from "@/interface";
import RenderUnit from "./components/RenderUnit";
import "./index.less"
import usePageData from "@/hooks/usePageData";
import useDrag from "@/hooks/useDrag";
import { DragState } from "@/constant";

export default defineComponent({
  props:{
    
  },
  setup(props){
    const { setCanvas,dragState } = useDrag();
    const canvasContainer = ref<HTMLElement>();
    const { pageData } = usePageData();
    const pageContainer = pageData.value.pageContainer;
    const canvasSize = {
      width:typeof pageContainer.width === 'string' ? pageContainer.width : pageContainer.width + 'px',
      height:typeof pageContainer.height === 'string' ? pageContainer.height : pageContainer.height + 'px'
    };
    
    onMounted(()=>{
      if(canvasContainer.value){{
        setCanvas(canvasContainer.value);
      }}
    })

    return ()=>(
      <div class="page-editor-canvas-container">
        <div class="canvas-content" style={canvasSize}>
          {pageData.value.components && pageData.value.components.map((unit:IComponentUnit)=>{
            return <RenderUnit unit={unit} key={unit.id}></RenderUnit>
          })}
          <div class="drag-mask" style={dragState.value === DragState.DRAGGING ? {display:"block"} : {}}  ref={canvasContainer}></div>
        </div>
      </div>
    )
  }
})