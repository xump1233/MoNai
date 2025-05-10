import { defineComponent, ref, PropType, computed, onMounted } from "vue";
import "./index.less";
import {
  NButton,
  NDataTable,
  DataTableColumns,
  NModal,
  NCard,
  NSelect,
  NInput,
  NTag,
  NPopconfirm,
} from "naive-ui";
import useResetRef from "@/hooks/useResetRef";
import * as API from "@/api";
import toFormatTime from "@/utils/toFormatTime";

interface ITableItem {
  name: string;
  pageId: string;
  pageName:string;
  level: 1 | 2;
  grantBy: string;
  grantTime: string;
  description:string;
}

interface IModalInfo {
  isShow: boolean;
  pageId?: number;
  user: string;
  level?:number;
  grantTime: string;
  grantBy: string;
  description: string;
}

export default defineComponent({
  props: {
    pageList: {
      type: Object as PropType<any[]>,
    },
  },
  setup(props) {
    const [modalInfo, resetModalInfo] = useResetRef<IModalInfo>({
      isShow: false,
      user: "",
      grantTime: "",
      grantBy: "",
      description: "",
    });

    const options = computed(() => {
      return props.pageList?.map((item) => {
        return {
          value: item["page_id"],
          label: () => (
            <div>
              <NTag type="success">ID:{item["page_id"]}</NTag>
              &emsp;
              <span>{item["page_name"]}</span>
            </div>
          ),
        };
      });
    });
    const columns: DataTableColumns<ITableItem> = [
      {
        key: "no",
        title: "序号",
        render(_,index){
          return index + 1
        }
      },
      {
        key: "name",
        title: "使用用户",
      },
      {
        key: "pageId",
        title: "页面ID",
      },
      {
        key:"pageName",
        title:"页面名称"
      },
      {
        key: "level",
        title: "权限等级",
        render(record){
          return <NTag type={record.level === 1 ? "success" : "warning"}>{record.level === 1 ? "编辑" : "只读"}</NTag>
        }
      },
      {
        key: "grantBy",
        title: "授权人",
      },
      {
        key: "grantTime",
        title: "授权时间",
        render(record){
          return toFormatTime(record.grantTime,true);
        }
      },
      {
        key:"description",
        title:"授权说明"
      },
      {
        key: "operate",
        title: "操作",
        render(record){
          return <NPopconfirm
            positiveText={"确认"}
            negativeText={"取消"}
            onPositiveClick={()=>{
              handleCancelPerimission({user:record.name,grantBy:record.grantBy,pageId:Number(record.pageId)});
            }}
            v-slots={{
              "trigger":()=>(
                <NButton text={true} type="error">取消授权</NButton>
              )
            }}
          >确定取消？</NPopconfirm>
        }
      },
    ];
    const dataSource = ref<ITableItem[]>([]);

    const inputStatus = ref<"error" | "success">();
    const handleUserBlur = () => {
      if( modalInfo.value.user === ""){
        return;
      }
      API.USER.postVerifyName({
        username: modalInfo.value.user,
      }).then((res) => {
        if (res.success) {
          inputStatus.value = "success";
        } else {
          inputStatus.value = "error";
        }
      });
    };
    const handleSubmitPermission = ()=>{
      if(!modalInfo.value.pageId || !modalInfo.value.level){
        return;
      }
      API.PAGE.postCreatePagePermission({
        user:modalInfo.value.user,
        pageId:modalInfo.value.pageId,
        permissionLevel:modalInfo.value.level,
        grantBy:modalInfo.value.grantBy,
        grantTime:modalInfo.value.grantTime,
        description:modalInfo.value.description,
      }).then(res=>{
        if(res.success){
          (window as any).message.success("添加成功！")
          resetModalInfo();
          getPermissionList();
          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          modalInfo.value.grantBy = userInfo?.username;
        }
      })
    }
    const getPermissionList = ()=>{
      API.PAGE.postPermissionList().then(res=>{
        if(res.success){
          dataSource.value = res.data?.map((item:any)=>{
            return {
              name: item["user_name"],
              pageId: item["page_id"],
              pageName:item["page_name"],
              level: item["permission_level"],
              grantBy: item["grant_by"],
              grantTime: item["grant_time"],
              description:item["permission_description"],
            }
          })
        }
      })
    }
    const handleCancelPerimission = (body:{
      user:string;
      grantBy:string;
      pageId:number;
    })=>{
      API.PAGE.postCancelPagePermission(body).then(res=>{
        if(res.success){
          (window as any).message.success("取消成功！");
          getPermissionList();
        }
      })
    }
    getPermissionList();
    onMounted(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      modalInfo.value.grantBy = userInfo?.username;
    })
    return () => (
      <div class="permission-list-container">
        <div class="permission-list-header">
          <NButton
            type="success"
            onClick={() => {
              modalInfo.value.isShow = true;
              modalInfo.value.grantTime = String(Date.now());
            }}
          >
            添加授权
          </NButton>
        </div>
        <div class="permission-list-content">
          <NDataTable columns={columns} data={dataSource.value}></NDataTable>
        </div>
        <NModal
          show={modalInfo.value.isShow}
          style={{
            width: "500px",
            height: "450px",
          }}
          onClose={() => {
            modalInfo.value.isShow = false;
          }}
          onMaskClick={() => {
            modalInfo.value.isShow = false;
          }}
        >
          <NCard
            title={"添加授权"}
            contentStyle={{
              overflow: "auto",
            }}
          >
            <div class="form-container">
              <div class="form-item">
                <div class="form-item-label">选择页面：</div>
                <NSelect
                  placeholder={"请选择授权页面"}
                  options={options.value}
                  class="form-item-content"
                  value={modalInfo.value.pageId}
                  onUpdate:value={(value: string) => {
                    modalInfo.value.pageId = Number(value);
                  }}
                ></NSelect>
              </div>
              <div class="form-item" style={{position:"relative"}}>
                <div class="form-item-label">授予人：</div>
                <NInput
                  placeholder={"请输入授予用户名"}
                  value={modalInfo.value.user}
                  status={inputStatus.value}
                  onBlur={handleUserBlur}
                  class="form-item-content"
                  onUpdate:value={(value:string)=>{
                    modalInfo.value.user = value;
                  }}
                ></NInput>
                <div style={{
                  display:inputStatus.value === "error" ? "block" : "none",
                  position:"absolute",
                  left:"104px",
                  top:"40px",
                  fontSize:"12px",
                  color:"#d03050",
                }}>用户不存在!</div>
              </div>
              <div class="form-item">
                <div class="form-item-label">授予等级：</div>
                <NSelect
                  placeholder={"请选择授权等级"}
                  options={[{value:1,label:"编辑"},{value:2,label:"只读"}]}
                  class="form-item-content"
                  value={modalInfo.value.level}
                  onUpdate:value={(value: string) => {
                    modalInfo.value.level = Number(value);
                  }}
                ></NSelect>
              </div>
              <div class="form-item">
                <div class="form-item-label">授权时间：</div>
                <NInput
                  placeholder={"选择自动填充"}
                  disabled
                  value={toFormatTime(modalInfo.value.grantTime,true)}
                  class="form-item-content"
                ></NInput>
              </div>
              <div class="form-item">
                <div class="form-item-label">授权人：</div>
                <NInput
                  placeholder={"选择自动填充"}
                  disabled
                  value={modalInfo.value.grantBy}
                  class="form-item-content"
                ></NInput>
              </div>
              <div class="form-item">
                <div class="form-item-label">说明：</div>
                <NInput
                  placeholder={"请输入授权说明"}
                  class="form-item-content"
                  value={modalInfo.value.description}
                  onUpdate:value={(value: string) => {
                    modalInfo.value.description = value;
                  }}
                ></NInput>
              </div>
              <div class="form-item">
                <NButton
                  style={{ margin: "auto", width: "90px" }}
                  type="info"
                  onClick={handleSubmitPermission}
                >
                  添加
                </NButton>
              </div>
            </div>
          </NCard>
        </NModal>
      </div>
    );
  },
});
