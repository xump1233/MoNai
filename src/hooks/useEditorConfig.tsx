import type { IBasicComponent } from "@/interface"

import PreviewBox from "@/components/PreviewBox";
import { 
  NButton,
  NInput,
} from "naive-ui"

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
  render:()=><div>默认文本</div>,
  props:{
    defaultValue:"",
    fontSize:"",
    color:""
  },
  editProps:()=>(
    <div>

      
    </div>
  )
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
    <div>
      
    </div>
  )
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
    <div>

    </div>
  )
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
    <div>
      
    </div>
  )
})

