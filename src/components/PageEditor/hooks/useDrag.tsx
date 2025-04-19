import { ref } from "vue";
import usePageData from "@/hooks/usePageData";
import { DragState } from "@/constant";
import type { DragStateType, IBasicComponent } from "@/interface";


const { componentLeave,componentOver,pushComponent } = usePageData();

const canvasContainer = ref<HTMLElement>();
const dragState = ref<DragStateType>(DragState.START);
const dragComponent = ref<IBasicComponent>();

function setDragState(state:DragStateType){
  dragState.value = state;
}

function dragStart(_:DragEvent,component:IBasicComponent){
  setDragState(DragState.DRAGGING);
  dragComponent.value = component;
}
function dragEnter(e:DragEvent){
  componentOver(dragComponent.value as IBasicComponent,{
    top:e.offsetY,
    left:e.offsetX,
    zIndex:1000
  })
}
function dragOver(e:DragEvent){
  e.preventDefault();
  componentOver(dragComponent.value as IBasicComponent,{
    top:e.offsetY,
    left:e.offsetX,
    zIndex:1000
  })
}
function dragLeave(){
  componentLeave();
}
function drop(e:DragEvent){
  if(dragComponent.value){
    pushComponent({
      name:dragComponent.value.name,
      id:`${dragComponent.value.name}-${Date.now()}`,
      type:dragComponent.value.name,
      position:{
        top:e.offsetY,
        left:e.offsetX,
        zIndex:50
      }
    });
  }
}
function dragEnd(){
  dragState.value = DragState.END;
  window.removeEventListener("dargend",dragEnd);
}
function setCanvas(ele:HTMLElement){
  canvasContainer.value = ele;
  ele.addEventListener("dragenter",dragEnter)
  ele.addEventListener("dragover",dragOver)
  ele.addEventListener("dragleave",dragLeave)
  ele.addEventListener("drop",drop)
  window.addEventListener("dragend",dragEnd)
    
}

export default function(){
  return {
    canvasContainer,
    setCanvas,
    dragState,
    setDragState,
    dragStart,
  }
}