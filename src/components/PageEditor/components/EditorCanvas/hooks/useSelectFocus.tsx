import { ref } from "vue";
import usePageData from "@/hooks/usePageData";
const { focusRangeUnit } = usePageData();

const beginPosition = ref<{top:number,left:number,selectTop:number,selectLeft:number}>();
const selectMaskStyle = ref<{
  width:string,
  height:string,
  top:string,
  left:string,
  display:string
}>();
const lastTop = ref();
const lastLeft = ref();

function mouseDown(e:MouseEvent){
  beginPosition.value = {
    top:e.clientY,
    left:e.clientX,
    selectTop:e.offsetY,
    selectLeft:e.offsetX
  }
  selectMaskStyle.value = {
    top:e.offsetY + "px",
    left:e.offsetX + "px",
    width:0 + "px",
    height:0 + "px",
    display:"block",
  }
  window.addEventListener("mousemove",mouseMove);
  window.addEventListener("mouseup",mouseUp);
}
function mouseMove(e:MouseEvent){
  let offsetTop:number
  let offsetLeft:number
  if(lastLeft.value !== void 0 && lastTop.value !== void 0){
    offsetTop =  e.clientY - (beginPosition.value?.top as number),
    offsetLeft =  e.clientX - (beginPosition.value?.left as number)
  }
  else{
    offsetTop = 0;
    offsetLeft = 0;
  }
  lastTop.value = e.clientY;
  lastLeft.value = e.clientX;
  if(selectMaskStyle.value){
    if(offsetLeft < 0){
      selectMaskStyle.value = {
        ...selectMaskStyle.value,
        width:-offsetLeft + "px",
        left:(beginPosition.value?.selectLeft as number) + offsetLeft + "px"
      }
    }else{
      selectMaskStyle.value = {
        ...selectMaskStyle.value,
        width:offsetLeft + "px",
      }
    }
    if(offsetTop < 0){
      selectMaskStyle.value = {
        ...selectMaskStyle.value,
        height:-offsetTop + "px",
        top:(beginPosition.value?.selectTop as number) + offsetTop + "px"
      }
    }else{
      selectMaskStyle.value = {
        ...selectMaskStyle.value,
        height:offsetTop + "px",
      }
    }
  }
}
function mouseUp(){
  if(selectMaskStyle.value){
    focusRangeUnit({
      top:parseInt(selectMaskStyle.value?.top),
      left:parseInt(selectMaskStyle.value?.left)
    },{
      top:parseInt(selectMaskStyle.value?.top) + parseInt(selectMaskStyle.value.height),
      left:parseInt(selectMaskStyle.value?.left) + parseInt(selectMaskStyle.value.width),
    })
  }
  selectMaskStyle.value = undefined;
  window.removeEventListener("mousemove",mouseMove);
  window.removeEventListener("mouseup",mouseUp);
}


export default function(){
  return {
    mouseDown,
    mouseMove,
    mouseUp,
    selectMaskStyle
  }
}