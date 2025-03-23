import { defineComponent } from "vue";
import DataManage from "./components/DataManage";
import PageManage from "./components/PageManage";
import InfoManage from "./components/InfoManage";
import "./index.less";

import { NTabs,NTabPane } from "naive-ui"

export default defineComponent({
  setup(props, ctx) {
    return ()=>(
      <div class="index-container">
        <div class="index-header"></div>
        <div class="index-content">
          <NTabs
            placement="left"
            type="bar" 
            animated
            tab-style={{
              width:"150px",
              display:"flex",
              justifyContent: "center",
            }}
            style={{
              height:"100%"
            }}
          >
            <NTabPane
              name="page" 
              tab="页面"
            >
              <PageManage></PageManage>
            </NTabPane>
            <NTabPane
              name="data" 
              tab="数据"
            >
              <DataManage></DataManage>
            </NTabPane>
            <NTabPane
              name="info" 
              tab="信息"
            >
              <InfoManage></InfoManage>
            </NTabPane>
          </NTabs>
        </div>
        <div class="index-footer"></div>
      </div>
    )
  },
})