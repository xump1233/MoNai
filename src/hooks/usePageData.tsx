import type { IBasicComponent, IComponentUnit, ILogicItem, IPageData,  } from "@/interface";
import { computed, ref } from "vue";
import getSearch from "@/utils/getSearch";
import * as Api from "@/api";
import bus from "@/utils/EventBus";




const pageData = ref<IPageData>({
  pageContainer:{
    width:1980,//1980px,1280,800
    height:1080,//1080px,768,600
    currentReta:1,
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

function changePageReta(value:number){
  pageData.value.pageContainer.currentReta = value;
}
function backPageVersion(pageJSON:string){
  try{
    const json = JSON.parse(pageJSON);
    pageData.value = json;
  }catch(err){
    (window as any).message.error("回滚异常：",err);
  }
}
function savePageData(success?:Function,error?:Function){
  const { pageId } = getSearch();
  Api.PAGE.setPageDataByPageId(pageId,{
    page_json:JSON.stringify(pageData.value),
    create_time:String(Date.now())
  }).then(res=>{
    if(res.success){
      success && success();
      bus.emit("refreshHistory");
    }else{
      error && error();
    }
  })
  console.log(JSON.stringify(pageData.value,null,2))
}
function getPageData(){
  const { pageId } = getSearch();
  Api.PAGE.getPageDataByPageId(pageId).then((res)=>{
    if(res.success){
      pageData.value = JSON.parse(res.data["page_json"]);
      return
    }
  })
}
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
function zIndexMoveUpAndDown(id: string, op: "up" | "down") {
  const { unit } = findUnit(id);
  if (!unit || !unit.props) return;

  const { top, left, zIndex } = unit.position;
  const { width = 0, height = 0 } = unit.props as { width: number; height: number };

  // 准备计算相交的组件集合
  const overlaps: IComponentUnit[] = [];

  pageData.value.components.forEach((item: IComponentUnit) => {
    if (item.id === id || !item.props) return;

    const { top: cTop, left: cLeft, zIndex: _ } = item.position;
    const { width: cWidth = 0, height: cHeight = 0 } = item.props as { width: number; height: number };

    const isOverlap =
      left < cLeft + cWidth &&
      left + width > cLeft &&
      top < cTop + cHeight &&
      top + height > cTop;

    if (isOverlap) {
      overlaps.push(item);
    }
  });

  // 找到相交组件中层级最接近的
  let targetZIndex: number | null = null;
  overlaps.forEach((item) => {
    const diff = item.position.zIndex - zIndex;

    if (op === "up" && diff > 0) {
      if (targetZIndex === null || item.position.zIndex < targetZIndex) {
        targetZIndex = item.position.zIndex;
      }
    } else if (op === "down" && diff < 0) {
      if (targetZIndex === null || item.position.zIndex > targetZIndex) {
        targetZIndex = item.position.zIndex;
      }
    }
  });

  if (targetZIndex !== null) {
    unit.position.zIndex = op === "up" ? targetZIndex + 1 : targetZIndex - 1;
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
      top:unit.position.top as number + position.offsetTop/pageData.value.pageContainer.currentReta,
      left:unit.position.left as number + position.offsetLeft/pageData.value.pageContainer.currentReta,
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
    backPageVersion,
    getPageData,
    savePageData,
    pushComponent,
    componentOver,
    componentLeave,
    changePageReta,

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