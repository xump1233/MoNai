import { ref } from "vue";

export default function(position:{top:number,left:number}){
  const start = ref<{top:number,left:number}>(position)
  const storePosition = ref<{top:number,left:number}>({top:position.top,left:position.left});
  const begin = ref<{x:number,y:number}>();
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
      storePosition.value.left = start.value.left - (begin.value.x - e.clientX);
      storePosition.value.top = start.value.top - (begin.value.y - e.clientY);
    }
  }
  function mouseUp(_:MouseEvent){
    start.value.left = storePosition.value.left;
    start.value.top = storePosition.value.top;
    window.removeEventListener("mousemove",mouseOver);
    window.removeEventListener("mouseup",mouseUp);
  }

  return {
    mouseDown,
    storePosition
  }
}