import { ref } from "vue";
import usePageData from "@/hooks/usePageData";
import type { IComponentUnit } from "@/interface";


export default function(id:string){
  const { 
    focusUnit,
    unFocusAllUnit,
    moveFocusUnit,
    isFocus,
    setLines,
    unFocusList,
    findUnit,
  } = usePageData();
  const lastTop = ref();
  const lastLeft = ref();
  const currentUnitId = ref<string>();
  const startX = ref<number>();
  const startY = ref<number>();

  function mouseDown(e:MouseEvent){
    e.stopPropagation();
    startX.value = e.clientX;
    startY.value = e.clientY;
    lastLeft.value = undefined;
    lastTop.value = undefined;
    if(isFocus(id)){
      currentUnitId.value = id;
      window.addEventListener("mousemove",mouseMove);
      window.addEventListener("mouseup",mouseUp);
      return;
    }
    if(e.ctrlKey){
      focusUnit(id);
    }
    else{
      unFocusAllUnit();
      focusUnit(id);
    }
    
    
  }
  function mouseMove(e:MouseEvent){
    let offsetTop:number;
    let offsetLeft:number;
    if(lastLeft.value !== void 0 && lastTop.value !== void 0){
      offsetTop =  - (- e.clientY + lastTop.value);
      offsetLeft =  - (- e.clientX + lastLeft.value);
    }
    else{
      offsetTop = 0;
      offsetLeft = 0;
    }
    lastTop.value = e.clientY;
    lastLeft.value = e.clientX;
    moveFocusUnit({offsetTop,offsetLeft});
    const { unit } = findUnit(currentUnitId.value as string);

    const lines:{x:Set<number>,y:Set<number>} = {x:new Set(),y:new Set()};
    // TODO 吸附
    // let newOffsetTop:number = 0;
    // let newOffsetLeft:number = 0;
    if(unit){
      const { top,left } = unit.position as {top:number,left:number};
      const BTop = top + offsetTop;
      const BLeft = left + offsetLeft;
      const { width:BWidth, height:BHeight} = unit.props as {width:number,height:number};
      unFocusList.value.forEach((unit:IComponentUnit)=>{
        const { top:ATop,left:ALeft } = unit.position as {top:number,left:number};
        const { width:AWidth, height:AHeight} = unit.props as {width:number,height:number};
        if(Math.abs(ATop - BTop) < 2){
          lines.y.add(ATop);
          // newOffsetTop = ATop - BTop;
        }
        if(Math.abs(ATop - (BTop + BHeight)) < 2){
          lines.y.add(ATop);
          // newOffsetTop = ATop - (BTop + BHeight);
        }
        if(Math.abs((ATop + AHeight/2)-(BTop + BHeight/2)) < 2){
          lines.y.add(ATop + AHeight/2);
          // newOffsetTop = (ATop + AHeight/2)-(BTop + BHeight/2);
        }
        if(Math.abs((ATop + AHeight) - BTop) < 2){
          lines.y.add(ATop + AHeight);
          // newOffsetTop = (ATop + AHeight) - BTop;
        }
        if(Math.abs((ATop + AHeight) - (BTop + BHeight)) < 2){
          lines.y.add(ATop + AHeight);
          // newOffsetTop = (ATop + AHeight) - (BTop + BHeight);
        }
        if(Math.abs(BLeft - ALeft) < 2){
          lines.x.add(ALeft);
          // newOffsetLeft = BLeft - ALeft;
        }
        if(Math.abs((ALeft + AWidth) - BLeft) < 2){
          lines.x.add(ALeft + AWidth);
          // newOffsetLeft = (ALeft + AWidth) - BLeft;
        }
        if(Math.abs((ALeft + AWidth/2) - (BLeft + BWidth/2)) < 2){
          lines.x.add(ALeft + AWidth/2);
          // newOffsetLeft = (ALeft + AWidth/2) - (BLeft + BWidth/2);
        }
        if(Math.abs(ALeft - (BLeft + BWidth)) < 2){
          lines.x.add(ALeft);
          // newOffsetLeft = ALeft - (BLeft + BWidth);
        }
        if(Math.abs((ALeft + AWidth) - (BLeft + BWidth)) < 2){
          lines.x.add(ALeft + AWidth);
          // newOffsetLeft = (ALeft + AWidth) - (BLeft + BWidth);
        }
      })
    }
    setLines(lines);
    
  }
  function mouseUp(){
    setLines(undefined);
    window.removeEventListener("mousemove",mouseMove);
    window.removeEventListener("mouseup",mouseUp);
  }
  return {
    mouseDown,
  }
}