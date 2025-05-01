import { defineComponent,ref,computed,onMounted } from "vue";
import * as API from "@/api";
import "./index.less";
import getSearch from "@/utils/getSearch";
import toFormatTime from "@/utils/toFormatTime";
import bus from "@/utils/EventBus";
import { NDropdown } from "naive-ui";
import usePageData from "@/hooks/usePageData";

export default defineComponent({
  setup() {
    const { pageId } = getSearch();
    const { backPageVersion } = usePageData();
    const current = ref(0);
    const list = ref([]);
    const options = computed(()=>{
      return list.value.map((item)=>{
        return {
          key:item["page_version"],
          label:()=>{
            return <div>
              <span>{item["page_version"]}</span>
              &emsp;
              <span>{toFormatTime(item["page_version_time"],true)}</span>
              &emsp;
              <span>{item["page_changer"]}</span>
            </div>
          },
          props:{
            onClick(){
              postHistoryJSON(item["page_version"])
            }
          }
        }
      }).reverse()
    })

    function postHistoryList(){
      API.PAGE.postHistoryListById(Number(pageId)).then(res=>{
        if(res.success){
          list.value = res.data;
          current.value = res.data.length;
        }
      })
    }
    function postHistoryJSON(version:number){
      API.PAGE.postHistoryJSON({
        "page_id":Number(pageId),
        "page_version":version
      }).then(res=>{
        if(res.success){
          backPageVersion(res.data["page_json"]);
          current.value = version;
        }
      })
    }
    onMounted(()=>{
      bus.on("refreshHistory",postHistoryList);
      postHistoryList();
    })

    return ()=>(
      <NDropdown options={options.value} style={{
        maxHeight:"300px",
        overflowY:"scroll",
        width:"250px"
      }}>
        <div class="history-list-bar">
          版本信息(当前/总共)：{current.value}/{list.value.length}
        </div>
      </NDropdown>
    )
  },
})