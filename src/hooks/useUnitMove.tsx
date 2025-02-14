import { ref } from "vue";


const moveCanvas = ref<HTMLElement | null>(null);


function setMoveCanvas(ele:HTMLElement){
  moveCanvas.value = ele;
}


export default function(){
  return {
    moveCanvas,
    setMoveCanvas,
  }
}