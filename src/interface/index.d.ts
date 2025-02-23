import { DragState } from "@/constant"


interface IBasicComponent {
  label:string;
  name:string;
  defaultWidth:number;
  defaultHeight:number;
  preview:(props?:any)=>any;
  render:(props?:any)=>any;
}

interface IComponentUnit {
  name:string;
  id:string;
  type:string;
  props?:Record<string,any>;
  position:{
    top:number | string;
    left:number | string;
    zIndex:number | string;
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
  components:IComponentUnit[]
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
}