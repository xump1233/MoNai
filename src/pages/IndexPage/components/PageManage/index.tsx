import { defineComponent, onMounted, ref } from "vue";
import "./index.less";

import { 
  NCard,
  NModal,
  NInput,
  NButton,
  NSelect,
  NTooltip,
  NTabs,
  NTabPane,
} from "naive-ui";
import PermissionList from "./components/PermissionList";
import * as API from "@/api"
import { useRouter } from "vue-router";
import { PageTemplate } from "@/constant"

interface IPageListItem{
  page_id:number;
  page_name:string;
  page_create_time:string;
  page_current_version:number;
  page_version_time:string;
  isPermission?:boolean;
} 
type IPageList = IPageListItem[]

export default defineComponent({
  setup() {
    const router = useRouter();
    const pageList = ref<IPageList>([]);
    async function getAllPageList(){
      await getPageList();
      getPermissionPageList()
    }
    async function getPageList(){
      return API.PAGE.getPageList().then(res=>{
        if(res.success){
          pageList.value = res.data
        }
      });
    }
    function getPermissionPageList(){
      API.PAGE.postPermissionPageList().then(res=>{
        if(res.success){
          pageList.value = pageList.value.concat(res.data.map((item:any)=>{
            return {
              ...item,
              isPermission:true,
            }
          }));
        }
      })
    }
    getAllPageList();
    onMounted(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      newPageInfoModal.value.username = userInfo?.username || "";
    })
    const newPageInfoModal = ref({
      isShow:false,
      username:(window as any)?.userInfo?.username || "",
      pageName:"",
      createTime:"",
      template:"null"
    })
    const templateOptions = [{
      value:"null",
      label:"空模板"
    }]

    function handleCreatePage(){
      API.PAGE.postCreatePage({
        page_json:PageTemplate[newPageInfoModal.value.template],
        page_name:newPageInfoModal.value.pageName,
        create_user:newPageInfoModal.value.username,
        create_time:String(Date.now()),
      }).then(res=>{
        if(res.success){
          (window as any).message.success("创建成功！");
          newPageInfoModal.value.isShow = false;
          getPageList();
        }
      })
    }

    return ()=>(
      <div class={"index-page-manage"}>
        <NTabs type="line">
          <NTabPane name="页面列表">
            {pageList.value && pageList.value.map((item:IPageListItem)=>{
              return (
                <NTooltip
                  placement="bottom" trigger="hover"
                  v-slots={{
                    trigger:()=>{
                      return (
                        <NCard 
                          class="page-list-item" 
                          style={item.isPermission ? {backgroundColor:"rgb(194 242 236 / 50%)"} : {}}
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
                    }
                  }}
                >
                  跳转至编辑页
                </NTooltip>
              )
            })}
            <NCard class={"page-list-item"}
              contentStyle={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                textAlign:"center"
              }}
              style={{backgroundColor:"rgb(216 216 216 / 50%)"}}
            >
              <div onClick={()=>{
                newPageInfoModal.value.isShow = true;
                newPageInfoModal.value.createTime = (new Date()).toLocaleDateString();
              }}>
                <div style={{fontSize:"50px"}}>+</div>
                <div>创建一个新页面</div>
              </div>
            </NCard>
          </NTabPane>
          <NTabPane name="协同权限管理">
            <PermissionList pageList={pageList.value.filter(item=>!item.isPermission)}></PermissionList>
          </NTabPane>
        </NTabs>
        
        <NModal
          show={newPageInfoModal.value.isShow}
          onClose={()=>{
            newPageInfoModal.value.isShow = false;
          }}
          onMaskClick={()=>{
            newPageInfoModal.value.isShow = false;
          }}
        >
          <NCard
            title={"创建一个新页面"}
            style={{
              width:"550px",
              height:"400px"
            }}
            v-slots={{
              "footer":()=>{
                return (
                  <NButton type="success" style={{
                    transform: "translate(395px, -18px)"
                  }} onClick={handleCreatePage}>确定</NButton>
                )
              }
            }}
          >
            <div class="form-container">
              <div class="form-item">
                <div class="form-item-label">页面名称：</div>
                <NInput placeholder={"请输入页面名称"} class="form-item-content" value={newPageInfoModal.value.pageName} onUpdate:value={(value)=>{
                  newPageInfoModal.value.pageName = value;
                }}></NInput>
              </div>
              <div class="form-item">
                <div class="form-item-label">创建人：</div>
                <NInput placeholder={"请输入页面名称"} disabled class="form-item-content" value={newPageInfoModal.value.username}></NInput>
              </div>
              <div class="form-item">
                <div class="form-item-label">创建时间：</div>
                <NInput placeholder={"请输入页面名称"} disabled class="form-item-content" value={newPageInfoModal.value.createTime}></NInput>
              </div>
              <div class="form-item">
                <div class="form-item-label">模板：</div>
                <NSelect placeholder={"你可以选择模板"} 
                  class="form-item-content" 
                  value={newPageInfoModal.value.template} 
                  onUpdate:value={(value)=>{
                    newPageInfoModal.value.template = value;
                  }}
                  options={templateOptions}
                ></NSelect>
              </div>
              <div class="form-item">
                <div class="form-item-label">共同搭建者：</div>
                <NSelect placeholder={"添加协同创建者"} 
                  class="form-item-content" 
                ></NSelect>
              </div>
            </div>
            
          </NCard>
        </NModal>
      </div>
    )
  },
})