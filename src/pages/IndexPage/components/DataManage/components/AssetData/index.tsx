import { defineComponent,ref,onMounted, reactive } from "vue";
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
} from "naive-ui";
import './index.less'
import * as Api from "@/api"
import { BASE_URL } from "@/request";


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

type AssetEnum = "image" | "vedio" | "attachment"

export default defineComponent({
  setup() {
    const message = useMessage();
    // 序号  名称  创建用户   类型  地址  内容  描述  操作
    const columns:DataTableColumns<IDataSourceItem> = [{
      key:"no",
      title:"序号",
      render(_,index){
        return index+1
      }
    },{
      key:"name",
      title:"名称",
    },{
      key:"user",
      title:"创建用户",
    },{
      key:"type",
      title:"类型",
      render(record){
        return <NTag type="warning">{record.type}</NTag>
      }
    },{
      key:"path",
      title:"路径",
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

    const dataSource = ref<IDataSourceItem[]>([])

    const modalShow = ref(false);
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
                {/* <NP depth="3" style="margin: 8px 0 0 0">
                  请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
                </NP> */}
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
          </NCard>
        </NModal>
        <div class="data_manage_asset_header">
          <NButton type="info" onClick={()=>{
            modalShow.value = true;
          }}>创建静态资源</NButton>
        </div>
        <div>
          <NDataTable
            columns={columns}
            data={dataSource.value}
          ></NDataTable>
        </div>
      </div>
    )
  },
})