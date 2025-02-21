import { ref } from "vue";

export default function(moveEnd:()=>void){
  const begin = ref<{x:number,y:number}>();
  const offsetX = ref<number>(0);
  const offsetY = ref<number>(0);
  function mouseDown(e:MouseEvent){
    begin.value = {
      x:e.clientX,
      y:e.clientY
    }
    window.addEventListener("mousemove",mouseOver);
    window.addEventListener("mouseup",mouseUp);
  }
  function mouseOver(e:MouseEvent){
    if(begin.value){
      offsetX.value = begin.value.x - e.clientX;
      offsetY.value = begin.value.y - e.clientY;
    }
  }
  function mouseUp(e:MouseEvent){
    moveEnd();
    offsetX.value = 0;
    offsetY.value = 0;
    window.removeEventListener("mousemove",mouseOver);
    window.removeEventListener("mouseup",mouseUp);
  }

  return {
    mouseDown,
    offsetX,
    offsetY
  }
}