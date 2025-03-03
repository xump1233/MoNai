import type { IBasicComponent, IComponentUnit } from "@/interface"

import PreviewBox from "@/components/PreviewBox";
import PropsEditBox from "@/components/PropsEditBox";
import BasicText from "@/components/BasicComponents/BasicText";

import { 
  NButton,
  NInput,
  NInputNumber,
} from "naive-ui"

import usePageData from "./usePageData";

const { setPropsById } = usePageData();


function createEditorConfig(){
  const componentList:IBasicComponent[] = [];
  const componentMap:Record<string,IBasicComponent> = {};

  return {
    componentList,
    componentMap,
    register:(component:IBasicComponent)=>{
      componentMap[component.name] = component;
      if(component.name === "temporary") return;
      componentList.push(component);
      
    }
  }
}

export const registerConfig = createEditorConfig();

registerConfig.register({
  label:"文本",
  name:"text",
  defaultWidth:56,
  defaultHeight:22,
  preview:()=>(
    <PreviewBox>
      <div>文本</div>
    </PreviewBox>
  ),
  render:(props)=>{

    return <BasicText {...props} />
  },
  props:{},
  contextProps:[{
    name:"value",
    description:"文本内容"
  }],
  editProps:({ unit }:{
    unit:IComponentUnit
  })=>{
    return (
      <PropsEditBox>
        <div class="props-item">
          <div class="props-item-label">默认文本：</div>
          <div class="props-item-content">
            <NInput placeholder={"请输入文本内容"} value={unit.props?.value} onUpdate:value={(value:string)=>{
              setPropsById(unit.id,{value:value});
            }}></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">字体大小：</div>
          <div class="props-item-content">
            <NInputNumber placeholder="字体大小" value={unit.props?.fontSize} onUpdate:value={(value:number | null)=>{
              if(value){
                setPropsById(unit.id,{fontSize:value});
              }
            }}></NInputNumber>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">字体颜色：</div>
          <div class="props-item-content">
            <input type="color" value={unit.props?.color || "#000000"} onInput={(e:Event)=>{
              setPropsById(unit.id,{color:(e.target as HTMLInputElement).value})
            }}></input>
          </div>
        </div>
        
      </PropsEditBox>
    )
  },
  logicList:{
    "onMounted":"初始化",
    "onUpdate":"更新时"
  }
})

registerConfig.register({
  label:"按钮",
  name:"button",
  defaultWidth:72,
  defaultHeight:34,
  preview:()=>(
    <PreviewBox>
      <NButton type="primary">按钮</NButton>
    </PreviewBox>
  ),
  render:()=><NButton type="primary">render</NButton>,
  props:{

  },
  editProps:()=>(
    <PropsEditBox>
      
    </PropsEditBox>
  ),
  logicList:{
    "onMounted":"初始化"
  }
})

registerConfig.register({
  label:"输入框",
  name:"input",
  defaultWidth:181,
  defaultHeight:34,
  preview:()=>(
    <PreviewBox>
      <NInput placeholder="输入框"></NInput>
    </PreviewBox>
  ),
  render:()=><NInput placeholder="输入文本"></NInput>,
  props:{

  },
  editProps:()=>(
    <PropsEditBox>

    </PropsEditBox>
  ),
  logicList:{
    "onMounted":"初始化"
  }
})

registerConfig.register({
  label:"投影",
  name:"temporary",
  defaultWidth:100,
  defaultHeight:50,
  preview:()=><div placeholder="preview"></div>,
  render:(props:any)=>{
    
    return (
      <div style={{width:props.size.width + "px",height:props.size.height + "px",backgroundColor:"#999",opacity:0.5,border:"1px solid #333"}}></div>
    )
  },
  props:{

  },
  editProps:()=>(
    <PropsEditBox>
      
    </PropsEditBox>
  ),
  logicList:{
    "onMounted":"初始化"
  }
})

