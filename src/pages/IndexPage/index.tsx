import { defineComponent, ref, onMounted } from "vue";
import "./index.less";

import { NTree } from "naive-ui"
import type {TreeOverrideNodeClickBehavior } from "naive-ui"
import { RouterView,useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const selectKey = ref("")

    // children:[{
    //   label:"结构型数据管理",
    //   key:"data_manage/structure_data",
    // },{
    //   label:"静态数据管理",
    //   key:"data_manage/asset_data"
    // },{
    //   label:"接口树",
    //   key:"data_manage/api_tree"
    // }]
    const treeData = [{
      label:"页面管理",
      key:"page_manage"
    },{
      label:"数据管理",
      key:"data_manage",
      children:[{
        label:"静态数据管理",
        key:"data_manage/asset_data"
      }]
    },{
      label:"个人信息",
      key:"info_manage"
    }]
    const handleClick:TreeOverrideNodeClickBehavior = ({option})=>{
      if(option.key === "data_manage"){
        return 'default';
      }
      selectKey.value = option.key as string;
      router.push(`/index/${option.key as string}`)
      if (option.children) {
        return 'toggleExpand'
      }
      return 'default'
    }

    onMounted(()=>{
      const href = location.href;
      const key = href.split("index/")[1];
      selectKey.value = key;
    })

    return ()=>(
      <div class="index-container">
        <div class="index-header">
          <span>MoNai-LowCode</span>
        </div>
        <div class="index-content">
          <div class="index-content-left">
            <NTree
              block-line
              cancelable
              selectedKeys={[selectKey.value]}
              data={treeData}
              overrideDefaultNodeClickBehavior={handleClick}
              defaultExpandAll={true}
            > 
            </NTree>
          </div>
          <div class="index-content-right">
            <RouterView></RouterView>
          </div>
          
        </div>
        <div class="index-footer"></div>
      </div>
    )
  },
})