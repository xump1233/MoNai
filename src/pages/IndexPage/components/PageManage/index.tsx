import { defineComponent, ref } from "vue";
import "./index.less";

import { NCard,NModal } from "naive-ui";
import * as API from "@/api"
import { useRouter } from "vue-router";

interface IPageListItem{
  page_id:number;
  page_name:string;
  page_create_time:string;
  page_current_version:number;
  page_version_time:string;
} 
type IPageList = IPageListItem[]

export default defineComponent({
  setup(props, ctx) {
    const router = useRouter();
    const pageList = ref<IPageList>([]);
    API.PAGE.getPageList().then(res=>{
      if(res.success){
        pageList.value = res.data
      }
    });
    return ()=>(
      <div class={"index-page-manage"}>
        {pageList.value && pageList.value.map((item:IPageListItem)=>{
          return (
            <NCard 
              class="page-list-item" 
              contentStyle={{padding:"10px"}}
            >
              <div class="page-item-info" onClick={()=>{
                router.push("/pageEditor?pageId="+item.page_id)
              }}>
                <div class="page-item-info-name">{item.page_name}</div>
                <div class="page-item-info-other">
                  <div style={{width:"100%"}}>页面ID:&emsp;{item.page_id}</div>
                  <div style={{width:"100%"}}>当前版本:&emsp;{item.page_current_version}</div>
                  <div style={{width:"100%"}}>创建时间:&emsp;{new Date(Number(item.page_create_time)).toLocaleDateString()}</div>
                  <div style={{width:"100%"}}>最近修改:&emsp;{new Date(Number(item.page_version_time)).toLocaleDateString()}</div>
                </div>
              </div>
            </NCard>
          )
        })}
        <NCard class={"page-list-item"}
          contentStyle={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            textAlign:"center"
          }}
        >
          <div>
            <div style={{fontSize:"50px"}}>+</div>
            <div>创建一个新页面</div>
          </div>
        </NCard>
        <NModal
          show={false}
        >

        </NModal>
      </div>
    )
  },
})