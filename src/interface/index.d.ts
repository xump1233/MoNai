import { DragState } from "@/constant"


interface IBasicComponent {
  label:string;
  name:string;
  type:"form" | "chart" | "media" | "extends" | "tem";
  defaultWidth:number;
  defaultHeight:number;
  preview:(props?:any)=>any;
  render:(props?:any)=>any;
  props?:any,
  contextProps?:{name:string,description:string}[]
  editProps:any,
  logicList:any,
}

interface IComponentUnit {
  name:string;
  id:string;
  type:string;
  alias?:string;
  props?:Record<string,any>;
  position:{
    top:number;
    left:number;
    zIndex:number;
  }
  temporaryTarget?:string;
  isMoveFocus?:boolean;
}

interface IPageData {
  pageContainer:{
    width:number | string,
    height:number | string,
    currentReta:number,
  },
  components:IComponentUnit[],
  logics:Record<string,Record<string,ILogicItem>>
}

interface ILogicItem {
  varList:{name:string,value:string}[],
  code:string,
}

interface IBottomBarItem {
  name:string;
  cb?:()=>void;
  textColor?:string;
  bgColor?:string;
  icon?:any
}


type DragStateType = typeof DragState[keyof typeof DragState];

export {
  DragUnit,
  DragStateType,
  IBasicComponent,
  IComponentUnit,
  IPageData,
  IBottomBarItem,
  ILogicItem,
}