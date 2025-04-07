const DragState = {
  START:"start",
  DRAGGING:"dragging",
  END:"end",
} as const

const ERRORMAP = {
  "Failed to fetch":""
}

const PageTemplate:Record<string,string> = {
  "null":`{
  "pageContainer":{
    "width":1980,
    "height":1080,
    "currentReta":0.5
  },
  "components":[],
  "logics":{}
}`
}


export {
  DragState,
  ERRORMAP,
  PageTemplate
}