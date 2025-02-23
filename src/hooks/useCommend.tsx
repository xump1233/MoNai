import { ref } from "vue";
import usePageData from "./usePageData";


const { pageData } = usePageData();
  const queue = ref<string[]>([]);
  const current = ref<number>(-1);

  function snapshot(){
    while(current.value < queue.value.length-1){
      queue.value.pop();
    }
    queue.value.push(JSON.stringify(pageData.value));
    current.value ++;
  }
  function back(){

  }

export default function (){

  return {
    snapshot,
    back,
  }
}