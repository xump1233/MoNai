import type { IBasicComponent } from "@/interface"

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
  defaultWidth:100,
  defaultHeight:50,
  preview:()=><div>text</div>,
  render:()=><div>render</div>,
})

registerConfig.register({
  label:"按钮",
  name:"button",
  defaultWidth:70,
  defaultHeight:30,
  preview:()=><button>text</button>,
  render:()=><button>render</button>,
})

registerConfig.register({
  label:"输入框",
  name:"input",
  defaultWidth:150,
  defaultHeight:30,
  preview:()=><input placeholder="preview"></input>,
  render:()=><input placeholder="render"></input>,
})

registerConfig.register({
  label:"投影",
  name:"temporary",
  defaultWidth:100,
  defaultHeight:50,
  preview:()=><div placeholder="preview"></div>,
  render:(props:any)=>{
    
    return (
      <div style={{width:props.size.width + "px",height:props.size.height + "px",backgroundColor:"#999",opacity:0.2,border:"1px solid #333"}}></div>
    )
  },
})

