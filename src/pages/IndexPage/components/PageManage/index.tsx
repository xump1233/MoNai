import { defineComponent } from "vue";
import "./index.less";

import { 
  NTabs,
  NTabPane,
} from "naive-ui";
import PermissionList from "./components/PermissionList";
import PageList from "./components/PageList";



export default defineComponent({
  setup() {
    return ()=>(
      <div class={"index-page-manage"}>
        <NTabs type="line">
          <NTabPane name="页面列表">
            <PageList></PageList>
          </NTabPane>
          <NTabPane name="协同权限管理">
            <PermissionList></PermissionList>
          </NTabPane>
        </NTabs>
        
        
      </div>
    )
  },
})