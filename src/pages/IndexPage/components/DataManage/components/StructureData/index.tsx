import { defineComponent,ref } from "vue";
import "./index.less"

import {
  NButton,
  NModal,
  NCard,
  NDynamicInput,
  NInput,
  NSelect,
} from "naive-ui";

interface ITableInfo {
  name:string;
  columns:IColumnsItem[];

}
interface IColumnsItem {
  name:string;
  type:string;
  default:string;
}

// const TypeMap = {
  
// }


export default defineComponent({
  setup() {
    
    const options = [{
      label:"number",
      value:"number",
      key:"number",
    },{
      label:"string",
      value:"string",
      key:"string",
    },{
      label:"boolean",
      value:"boolean",
      key:"boolean"
    }]
    const createModalShow = ref(false);
    const newTableInfo = ref<ITableInfo>({
      name:"",
      columns:[]
    });

    return ()=>(
      <div class="struct-data-container">
        <div class={"struct-data-container-header"}>
          <NButton type="info" onClick={()=>{
            createModalShow.value = true;
          }}>创建一个表</NButton>  
          <NButton type="info">创建一个接口</NButton>
        </div>
        <div class={"struct-data-container-main"}>

        </div>
        <NModal
          show={createModalShow.value}
          style={{
            width:"700px",
            height:"600px"
          }}
          onMaskClick={()=>{
            createModalShow.value = false;
          }}
        >
          <NCard>
            <NDynamicInput
              value={newTableInfo.value?.columns}
              style={{
                marginBottom:"10px"
              }}
              onCreate={(_)=>{
                newTableInfo.value.columns.push({name:"",type:"",default:""})
              }}
              onRemove={(_:number)=>{

              }}
              v-slots={{
                "create-button-default":()=>{
                  return <div>添加一个字段</div>
                },
                "default":(item:{value:{name:string,value:string},index:number})=>{
                  
                  return (
                    <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                      <NInput value={item.value.name} onUpdate:value={(_:string)=>{

                      }} style={{width:"35%"}} placeholder={"字段名"}></NInput>
                      <NSelect 
                        value={item.value.value} 
                        options={options}
                        // filterable
                        // filter={(pattern: string, option: object)=>{
                        //   return false
                        // }}
                        
                        onUpdate:value={()=>{

                        }}
                        placeholder={"请选择类型"}
                      ></NSelect>
                    </div>
                  )
                }
              }}
            >
            </NDynamicInput>
          </NCard>
        </NModal>
      </div>
    )
  },
})