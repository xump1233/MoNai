import { defineComponent, onMounted,ref } from "vue";
import "./index.less"
import getSearch from "@/utils/getSearch";
import usePageData from "@/hooks/usePageData";



export default defineComponent({
  props:{

  },
  setup(_){
    const {pageName,pageId} = getSearch();
    const { pageData } = usePageData();

    const user = ref<string>("");
    onMounted(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      user.value = userInfo?.username || "";
    })

    return ()=>(
      <div class="page-editor-operate-bar" onClick={()=>{
        console.log(JSON.stringify(pageData.value,null,2))
      }}>
        <div>
          <span>MoNai-LowCode Page-Solution</span>
          <span>(当前页：{decodeURIComponent(pageName)}， pageid：{pageId}， 当前编辑人：{user.value})</span>
        </div>
      </div>
    )
  }
})