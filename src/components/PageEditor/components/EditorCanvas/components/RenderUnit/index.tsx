import { defineComponent, PropType, ref, onMounted } from "vue";
import type { IComponentUnit } from "@/interface";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import "./index.less"
import usePageData from "@/hooks/usePageData";
import useUnitMove from "@/hooks/useUnitMove";

export default defineComponent({
  props: {
    unit: {
      type: Object as PropType<IComponentUnit>,
      required: true,
    },
  },
  setup(props) {
    const RenderComponent = config.componentMap[props.unit?.type].render;
    const unitRef = ref<HTMLElement | null>(null);
    const { focusUnit,unFocusUnit,moveUnit,moveFocusUnit } = usePageData();
    const { moveCanvas,moveUnitList } = useUnitMove();
    const lastTop = ref();
    const lastLeft = ref();

    function mouseDown(e:MouseEvent){
      e.stopPropagation();
      lastLeft.value = undefined;
      lastTop.value = undefined;
      moveUnitList.value.push(props.unit.id);
      if(e.ctrlKey){
        focusUnit(props.unit.id);
      }
      else{
        focusUnit(props.unit.id);
        window.addEventListener("mousemove",mouseMove);
        window.addEventListener("mouseup",mouseUp);
      }
    }
    function mouseMove(e:MouseEvent){
      if(moveCanvas.value){
        let offsetTop:number
        let offsetLeft:number
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
        if(moveUnitList.value.length > 1){
          moveFocusUnit({offsetTop,offsetLeft});
        }
        else{
          moveUnit(props.unit.id,{offsetTop,offsetLeft});
        }
        
      }

    }
    function mouseUp(){
      if(moveUnitList.value.length === 1){
        unFocusUnit(props.unit.id);
        moveUnitList.value = moveUnitList.value.filter((item:string)=>item !== props.unit.id)
      }
      window.removeEventListener("mousemove",mouseMove);
      window.removeEventListener("mouseup",mouseUp);
    }

    onMounted(()=>{
      if(unitRef.value){
        unitRef.value.addEventListener("mousedown",mouseDown);
      }
    })
    return () => (
      <div
        class={`render-unit ${props.unit.isMoveFocus ? "unit-focus" : ""}`}
        style={{
          top: `${props.unit.position.top}px`,
          left: `${props.unit.position.left}px`,
          zIndex: props.unit.position.zIndex,
        }}
        ref={unitRef}
      >
        <RenderComponent></RenderComponent>
      </div>
    );
  },
});