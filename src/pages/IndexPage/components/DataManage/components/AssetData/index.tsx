import { defineComponent,ref,onMounted } from "vue";
import { 
  NDataTable,
  DataTableColumns,
  UploadFileInfo,
  NButton,
  NModal,
  NCard,
  NInput,
  NUpload,
  NUploadDragger,
  NText,
  useMessage,
  NPopconfirm,
  NTag,
  NSpin,
  NEllipsis,
  NTooltip,
  NSelect,
} from "naive-ui";
import './index.less'
import * as Api from "@/api"
import { BASE_URL } from "@/request";
import copyToClipboard from "@/utils/copyToClipboard";


interface IDataSourceItem {
  no:number,
  id:string,
  name:string,
  user:string,
  type:string,
  path:string,
  content:string,
  description:string,
  time:number,
}

interface IFileInfo {
  name:string;
  size:number;
  type:string;
  username:string;
  file?:File;
  description:string;
}

// type AssetEnum = "image" | "vedio" | "attachment"
type FilterEnum = "type" | "user" | "description" | "path"

export default defineComponent({
  setup() {
    const message = useMessage();
    // 序号  名称  创建用户   类型  地址  内容  描述  操作
    const columns:DataTableColumns<IDataSourceItem> = [{
      key:"no",
      title:"序号",
      width:80,
      render(_,index){
        return index+1
      }
    },{
      key:"name",
      title:"名称",
      render(record){
        return <NEllipsis style={{maxWidth:"100px"}}>{record.name}</NEllipsis>
      }
    },{
      key:"user",
      title:"创建用户",
      width:80,
    },{
      key:"type",
      title:"类型",
      render(record){
        return <NTag type="warning">{record.type}</NTag>
      }
    },{
      key:"path",
      title:"路径",
      // ellipsis:true,
      render(record){
        return <div style={{display:"flex",alignItems:"center"}}>
          <NEllipsis style={{maxWidth:"250px"}}>{BASE_URL + "/get_asset/" + record.path}</NEllipsis>
          <NTooltip 
            v-slots={{
              trigger(){
                return (
                <div style={{display:"flex",alignItems:"center",cursor:"pointer"}} onClick={()=>{
                  copyToClipboard(BASE_URL + "/get_asset/" + record.path).then(res=>{
                    if(res){
                      message.success("复制成功！")
                    }
                  })
                }}>
                  <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4992" width="16" height="16"><path d="M394.666667 106.666667h448a74.666667 74.666667 0 0 1 74.666666 74.666666v448a74.666667 74.666667 0 0 1-74.666666 74.666667H394.666667a74.666667 74.666667 0 0 1-74.666667-74.666667V181.333333a74.666667 74.666667 0 0 1 74.666667-74.666666z m0 64a10.666667 10.666667 0 0 0-10.666667 10.666666v448a10.666667 10.666667 0 0 0 10.666667 10.666667h448a10.666667 10.666667 0 0 0 10.666666-10.666667V181.333333a10.666667 10.666667 0 0 0-10.666666-10.666666H394.666667z m245.333333 597.333333a32 32 0 0 1 64 0v74.666667a74.666667 74.666667 0 0 1-74.666667 74.666666H181.333333a74.666667 74.666667 0 0 1-74.666666-74.666666V394.666667a74.666667 74.666667 0 0 1 74.666666-74.666667h74.666667a32 32 0 0 1 0 64h-74.666667a10.666667 10.666667 0 0 0-10.666666 10.666667v448a10.666667 10.666667 0 0 0 10.666666 10.666666h448a10.666667 10.666667 0 0 0 10.666667-10.666666v-74.666667z" fill="#8a8a8a" p-id="4993"></path></svg>
                </div>
                )
              }
            }}
          >
            点击复制
          </NTooltip>
        </div>
      }
    },{
      key:"time",
      title:"创建时间",
      render(record){
        return new Date(Number(record.time)).toLocaleString()
      },
      sorter(raw1,raw2){
        return raw2.time - raw1.time;
      }
    },{
      key:"content",
      title:"内容",
      render(record){
        // @ts-ignore
        return <NButton text tag="a" href={record.content} target="_blank" type="primary">查看</NButton>
      }
    },{
      key:"description",
      title:"描述",
      render(record){
        return <NEllipsis style={{maxWidth:"200px"}}>{record.description}</NEllipsis>
      }
    },{
      key:"operate",
      title:"操作",
      width:100,
      render(record){
        return (
          <div style={{display:"flex",width:"100%",justifyContent:"space-between"}}>
            <NButton text type="info">编辑</NButton>
            <NPopconfirm
              positiveText={"确认"}
              negativeText={"取消"}
              onPositiveClick={()=>{
                handleDeleteAsset({id:record.id,path:record.path});
              }}
              v-slots={{
                "trigger":()=>(
                  <NButton text={true} type="error">删除</NButton>
                )
              }}
            >确定删除？</NPopconfirm>  
          </div>
        )
      }
    }]

    const selectOptions = [{
      value:"name",
      label:"名称"
    },{
      value:"user",
      label:"用户",
    },{
      value:"type",
      label:"类型"
    },{
      value:"path",
      label:"路径"
    },{
      value:"description",
      label:"描述"
    }]
    const filterInfo = ref<{type?:FilterEnum;content:string}>({content:""});
    const filterData = ref<IDataSourceItem[] | null>(null);
    const handleFilter = ()=>{
      const key = filterInfo.value.type;
      if(!key){
        return;
      }
      const content = filterInfo.value.content;
      filterData.value = dataSource.value.filter(item=>{
        return item[key].indexOf(content) !== -1;
      })
    }
    const handleFilterReset = ()=>{
      filterData.value = null;
      filterInfo.value = {
        content:"",
      }
    }


    const dataSource = ref<IDataSourceItem[]>([]);

    const modalShow = ref(false);
    const uploadLoading = ref(false);
    const fileInfo = ref<IFileInfo>({name:"",size:0,type:"",username:"",description:""})
    const handleUploadChange = ({file}:{file:UploadFileInfo})=>{
      console.log(file)
      if(file.status === "removed"){
        fileInfo.value.name = "";
        fileInfo.value.type = "";
        fileInfo.value.size = 0;
      }else if(file.status === "pending"){
        fileInfo.value.name = file.name;
        fileInfo.value.size = file.file?.size || NaN;
        fileInfo.value.type = file.type || "unknown";
        fileInfo.value.file = file.file as File;
      }
    }
    const handleUploadSubmit = ()=>{
      if(fileInfo.value.file){
        uploadLoading.value = true;
        Api.DATA.postUploadFile(fileInfo.value.file,fileInfo.value.username).then(res=>{
          if(res.success){
            const body = {
              id:res.data.assetId,
              name:fileInfo.value.name,
              user:fileInfo.value.username,
              type:fileInfo.value.type,
              path:res.data.path,
              description:fileInfo.value.description,
              create_time:String(res.data.createTime)
            }

            Api.DATA.postCreateAsset(body).then(res=>{
              if(res.success){
                (window as any).message.success("创建成功！");
                getAssetList();
              }
            })
          }
        }).finally(()=>{
          modalShow.value = false;
          uploadLoading.value = false;
        })

      }
    }
    const getAssetList = (username?:string)=>{
      Api.DATA.getAssetList(username || fileInfo.value.username).then(res=>{
        if(res.success){
          const data = res.data;
          dataSource.value = data?.map((item:any,index:number):IDataSourceItem=>{
            return {
              no:index,
              id:item["asset_map_id"],
              name:item["asset_name"],
              user:item["asset_user"],
              type:item["asset_type"],
              path:item["asset_path"],
              content:BASE_URL + "/get_asset/" + item["asset_path"],
              description:item["asset_description"],
              time:Number(item["asset_create_time"]),
            }
          }) || []
        }
      })
    }
    const handleDeleteAsset = (info:{id:string,path:string})=>{
      Api.DATA.postDeleteAsset(info).then((res)=>{
        if(res.success){
          message.success("删除成功");
          getAssetList();
        }
      })
    }

    onMounted(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      fileInfo.value.username = userInfo?.username || "";
      getAssetList(userInfo?.username || "");
    })

    return ()=>(
      <div class="data_manage_asset">
        <NModal 
          show={modalShow.value}
          style={{
            width:"600px",
            height:"600px"
          }}
          onClose={()=>{
            modalShow.value = false;
          }}
          onMaskClick={()=>{
            modalShow.value = false;
          }}
        >
          <NCard
            title={"创建静态资源接口"}
            contentStyle={{
              overflow:"auto"
            }}
          >
            <NSpin show={uploadLoading.value} v-slots={{description:()=>"资源上传中。。。"}}>
              <div class="form-container-asset">
              <NUpload
                style={{}}
                directory-dnd
                onChange={handleUploadChange}
                max={1}
              >
                <NUploadDragger>
                  <div style="margin-bottom: 12px">
                    <n-icon size="36" depth={3}>
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6044" width="64" height="64"><path d="M112 928a47.936 47.936 0 0 1-47.936-47.936v-224a48 48 0 1 1 96 0v176.064h704v-176.064a48 48 0 1 1 96 0v224a47.936 47.936 0 0 1-47.936 47.936z m352-263.936v-416L327.744 364.48a48.32 48.32 0 0 1-31.232 11.584 47.296 47.296 0 0 1-36.352-16.896 47.808 47.808 0 0 1 5.312-67.648l215.424-184.128a48.32 48.32 0 0 1 62.336 0l215.232 184.128a48 48 0 0 1-62.336 72.96L559.872 248.064v416a48 48 0 0 1-96 0z" fill="#585858" p-id="6045"></path></svg>
                    </n-icon>
                  </div>
                  <NText style="font-size: 16px">
                    点击或者拖动文件到该区域来上传
                  </NText>
                </NUploadDragger>
              </NUpload>
                <div class="form-item">
                  <div class="form-item-label">名称：</div>
                  <NInput placeholder={"请输入接口名称"} class="form-item-content" value={fileInfo.value?.name} onUpdate:value={(value:string)=>{
                    fileInfo.value.name = value
                  }}></NInput>
                </div>
                <div class="form-item">
                  <div class="form-item-label">创建人：</div>
                  <NInput placeholder={"选择自动填充"} disabled value={fileInfo.value.username} class="form-item-content"></NInput>
                </div>
                <div class="form-item">
                  <div class="form-item-label">类型：</div>
                  <NInput placeholder={"选择自动填充"} disabled value={fileInfo.value.type} class="form-item-content"></NInput>
                </div>
                <div class="form-item">
                  <div class="form-item-label">文件大小：</div>
                  <NInput placeholder={"选择自动填充"} disabled value={String(fileInfo.value.size)+" B"} class="form-item-content"></NInput>
                </div>
                <div class="form-item">
                  <div class="form-item-label">描述：</div>
                  <NInput placeholder={"请输入文件描述"} class="form-item-content" value={fileInfo.value.description} onUpdate:value={(value:string)=>{
                    fileInfo.value.description = value;
                  }}></NInput>
                </div>
                <div class="form-item">
                  <NButton style={{margin:"auto",width:"90px"}} type="info" onClick={handleUploadSubmit}>上传</NButton>
                </div>
              </div>
            </NSpin>

          </NCard>
        </NModal>
        <div class="data_manage_asset_header">
          <NButton type="info" onClick={()=>{
            modalShow.value = true;
          }}>创建静态资源</NButton>
          <div style={{display:"flex",marginRight:"30px"}}>
            <NSelect options={selectOptions} placeholder="查找列" style={{width:"150px"}} v-model:value={filterInfo.value.type}></NSelect>
            <NInput placeholder={"查找内容"} style={{width:"200px",height:"34px",marginLeft:"20px"}} v-model:value={filterInfo.value.content}></NInput>
            <NButton type="success" style={{marginLeft:"10px"}} onClick={handleFilter}>查找</NButton>
            <NButton type="warning" style={{marginLeft:"10px"}} onClick={handleFilterReset}>重置</NButton>
          </div>
        </div>
        <div class={"data_manage_asset_content"}>
          <NDataTable
            columns={columns}
            data={filterData.value || dataSource.value}
          ></NDataTable>
        </div>
      </div>
    )
  },
})