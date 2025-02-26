import { defineComponent,watch,ref } from "vue";
import "./index.less"

import usePageData from "@/hooks/usePageData";
import { registerConfig as config } from "@/hooks/useEditorConfig"


export default defineComponent({
  props:{

  },
  setup(_){
    const { moveUnitList,findUnit } = usePageData();
    const EditRender = ref();
    const currentUnit = ref();
    watch(()=>moveUnitList.value,()=>{
      if(moveUnitList.value.length === 1){
        const { unit } = findUnit(moveUnitList.value[0]);
        if(unit){
          const component = config.componentMap[unit.name];
          EditRender.value = component.editProps;
          currentUnit.value = unit;
        }
      }else if(moveUnitList.value.length === 0){
        EditRender.value = undefined;
      }
    })

    return ()=>(
      <div class="page-editor-props-editor" style={{
        display:EditRender.value ? "block" : "none",
      }}>
        <div class="props-editor-top"></div>
        <div class="props-editor-container">
          {EditRender.value && EditRender.value({unit:currentUnit.value})}
        </div>
      </div>
    )
  }
})