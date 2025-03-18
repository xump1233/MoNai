import { defineComponent } from "vue";
import "./index.less"

import OperateBar from "./components/OperateBar";
import ComponentStore from "./components/ComponentStore";
import EditorCanvas from "./components/EditorCanvas";
import PropsEditor from "./components/PropsEditor";
import BottomBar from "./components/BottomBar";

import useCommend from "@/hooks/useCommend";
import usePageData from "@/hooks/usePageData";

export default defineComponent({
  props:{

  },
  setup(){
    const { getPageData } = usePageData();
    getPageData();
    useCommend();
    return ()=>(
      <div class="page-editor">
        <OperateBar></OperateBar>
        <div class="editor-container">
          <ComponentStore></ComponentStore>
          <EditorCanvas></EditorCanvas>
          <PropsEditor></PropsEditor>
        </div>
        <BottomBar></BottomBar>
      </div>
    )
  }
})