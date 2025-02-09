import { DragState } from "@/constant"


interface DragUnit {
  name:Component | string;
  c_id:string;
  props?:Record<string,any>;
  layout:any
}

type DragStateType = typeof DragState[keyof typeof DragState];

export {
  DragUnit,
  DragStateType
}