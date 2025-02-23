import { defineComponent, onMounted, ref } from "vue";

import loader from '@monaco-editor/loader';
import IDLE from "monaco-themes/themes/IDLE.json"

import throttle from "@/utils/throttle";

export default defineComponent({
  props:{
    width:{
      type:Number
    },
    height:{
      type:Number
    },
    initCode:{
      type:String
    },
    onUpdate:{
      type:Function
    }
  },
  setup(props){
    const editorContainer = ref<HTMLElement>();
    let monacoInstance:any;

    function getValue(){
      console.log(monacoInstance.getValue())
    }
    let onUpdate:Function;
    if(props.onUpdate){
      onUpdate = throttle(props.onUpdate,500);
    }

    onMounted(()=>{
      loader.init().then((monaco) =>{
        if(editorContainer.value){
          monacoInstance = monaco.editor.create(editorContainer.value,{
            value:props.initCode || "// 从下方编写你的代码",
            language:"javascript",
            theme:"vs",
          });
          monaco.editor.defineTheme('mytheme', IDLE);
          monaco.editor.setTheme('mytheme');
          monacoInstance.onDidChangeModelContent(()=>{
            onUpdate && onUpdate(monacoInstance.getValue());
          });
        }
      })
        
        
      
    })
    return ()=>(
      <>
      <div 
        ref={editorContainer}
        style={{
          width:(props.width || 500) + "px",
          height:(props.height || 500) + "px"
        }}
      ></div>
      <button onClick={()=>{
        console.log("get")
        getValue();
      }}>点击</button>
      </>
    )
  }
})

