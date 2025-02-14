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
    const { focusUnit,moveUnit } = usePageData();
    const { moveCanvas } = useUnitMove();
    const basicOffsetLeft = ref<number>(0);
    const basicOffsetTop = ref<number>(0);
    const lastTop = ref();
    const lastLeft = ref();

    function mouseDown(e:MouseEvent){
      basicOffsetLeft.value = e.offsetX;
      basicOffsetTop.value = e.offsetY;

      focusUnit(props.unit.id);
      window.addEventListener("mousemove",mouseMove);
      window.addEventListener("mouseup",mouseUp);

    }
    function mouseMove(e:MouseEvent){
      if(moveCanvas.value){
        let top:number
        let left:number
        if(lastLeft.value !== void 0 && lastTop.value !== void 0){
          top = (props.unit.position.top as number) - (- e.clientY + lastTop.value);
          left = (props.unit.position.left as number) - (- e.clientX + lastLeft.value);
        }
        else{
          top = props.unit.position.top as number;
          left = props.unit.position.left as number;
        }
        lastTop.value = e.clientY;
        lastLeft.value = e.clientX;
        moveUnit(props.unit.id,{top,left});
        
      }

    }
    console.log('render')
    function mouseUp(){
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