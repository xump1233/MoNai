import { defineComponent } from "vue";
import "./index.less"

import OperateBar from "./components/OperateBar";
import ComponentStore from "./components/ComponentStore";
import EditorCanvas from "./components/EditorCanvas";
import PropsEditor from "./components/PropsEditor";

export default defineComponent({
  props:{

  },
  setup(props){
    return ()=>(
      <div class="page-editor">
        <OperateBar></OperateBar>
        <div class="editor-container">
          <ComponentStore></ComponentStore>
          <EditorCanvas></EditorCanvas>
          <PropsEditor></PropsEditor>
        </div>
      </div>
    )
  }
})