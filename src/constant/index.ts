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
      "currentReta":1
    },
    "components":[],
    "logics":{}
  }`,
  "template1":`{
    "pageContainer":{
      "width":1280,
      "height":1024,
      "currentReta":1
    },
    "components":[],
    "logics":{}
  }`,
  "template2":`{
    "pageContainer":{
      "width":1280,
      "height":768,
      "currentReta":1
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