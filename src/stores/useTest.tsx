import { defineStore } from "pinia";
import { reactive } from "vue";


export default defineStore("test",()=>{
  const componentMap = reactive({});

  return {
    componentMap
  }
})