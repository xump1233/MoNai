const DragState = {
  START:"start",
  DRAGGING:"dragging",
  END:"end",
} as const

const ERRORMAP = {
  "Failed to fetch":""
}


export {
  DragState,
  ERRORMAP,
}