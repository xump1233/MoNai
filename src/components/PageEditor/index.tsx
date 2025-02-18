import { defineComponent } from "vue";
import "./index.less"

import OperateBar from "./components/OperateBar";
import ComponentStore from "./components/ComponentStore";
import EditorCanvas from "./components/EditorCanvas";
import PropsEditor from "./components/PropsEditor";

import useCommend from "@/hooks/useCommend";

export default defineComponent({
  props:{

  },
  setup(){
    useCommend();
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