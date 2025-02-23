import { ref } from "vue";

export default function(rect:{width:number,height:number}){
  const initRect = ref<{width:number,height:number}>(rect);
  const targetRect = ref<{width:number,height:number}>({...rect});
  const offsetX = ref<number>(0);
  const offsetY = ref<number>(0);
  let lastOffsetX = 0;
  let lastOffsetY = 0

  const begin = ref<{x:number,y:number}>();
  const edge = ref<string>();
  function resizeDown(e:MouseEvent,cur:string){
    begin.value = {
      x:e.clientX,
      y:e.clientY,
    }
    edge.value = cur;
    window.addEventListener("mousemove",resizeMove);
    window.addEventListener("mouseup",resizeUp);
  }
  function resizeMove(e:MouseEvent){
    let curOffsetX = 0;
    let curOffsetY = 0;
    if(begin.value){
      curOffsetX = e.clientX - begin.value.x;
      curOffsetY = e.clientY - begin.value.y;
    }
    if(edge.value === "left"){
      targetRect.value.width = initRect.value.width - curOffsetX;
      offsetX.value = curOffsetX + lastOffsetX;
    }else if(edge.value === "right"){
      targetRect.value.width = initRect.value.width + curOffsetX;
    }else if(edge.value === "top"){
      targetRect.value.height = initRect.value.height - curOffsetY;
      offsetY.value = curOffsetY + lastOffsetY;
    }else{
      targetRect.value.height = initRect.value.height + curOffsetY;
    }
  }
  function resizeUp(_:MouseEvent){
    lastOffsetX = offsetX.value;
    lastOffsetY = offsetY.value;
    initRect.value.width = targetRect.value.width;
    initRect.value.height = targetRect.value.height;
    window.removeEventListener("mousemove",resizeMove);
    window.removeEventListener("mouseup",resizeUp);
  }


  return {
    resizeDown,
    targetRect,
    offsetX,
    offsetY
  }
}