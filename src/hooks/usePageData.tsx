import type { IBasicComponent, IComponentUnit, ILogicItem, IPageData,  } from "@/interface";
import { computed, ref } from "vue";


const pageData = ref<IPageData>({
  pageContainer:{
    width:1980,//1980px,1280,800
    height:1080,//1080px,768,600
    currentReta:0.5,
  },
  components:[{
    name:'input',
    id:"fweqrqwer1",
    type:"input",
    position:{
      top:30,
      left:30,
      zIndex:33
    }
  },{
    name:'text',
    id:"fweqrqwer2",
    type:"text",
    position:{
      top:300,
      left:300,
      zIndex:33
    }
  },{
    name:'button',
    id:"fweqrqwer3",
    type:"button",
    position:{
      top:400,
      left:100,
      zIndex:33
    }
  },],
  logics:{}
});
function setWidthAndHeight(id:string,widthAndHeight:{width:number,height:number}){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    if(unit.id === id){
      if(unit.props){
        unit.props = {
          ...unit.props,
          ...widthAndHeight,
        }
      }else{
        unit.props = widthAndHeight;
      }
    }
  })
}
function setPropsById(id:string,props:any){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    if(unit.id === id){
      if(unit.props){
        unit.props = {
          ...unit.props,
          ...props,
        }
      }else{
        unit.props = props;
      }
    }
  })
}
function setLogicById(id:string,logicName:string,logicItem:ILogicItem){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    if(unit.id === id){
      if(pageData.value.logics[id]){
        const targetLogics = pageData.value.logics[id];
        targetLogics[logicName] = logicItem;
      }else{
        const logic = {
          [logicName]:logicItem
        }
        pageData.value.logics[id] = logic
      }
    }
  })
}
function zIndexMoveUpAndDown(id:string,op:"up" | "down"){
  const { unit } = findUnit(id);
  if(unit){
    const { top,left,zIndex } = unit.position;
    const { width,height } = unit.props as {width:number,height:number}; 
    let minGup = Number.MAX_VALUE;
    pageData.value.components.forEach((item:IComponentUnit)=>{
      if(item.id === unit.id){
        return
      }
      const {top:cTop,left:cLeft,zIndex:CZIndex} = item.position;
      const { width:CWidth,height:CHeight } = item.props as {width:number,height:number};
      const judgeX = (( cLeft >= left && cLeft <= left + width) || (cLeft + CWidth >= left && cLeft+CWidth <= left + width));
      const judgeY = (( cTop >= top  && cTop <= top + height) || (cTop+CHeight >= top  && cTop+CHeight <= top + height));
      if(judgeX || judgeY){
        if(op === "up" && CZIndex >= zIndex && CZIndex-zIndex<minGup){
          minGup = CZIndex-zIndex;
        }else if(op === "down" && CZIndex <= zIndex && zIndex-CZIndex<minGup){
          minGup = zIndex - CZIndex;
        }
      }
    })
    if(minGup !== Number.MAX_VALUE){
      unit.position = {
        ...unit.position,
        zIndex:zIndex + (op === "up" ? 1+minGup : -1-minGup)
      }
    }
  }
}
function removeComponent(id:string){
  pageData.value.components = pageData.value.components.filter((i:IComponentUnit)=>i.id !== id)
}


let temporaryComponent:IComponentUnit | null = null;
function pushComponent(unit:IComponentUnit){
  componentLeave();
  pageData.value.components.push(unit);
}
function componentOver(target:IBasicComponent,position: { top: number; left: number; zIndex: number }) {
  if (temporaryComponent) {
    temporaryComponent.position = position;
    // 使用 Vue 提供的响应式方法修改数组
    const newComponents = pageData.value.components.filter((item: IComponentUnit) => !item.temporaryTarget);
    newComponents.push(JSON.parse(JSON.stringify(temporaryComponent)));
    pageData.value.components = newComponents;
  } else {
    temporaryComponent = {
      name: 'temporary',
      id: `temporary-${Date.now()}`, // 使用时间戳生成唯一的ID
      type: "temporary",
      position: position,
      temporaryTarget: target.name,
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


const moveUnitList = ref<string[]>([]);
const lines = ref<{x:Set<number>,y:Set<number>}>();
const unFocusList = computed(()=>{
  return pageData.value.components.filter((unit:IComponentUnit)=>{
    return !unit.isMoveFocus
  })
})
function setLines(newLines:{x:Set<number>,y:Set<number>} | undefined){
  lines.value = newLines
}
function focusUnit(id:string){
  const { unitIndex,unit } = findUnit(id);
  if(!unit){
    return false;
  }
  moveUnitList.value.push(id);
  return pageData.value.components.splice(unitIndex,1,{
    ...unit,
    isMoveFocus:true,
  })
}
function unFocusUnit(id:string){
  const { unitIndex,unit } = findUnit(id);
  if(!unit){
    return false;
  }
  moveUnitList.value = moveUnitList.value.filter((item:string)=>item !== id)
  return pageData.value.components.splice(unitIndex,1,{
    ...unit,
    isMoveFocus:false,
  })
}
function unFocusAllUnit(){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    if(unit.isMoveFocus){
      unFocusUnit(unit.id);
    }
  })
  moveUnitList.value = [];
}
function isFocus(id:string){
  const { unit } = findUnit(id);
  if(!unit){
    return false;
  }
  return unit.isMoveFocus
}
function focusRangeUnit(begin:{top:number,left:number},end:{top:number,left:number}){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    const top = unit.position.top as number;
    const left = unit.position.left as number;
    const condition = (top >= begin.top && top <= end.top) && (left >= begin.left && left <= end.left);
    if(condition){
      focusUnit(unit.id);
    }
  })
}
function moveUnit(id:string,position:{offsetTop:number,offsetLeft:number}){
  const { unitIndex,unit } = findUnit(id);
  if(!unit){
    console.log("未找到该组件");
    return false;
  }
  return pageData.value.components.splice(unitIndex,1,{
    ...unit,
    position:{
      top:unit.position.top as number + position.offsetTop,
      left:unit.position.left as number + position.offsetLeft,
      zIndex:unit.position.zIndex,
    }
  })
}
function moveFocusUnit(position:{offsetLeft:number,offsetTop:number}){
  pageData.value.components.forEach((unit:IComponentUnit)=>{
    if(unit.isMoveFocus){
      moveUnit(unit.id,position);
    }
  })
}


export default function(){
  return {
    pageData,
    pushComponent,
    componentOver,
    componentLeave,

    findUnit,
    unFocusList,
    focusUnit,
    unFocusUnit,
    unFocusAllUnit,
    focusRangeUnit,
    isFocus,
    moveFocusUnit,
    moveUnitList,
    lines,
    setLines,

    setWidthAndHeight,
    setPropsById,
    setLogicById,
    zIndexMoveUpAndDown,
    removeComponent,
  }
}