import { defineStore } from "pinia";
import { reactive } from "vue";


export default defineStore("editor-config",()=>{
  const componentMap = reactive({});
  const componentList = reactive([]);
  
  
  return {
    componentMap,
    componentList
  }
})