import { ref,Ref } from "vue";

export default function({isKeySpace,}:{isKeySpace:Ref<boolean>}){
  const beginScrollTop = ref<number>(0);
  const beginScrollLeft = ref<number>(0);
  const beginClientX = ref<number>(0);
  const beginClientY = ref<number>(0);
  const moveContainer = ref<HTMLElement>();
  const scrollContainer = ref<HTMLElement>();
  function moveCanvasDown(e:MouseEvent){
    beginClientX.value = e.clientX;
    beginClientY.value = e.clientY;
    if(isKeySpace.value){
      moveContainer.value?.classList.add("grabbing");
    }else{
      return;
    }
    if(scrollContainer.value){
      beginScrollLeft.value = scrollContainer.value.scrollLeft;
      beginScrollTop.value = scrollContainer.value.scrollTop;
    }
    window.addEventListener("mousemove",moveCanvasMove);
    window.addEventListener("mouseup",moveCanvasUp);
  }
  function moveCanvasMove(e:MouseEvent){
    if(scrollContainer.value){
      scrollContainer.value.scrollTo({
        top:beginScrollTop.value - (e.clientY - beginClientY.value),
        left:beginScrollLeft.value - (e.clientX - beginClientX.value),
      })
    }
  }
  function moveCanvasUp(_:MouseEvent){
    if(isKeySpace.value){
      moveContainer.value?.classList.remove("grabbing");
    }
    window.removeEventListener("mousemove",moveCanvasMove);
    window.removeEventListener("mouseup",moveCanvasUp)
  }

  function setElements(eles:{moveContainer:HTMLElement,scrollContainer:HTMLElement}){
    moveContainer.value = eles.moveContainer;
    scrollContainer.value = eles.scrollContainer;

  }
  return {
    moveCanvasDown,
    setElements,
  }
}