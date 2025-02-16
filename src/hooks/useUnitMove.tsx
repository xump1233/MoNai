import { ref } from "vue";


const moveCanvas = ref<HTMLElement | null>(null);
const moveUnitList = ref<string[]>([]);

function setMoveCanvas(ele:HTMLElement){
  moveCanvas.value = ele;
}


export default function(){
  return {
    moveCanvas,
    moveUnitList,
    setMoveCanvas,
    
  }
}