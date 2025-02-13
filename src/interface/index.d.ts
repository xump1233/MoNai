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
  isTemporary?:boolean;
}

interface IPageData {
  pageContainer:{
    width:number | string,
    height:number | string,
  },
  components:IComponentUnit[]
}

type DragStateType = typeof DragState[keyof typeof DragState];

export {
  DragUnit,
  DragStateType,
  IBasicComponent,
  IComponentUnit,
  IPageData
}