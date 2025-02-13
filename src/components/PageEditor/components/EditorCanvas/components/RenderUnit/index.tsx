// import { defineComponent,PropType, ref, watch  } from "vue";

// import "./index.less"
// import type { IComponentUnit } from "@/interface";
// import { registerConfig as config } from "@/hooks/useEditorConfig";

// export default defineComponent({
//   props:{
//     unit:{
//       type:Object as PropType<IComponentUnit>
//     }
//   },
//   setup(props){

//     const unitPosition = ref<any>({});
//     if(props.unit){
//       unitPosition.value = props.unit?.position && {
//         top:typeof props.unit?.position.top === 'string' ? props.unit?.position.top : props.unit?.position.top + "px",
//         left:typeof props.unit?.position.left === 'string' ? props.unit?.position.left : props.unit?.position.left + "px",
//         zIndex:props.unit?.position.zIndex
//       }
//       const RenderComponent = config.componentMap[props.unit?.type].render;
//       return ()=>(
//         <div style={unitPosition.value} class="render-unit">
//           <RenderComponent></RenderComponent>
//         </div>
//       )
//     }
//   }
// })
import { defineComponent, PropType,watch } from "vue";
import type { IComponentUnit } from "@/interface";
import { registerConfig as config } from "@/hooks/useEditorConfig";

export default defineComponent({
  props: {
    unit: {
      type: Object as PropType<IComponentUnit>,
      required: true,
    },
  },
  setup(props) {

    const RenderComponent = config.componentMap[props.unit?.type].render;
    return () => (
      <div
        class={`component-unit`}
        style={{
          position: 'absolute',
          top: `${props.unit.position.top}px`,
          left: `${props.unit.position.left}px`,
          zIndex: props.unit.position.zIndex,
        }}
      >
        <RenderComponent></RenderComponent>
      </div>
    );
  },
});