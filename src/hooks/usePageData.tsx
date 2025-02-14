import type { IComponentUnit, IPageData } from "@/interface";
import { ref } from "vue";


const pageData = ref<IPageData>({
  pageContainer:{
    width:550,
    height:550,
  },
  components:[{
    name:'input',
    id:"fweqrqwer1",
    type:"input",
    position:{
      top:30,
      left:30,
      zIndex:1
    }
  },{
    name:'text',
    id:"fweqrqwer2",
    type:"text",
    position:{
      top:300,
      left:300,
      zIndex:1
    }
  },{
    name:'button',
    id:"fweqrqwer3",
    type:"button",
    position:{
      top:400,
      left:100,
      zIndex:1
    }
  },]
});
let temporaryComponent:IComponentUnit | null = null;
function pushComponent(unit:IComponentUnit){
  componentLeave();
  pageData.value.components.push(unit);
}

function componentOver(position: { top: number; left: number; zIndex: number }) {
  if (temporaryComponent) {
    temporaryComponent.position = position;
    // 使用 Vue 提供的响应式方法修改数组
    const newComponents = pageData.value.components.filter((item: IComponentUnit) => !item.isTemporary);
    newComponents.push(JSON.parse(JSON.stringify(temporaryComponent)));
    pageData.value.components = newComponents;
  } else {
    temporaryComponent = {
      name: 'temporary',
      id: `temporary-${Date.now()}`, // 使用时间戳生成唯一的ID
      type: "temporary",
      position: position,
      isTemporary: true,
    };
    // 使用 Vue 提供的响应式方法修改数组
    pageData.value.components.push(temporaryComponent);
  }
}
function componentLeave(){
  pageData.value.components.pop();
  temporaryComponent = null;
}

function findUnit(id:string){
  const unitIndex = pageData.value.components.findIndex((item:IComponentUnit)=>item.id === id);
  if(unitIndex === -1){
    return {
      unitIndex:-1,
      unit:undefined,
    };
  }
  return {
    unitIndex,
    unit:pageData.value.components[unitIndex],
  }
}
function focusUnit(id:string){
  const { unitIndex,unit } = findUnit(id);
  if(!unit){
    return false;
  }
  return pageData.value.components.splice(unitIndex,1,{
    ...unit,
    isMoveFocus:true,
  })

}
function moveUnit(id:string,position:{top:number,left:number}){
  const { unitIndex,unit } = findUnit(id);
  if(!unit){
    console.log("未找到该组件");
    return false;
  }
  console.log("change")
  return pageData.value.components.splice(unitIndex,1,{
    ...unit,
    position:{
      ...unit.position,
      ...position,
    }
  })

}

export default function(){
  return {
    pageData,
    pushComponent,
    componentOver,
    componentLeave,
    focusUnit,
    moveUnit
  }
}