import { ref } from "vue";
import type { IBottomBarItem } from "@/interface";


const barList = ref<IBottomBarItem[]>([{name:"test"}]);


function pushItem(item:IBottomBarItem){
  barList.value.push(item);
}

function removeItem(id:string){
  barList.value = barList.value.filter((item:IBottomBarItem)=>{
    if(item.name === id){
      item.cb && item.cb();
    }
    return item.name !== id
  })
}


export default function(){

  
  return {
    barList,
    pushItem,
    removeItem,
  }
}