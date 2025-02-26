import { defineComponent,ref,onMounted,onUnmounted,Ref  } from "vue";
import type { IComponentUnit } from "@/interface";
import RenderUnit from "./components/RenderUnit";
import ContextMenu from "@/components/ContextMenu/index.vue"
import AddUnitLogic from "@/components/AddUnitLogic";
import "./index.less"


import usePageData from "@/hooks/usePageData";
import useDrag from "@/hooks/useDrag";
import useSelectFocus from "./hooks/useSelectFocus";
import useMoveCanvas from "./hooks/useMoveCanvas";

import { DragState } from "@/constant";

export default defineComponent({
  props:{
    
  },
  setup(){
    const canvasContainer = ref<HTMLElement>();
    const moveContainer = ref<HTMLElement>();
    const scrollContainer = ref<HTMLElement>();
    const isKeySpace = ref<boolean>(false);

    const { setCanvas,dragState } = useDrag();
    const { pageData,unFocusAllUnit,lines,moveFocusUnit } = usePageData();
    const { mouseDown,selectMaskStyle } = useSelectFocus({isKeySpace:isKeySpace});
    const { setElements,moveCanvasDown } = useMoveCanvas({isKeySpace})
    

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
    function keyboardMove(e:KeyboardEvent){
      if(e.code === "ArrowLeft"){
        e.preventDefault();
        moveFocusUnit({offsetLeft:-1,offsetTop:0});
      }
      if(e.code === "ArrowRight"){
        e.preventDefault();
        moveFocusUnit({offsetLeft:1,offsetTop:0});
      }
      if(e.code === "ArrowUp"){
        e.preventDefault();
        moveFocusUnit({offsetLeft:0,offsetTop:-1});
      }
      if(e.code === "ArrowDown"){
        e.preventDefault();
        moveFocusUnit({offsetLeft:0,offsetTop:1});
      }
    }
    
    onMounted(()=>{
      window.addEventListener("keydown",keyboardMove);
    })
    onUnmounted(()=>{
      window.removeEventListener("keydown",keyboardMove);
    })


    onMounted(()=>{
      if(moveContainer.value && scrollContainer.value){
        setElements({
          moveContainer:moveContainer.value,
          scrollContainer:scrollContainer.value
        });
      }
      window.addEventListener("keydown",(e)=>{
        if(e.code === "Space" && !logicShow.value){
          e.preventDefault();
          moveContainer.value?.classList.add("grab");
          isKeySpace.value = true;
        } 
      })
      window.addEventListener("keyup",(_)=>{
        moveContainer.value?.classList.remove("grab");
        isKeySpace.value = false;
      })
    })
    

    const menuList = ref([{
      label:"添加逻辑",
      name:"addLogic"
    },{
      label:"上移一层",
      name:"moveUp"
    },{
      label:"下移一层",
      name:"moveDown"
    },{
      label:"置于底层",
      name:"toBottom"
    },{
      label:"置于顶层",
      name:"toTop"
    }]);
    
    const logicShow = ref(false);
    const logicUnit = ref<IComponentUnit>();
    return ()=>(
      <div class="page-editor-canvas-container unselectable" ref={scrollContainer}>
        <AddUnitLogic
          show={logicShow.value}
          onClose={()=>{
            logicShow.value = false;
          }}
          unit={logicUnit.value}
        ></AddUnitLogic>
        <div class="canvas-content" style={canvasSize} ref={moveContainer} onMousedown={(e)=>{
          unFocusAllUnit();
          mouseDown(e);
          moveCanvasDown(e);
        }}>
          {pageData.value.components && pageData.value.components.map((unit:IComponentUnit)=>{
            return (
              <ContextMenu list={menuList.value} onSelect={(label:string)=>{
                console.log(label)
                if(label === "添加逻辑"){
                  logicUnit.value = unit;
                  logicShow.value = true;
                }
              }}>
                <RenderUnit unit={unit} key={unit.id}></RenderUnit>
              </ContextMenu>
            )
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