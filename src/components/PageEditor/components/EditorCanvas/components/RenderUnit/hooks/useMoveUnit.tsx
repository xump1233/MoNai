import { ref } from "vue";
import usePageData from "@/hooks/usePageData";
import type { IComponentUnit } from "@/interface";


export default function(id:string){
  const { 
    focusUnit,
    unFocusAllUnit,
    moveFocusUnit,
    isFocus,
    setCurrentMoveUnit,
    unFocusList,
    findUnit,
  } = usePageData();
  const lastTop = ref();
  const lastLeft = ref();
  const currentUnitRef = ref<HTMLElement>();
  const currentUnit = ref<IComponentUnit>();

  function mouseDown(e:MouseEvent){
    e.stopPropagation();
    lastLeft.value = undefined;
    lastTop.value = undefined;
    if(isFocus(id)){
      const { unit } = findUnit(id);
      if(unit){
        currentUnit.value = unit;
      }
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
    

    const lines:{x:Set<number>,y:Set<number>} = {x:new Set(),y:new Set()};
    if(currentUnit.value){
      const { top:BTop,left:BLeft } = currentUnit.value.position as {top:number,left:number};
      const { width:BWidth, height:BHeight} = currentUnit.value.props as {width:number,height:number};
      console.log(BTop,BLeft,BHeight,BWidth)
      unFocusList.value.forEach((unit:IComponentUnit)=>{
        const { top:ATop,left:ALeft } = unit.position as {top:number,left:number};
        const { width:AWidth, height:AHeight} = unit.props as {width:number,height:number};
        if(Math.abs(ATop - BTop) < 2){
          lines.y.add(ATop);
        }
        if(Math.abs(ATop - (BTop + BHeight)) < 2){
          lines.y.add(ATop);
        }
        if(Math.abs((ATop + AHeight/2)-(BTop + BHeight/2)) < 2){
          lines.y.add(ATop + AHeight/2);
        }
        if(Math.abs((ATop + AHeight) - BTop) < 2){
          lines.y.add(ATop + AHeight);
        }
        if(Math.abs((ATop + AHeight) - (BTop + BHeight)) < 2){
          lines.y.add(ATop + AHeight);
        }
        if(Math.abs(5) < 2){
          
        }
      })
    }
    console.log(lines)

  }
  function mouseUp(){
    window.removeEventListener("mousemove",mouseMove);
    window.removeEventListener("mouseup",mouseUp);
  }
  function setUnitRef(ele:HTMLElement){
    currentUnitRef.value = ele;
  }
  return {
    mouseDown,
    setUnitRef
  }
}