import { ref } from "vue";
import type { DragUnit,DragStateType } from "@/interface";
import { DragState } from "@/constant";





const nowDragUnit = ref<DragUnit>({
  name:"div",
  c_id:"1",
  layout:{
    x:0,
    y:0,
    width:100,
    height:100
  }
});
const dragState = ref<DragStateType>(DragState.END);

function setDragUnit(unit:DragUnit){
  nowDragUnit.value = unit
}
function setDragState(state:DragStateType){
  dragState.value = state
}

export default function(){
  return {
    nowDragUnit,
    dragState,
    setDragUnit,
    setDragState
  }
}