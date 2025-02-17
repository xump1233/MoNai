import { defineComponent, PropType, ref, onMounted } from "vue";
import type { IComponentUnit } from "@/interface";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import "./index.less"

import useMoveUnit from "./hooks/useMoveUnit";
import usePageData from "@/hooks/usePageData";

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
    const { mouseDown,setUnitRef } = useMoveUnit(props.unit.id);
    const { setWidthAndHeight } = usePageData();


    onMounted(()=>{
      if(unitRef.value){
        setUnitRef(unitRef.value);
        unitRef.value.addEventListener("mousedown",mouseDown);
        const { offsetWidth,offsetHeight } = unitRef.value;
        setWidthAndHeight(props.unit.id,{width:offsetWidth,height:offsetHeight});
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