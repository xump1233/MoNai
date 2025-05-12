import { 
  NCard,
  NModal,
  NInput,
  NButton,
  NSelect,
  NTooltip,
  NDatePicker,
} from "naive-ui";
import { useRouter } from "vue-router";
import { PageTemplate } from "@/constant";
import * as API from "@/api";
import { defineComponent, onMounted, ref } from "vue";
import "./index.less";
import usePageList from "../../hooks/usePageList";
import useResetRef from "@/hooks/useResetRef";


interface IPageListItem{
  page_id:number;
  page_name:string;
  page_create_time:string;
  page_current_version:number;
  page_version_time:string;
  isPermission?:1 | 2 | 0;
} 

const PermissionColor = {
  "1":"rgb(194 242 236 / 50%)",
  "2":"rgb(239 242 194 / 50%)",
}

export default defineComponent({
  setup() {
    const { pageList,getAllPageList } = usePageList();
    const router = useRouter();
    
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
          getAllPageList();
        }
      })
    }
    const selectOptions = [{
      value:"",
      label:"所有页面"
    },{
      value:"readonly",
      label:"只读"
    },{
      value:"edit",
      label:"编辑",
    },{
      value:"owner",
      label:"拥有"
    }]
    const [filterInfo,filterInfoReset] = useResetRef({type:"",name:""});
    const handleFilter = ()=>{

    }
    const handleFilterReset = ()=>{
      filterInfoReset();
    }
    return ()=>(
      <div class="page-list-container">
        <div class="page-list-header">
          <div style={{display:"flex",height:"50px",marginRight:"30px",alignItems:"center"}}>
            权限等级：<NSelect options={selectOptions} placeholder="权限等级" style={{width:"150px",marginRight:"10px"}} v-model:value={filterInfo.value.type}></NSelect>
            页面名称：<NInput placeholder={"请输入页面名称"} style={{width:"200px",height:"34px",marginRight:"10px"}} v-model:value={filterInfo.value.name}></NInput>
            创建时间：<NDatePicker type="daterange" clearable style={{width:"300px"}} start-placeholder={"开始日期"} endPlaceholder="结束日期"></NDatePicker>
            <NButton type="success" style={{marginLeft:"10px"}} onClick={handleFilter}>查找</NButton>
            <NButton type="warning" style={{marginLeft:"10px"}} onClick={handleFilterReset}>重置</NButton>
          </div>
          <div class="page-list-header-mark">
            <div class="page-list-header-mark-item"><div style={{width:"15px",height:"15px",borderRadius:"50%",backgroundColor:"rgba(206, 242, 194)",marginRight:"5px"}}></div>所有权</div>
            <div class="page-list-header-mark-item"><div style={{width:"15px",height:"15px",borderRadius:"50%",backgroundColor:"rgb(194 242 236)",marginRight:"5px"}}></div>编辑权</div>
            <div class="page-list-header-mark-item"><div style={{width:"15px",height:"15px",borderRadius:"50%",backgroundColor:"rgb(239 242 194)",marginRight:"5px"}}></div>只读权</div>
          </div>
        </div>
        <div class="page-list-content">
          {pageList.value && pageList.value.map((item:IPageListItem)=>{
            return (
              <NTooltip
                placement="bottom" trigger="hover"
                v-slots={{
                  trigger:()=>{
                    return (
                      <NCard 
                        class="page-list-item" 
                        style={item.isPermission ? {backgroundColor:PermissionColor[item.isPermission]} : {}}
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
        </div>
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
              width:"500px",
              height:"450px"
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