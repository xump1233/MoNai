import { defineComponent,ref,onMounted,onUnmounted  } from "vue";
import type { IComponentUnit } from "@/interface";
import RenderUnit from "./components/RenderUnit";
import ContextMenu from "@/components/ContextMenu/index.vue"
import AddUnitLogic from "@/components/AddUnitLogic";
import "./index.less"
import { useMessage } from "naive-ui";


import usePageData from "@/hooks/usePageData";
import useDrag from "../..//hooks/useDrag";
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
    const { pageData,unFocusAllUnit,lines,moveFocusUnit,zIndexMoveUpAndDown,removeComponent } = usePageData();
    const { mouseDown,selectMaskStyle } = useSelectFocus({isKeySpace:isKeySpace});
    const { setElements,moveCanvasDown } = useMoveCanvas({isKeySpace});
    const message = useMessage();
    

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
      name:"addLogic",
      icon:()=>(
        <svg class="icon" viewBox="0 0 1253 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3319" width="32" height="32"><path d="M139.776133 879.139026c86.924337 0 170.475155-32.273331 234.684465-90.185405l12.594471-11.919767 450.589674-448.340662a252.226763 252.226763 0 0 1 162.603611-72.868009l15.293286-0.449802h123.245891a49.140925 49.140925 0 0 0 6.747038-97.944499l-6.747038-0.449802H1015.54164c-86.811886 0-170.362705 32.16088-234.684465 90.072954l-12.59447 11.919767L317.67303 707.314463a252.226763 252.226763 0 0 1-162.603611 72.868008l-15.293286 0.562254H49.253376a49.140925 49.140925 0 0 0-6.747038 97.832048l6.747038 0.562253h90.522757z" fill="#121933" p-id="3320"></path><path d="M1075.028023 380.19558a49.140925 49.140925 0 0 1-73.992514-64.546661l4.385574-5.060279 102.779876-102.779876-103.454579-103.454579a49.253376 49.253376 0 0 1-4.385575-64.546662l4.498025-5.060278A49.253376 49.253376 0 0 1 1069.180591 30.36167l5.060278 4.498025 133.591349 133.478898c20.128663 20.241113 21.702972 51.72729 4.610475 73.655163l-4.610475 5.28518L1074.915573 380.08313z" fill="#121933" p-id="3321"></path><path d="M139.776133 151.583449c86.924337 0 170.475155 32.273331 234.684465 90.072955l12.594471 11.919767 328.918093 327.231333a49.140925 49.140925 0 0 1-63.871958 74.554768l-5.510081-4.722926-328.918093-327.231334a252.226763 252.226763 0 0 0-162.603611-72.980459l-15.293286-0.449802H49.253376a49.253376 49.253376 0 0 1-6.747038-97.944499l6.747038-0.449803h90.522757z" fill="#121933" p-id="3322"></path><path d="M1203.671544 728.792533c27.213052 0 49.253376 25.188941 49.253376 56.225316 0 28.450009-18.554354 52.064642-42.506338 55.775512l-6.747038 0.449803h-393.577205c-27.100602 0-49.140925-25.188941-49.140925-56.225315 0-28.450009 18.441903-51.952191 42.506338-55.663062l6.747038-0.562254h393.577205z" fill="#121933" p-id="3323"></path><path d="M1013.967331 532.003931c28.450009 0 51.952191 18.554354 55.663062 42.506338l0.562253 6.747038v393.577205c0 27.100602-25.188941 49.140925-56.225315 49.140925-28.450009 0-52.064642-18.441903-55.775512-42.506338l-0.449803-6.747038v-393.577205c0-26.988151 25.188941-49.140925 56.225315-49.140925z" fill="#121933" p-id="3324"></path></svg>
      )
    },{
      label:"删除组件",
      name:"removeCom"
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
          onOk={()=>{
            message.success("添加成功！！")
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
                }else if(label === "上移一层"){
                  zIndexMoveUpAndDown(unit.id,"up");
                }else if(label === "下移一层"){
                  zIndexMoveUpAndDown(unit.id,"down");
                }else if(label === "删除组件"){
                  removeComponent(unit.id);
                }
              }}
              >
                
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