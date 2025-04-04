import { defineComponent,PropType,ref,nextTick } from "vue";
import "./index.less"
import { registerConfig as config } from "@/hooks/useEditorConfig";
import usePageData from "@/hooks/usePageData";

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
  NTag,
  NPopover,
} from "naive-ui"
import { IComponentUnit, ILogicItem } from "@/interface";



export default defineComponent({
  props:{
    show:{
      type:Boolean
    },
    onClose:{
      type:Function
    },
    onOk:{
      type:Function
    },
    unit:{
      type:Object as PropType<IComponentUnit | undefined>
    }
  },
  setup(props){
    const { pageData,setLogicById } = usePageData();

    const curLogicMap = ref<Record<string,ILogicItem>>({});

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
            width:"800px",
            height:"600px"
          }}
          title={"为组件添加逻辑"}
          contentStyle={{
            overflowX:"hidden",
            overflowY:"auto"
          }}
          v-slots={{
            "footer":()=><div style={{display:"flex",justifyContent:"flex-end"}}>
              <NButton type="success" style={{marginRight:"20px"}} onClick={()=>{
                props.onOk && props.onOk();
              }}>确定</NButton>
              <NButton type="warning" onClick={()=>{
                props.onClose && props.onClose();
              }}>关闭</NButton>
            </div>,
            "header-extra":()=><div onClick={()=>{
              props.onClose && props.onClose();
            }}>
              <svg class="icon" style={{cursor:"pointer"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4821" width="16" height="16"><path d="M426.827294 512l-421.647059-421.647059L90.352941 5.180235l421.647059 421.647059 421.647059-421.647059L1018.819765 90.352941l-421.647059 421.647059 421.647059 421.647059L933.647059 1018.819765l-421.647059-421.647059-421.647059 421.647059L5.180235 933.647059l421.647059-421.647059z" fill="#000000" p-id="4822"></path></svg>
            </div>
          }}
        >
          <div style={{width:"100%",height:"100%"}}>
            <NTabs style={{width:"100%",height:"100%"}} type="card" placement="left">
              {props.unit && (()=>{
                const schemaLogic = pageData.value.logics[props.unit.id];
                const component = config.componentMap[props.unit.name];
                const logics = [];
                const options = pageData.value.components.map((u:IComponentUnit)=>{
                  return {
                    label:u.name,
                    value:u.id,
                    alias:u.alias,
                  }
                })
                for(let key in component.logicList){
                  let varList:{name:string,value:string}[] = [];
                  let initCode:string = '';
                  if(schemaLogic && schemaLogic[key]){
                    varList = schemaLogic[key].varList;
                    initCode = schemaLogic[key].code;
                  }
                  curLogicMap.value[key] = {
                    varList,
                    code:initCode,
                  }
                  

                  logics.push((
                    <NTabPane 
                      name={component.logicList[key]} 
                      style={{display:"flex",flexDirection:"column"}}
                    >
                      <NDynamicInput
                        value={curLogicMap.value[key].varList}
                        style={{
                          marginBottom:"10px"
                        }}
                        onCreate={(_)=>{
                          curLogicMap.value[key].varList.push({name:'',value:''});
                          nextTick(()=>{
                            setLogicById(props.unit?.id as string,key,curLogicMap.value[key])
                          })
                        }}
                        onRemove={(index:number)=>{
                          curLogicMap.value[key].varList = curLogicMap.value[key].varList.filter((_,i:number)=>{
                            return i !== index
                          })
                          nextTick(()=>{
                            setLogicById(props.unit?.id as string,key,curLogicMap.value[key])
                          })
                        }}
                        v-slots={{
                          "create-button-default":()=>{
                            return <div>添加变量</div>
                          },
                          "default":(item:{value:{name:string,value:string},index:number})=>{
                            
                            return (
                              <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                                <NInput value={item.value.name} onUpdate:value={(value:string)=>{
                                  item.value.name = value
                                  nextTick(()=>{
                                    setLogicById(props.unit?.id as string,key,curLogicMap.value[key])
                                  })
                                }} style={{width:"35%"}} placeholder={"变量名"}></NInput>
                                <NSelect 
                                  value={item.value.value} 
                                  options={options}
                                  filterable
                                  filter={(pattern: string, option: object)=>{
                                    const Toption = option as {label:string,value:string,alias:string};
                                    const label = config.componentMap[Toption.label].label || ""
                                    if(label.indexOf(pattern) !== -1){
                                      return true;
                                    }
                                    for(const key in Toption){
                                      if((Toption[(key as "label" | "alias" | "value")] || "").indexOf(pattern) !== -1){
                                        return true
                                      }
                                    }
                                    return false
                                  }}
                                  renderLabel={(item:{label:string,value:string,alias?:string})=>{
                                    
                                    return <div style={{display:"flex"}}>
                                      {item.label === "" ?
                                        <>
                                          <div>请选择变量</div>
                                        </> :
                                        <>
                                          <NPopover
                                            trigger="hover"
                                            v-slots={{
                                              trigger:()=>(
                                              <div style={{display:"flex",alignItems:"center"}}>
                                                <NTag type="success">{config.componentMap[item.label].label}</NTag>
                                                <div style={{marginLeft:"10px"}}>{item.alias || item.value}</div>
                                              </div>
                                              ),
                                        
                                            }}
                                            disabled={!(config.componentMap[item.label].contextProps)}
                                            
                                          >
                                            {config.componentMap[item.label].contextProps && (
                                              <div>
                                                <div>该元素所含属性：</div>
                                                {config.componentMap[item.label].contextProps?.map((v:{name:string,description:string})=>{
                                                  return <div>
                                                    <div>{v.name}:{v.description}</div>
                                                  </div>
                                                })}
                                              </div>
                                            )}
                                           
                                          </NPopover>
                                        </>
                                      }
                                      
                                    </div>
                                  }} 
                                  onUpdate:value={(value)=>{
                                    item.value.value = value
                                    nextTick(()=>{
                                      setLogicById(props.unit?.id as string,key,curLogicMap.value[key])
                                  })
                                }} placeholder={"请选择变量"}></NSelect>
                              </div>
                            )
                          }
                        }}
                      >
                      </NDynamicInput>
                      <CodeEditor style={{flex:1}} initCode={curLogicMap.value[key].code} onUpdate={(code:string)=>{
                          curLogicMap.value[key].code = code;
                          nextTick(()=>{
                            setLogicById(props.unit?.id as string,key,curLogicMap.value[key])
                          })
                      }}></CodeEditor>
                    </NTabPane>
                  ))
                }
                return logics
              })()}
            </NTabs>
          </div>
        </NCard>
      </NModal>
    )
  }
})