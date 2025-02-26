import { defineComponent,PropType,watch } from "vue";
import "./index.less"

import CodeEditor from "../CodeEditor";
import { 
  NModal,
  NCard,
  NButton,
  NTabs,
  NTabPane,
  NDynamicInput,
  NInput,
  NSelect,
} from "naive-ui"
import { IComponentUnit } from "@/interface";



export default defineComponent({
  props:{
    show:{
      type:Boolean
    },
    onClose:{
      type:Function
    },
    unit:{
      type:Object as PropType<IComponentUnit | undefined>
    }
  },
  setup(props){
    watch(()=>props.unit,()=>{
      console.log(props.unit)
    })
    return ()=>(
      <NModal
        to={"body"}
        show={props.show}
        onMaskClick={()=>{
          props.onClose && props.onClose();
        }}
      >
        <NCard
          style={{
            width:"700px",
            height:"500px"
          }}
          title={"为组件添加逻辑"}
          contentStyle={{
            overflowX:"hidden",
            overflowY:"auto"
          }}
          v-slots={{
            "footer":()=><div style={{display:"flex",justifyContent:"flex-end"}}>
              <NButton type="success" style={{marginRight:"20px"}}>确定</NButton>
              <NButton type="warning" onClick={()=>{
                props.onClose && props.onClose();
              }}>关闭</NButton>
            </div>,
            "header-extra":()=><div onClick={()=>{
              props.onClose && props.onClose();
            }}>x</div>
          }}
        >
          <div style={{width:"100%",height:"100%"}}>
            <NTabs style={{width:"100%",height:"100%"}} type="card" placement="left">
              <NTabPane 
                name="初始化" 
                style={{display:"flex",flexDirection:"column"}}
              >
                <NDynamicInput
                  style={{
                    marginBottom:"10px"
                  }}
                >
                  <div style="display: flex; align-items: center; width: 100%">
                    <NInput style={{width:"35%"}} placeholder={"变量名"}></NInput>
                    <NSelect placeholder={"请选择变量"}></NSelect>
                  </div>
                </NDynamicInput>
                <CodeEditor style={{flex:1}}></CodeEditor>
              </NTabPane>
              <NTabPane name="卸载前">
                
              </NTabPane>
              <NTabPane name="更新时">
                
              </NTabPane>
            </NTabs>
          </div>
        </NCard>
      </NModal>
    )
  }
})