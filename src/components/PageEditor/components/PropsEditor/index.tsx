import { defineComponent,ref,watch } from "vue";
import "./index.less"


export default defineComponent({
  props:{

  },
  setup(_){

    const testValue = ref("");
    watch(()=>testValue.value,(v)=>{
      console.log(v)
    })

    return ()=>(
      <div class="page-editor-props-editor">
        canvas
        <input type="color" onInput={(e:Event)=>{
          console.log((e.target as HTMLInputElement).value)
        }}/>

        <input type="text" v-model={testValue.value}/>
      </div>
    )
  }
})