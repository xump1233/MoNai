import { defineComponent,onMounted,onUnmounted,ref } from "vue";
import { RENDER_URL } from "@/request";
import "./index.less"
import type { IBottomBarItem } from "@/interface";
import RetaBar from "@/components/RetaBar";
import HistoryList from "@/components/HistoryList";
import { NButton,useMessage,NModal,NCard,NInput } from "naive-ui";
import CodeEditor from "@/components/CodeEditor";

import useSchedule from "../../hooks/useSchedule";
import usePageData from "@/hooks/usePageData";
import getSearch from "@/utils/getSearch";
import copyToClipboard from "@/utils/copyToClipboard";

export default defineComponent({
  props:{

  },
  setup(){
    const { changePageReta,pageData,savePageData } = usePageData();
    const { barList,removeItem } = useSchedule();
    const message = useMessage();
    const { pageId } = getSearch();
    function savaPageChange(description:string){
      savePageData(description,()=>{
        message.success("保存成功！")
      },()=>{
        message.error("保存异常（用户无权限）！！")
      });
    }
    function handleModalClose(){
      saveModalInfo.value.isShow = false;
      saveModalInfo.value.content = "";
    }
    const saveModalInfo = ref<{isShow:boolean;content:string}>({
      isShow:false,
      content:""
    })

    function keyDownSave(e:KeyboardEvent){
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); // 阻止默认行为（保存网页）
        savaPageChange("快捷保存");
      }
    }
    onMounted(()=>{
      window.addEventListener("keydown", keyDownSave);
    })
    onUnmounted(()=>{
      window.removeEventListener("keydown",keyDownSave);
    })
    
    function exportFocusComponents(){
      const components = pageData.value.components;
      const result = components.filter((item)=>item.isMoveFocus);
      if(result.length === 0){
        message.warning("当前未聚焦组件")
        return;
      }
      copyToClipboard(JSON.stringify(result)).then(()=>{
        message.success("导出成功,已复制到剪贴板！");
      }).catch(()=>{
        message.warning("导出失败")
      });
    }
    const metaDataIsShow = ref<boolean>(false);

    return ()=>(
      <div class="page-editor-bottom-bar">
        <div class="nav-container">
          {barList.value && barList.value.map((item:IBottomBarItem)=>{
            const Icon = item.icon;
            return <div 
              class="nav-item" 
              onClick={()=>{
                removeItem(item.name);
              }}
              style={item.bgColor && {
                color:item.textColor,
                backgroundColor:item.bgColor,
              }}
            >
              {Icon && <Icon></Icon> }
              {item.name}
            </div>
          })}
          <RetaBar initValue={pageData.value.pageContainer.currentReta} onAdd={(value:number)=>{
            changePageReta(value)
          }} onSub={(value:number)=>{
            changePageReta(value)
          }}></RetaBar>
          <HistoryList></HistoryList>
        </div>
        <div class="operate-container">
          <NButton color="#ff6904" style={{height:"85%",marginRight:"10px"}} onClick={exportFocusComponents}>导出聚焦组件</NButton>
          <NButton color="#ff6904" style={{height:"85%",marginRight:"10px"}} onClick={()=>{
            metaDataIsShow.value = true;
          }}>查看页面元数据</NButton>
          <NButton color="#ff69b4" style={{height:"85%",marginRight:"10px"}} onClick={()=>{
            saveModalInfo.value.isShow = true;
          }}>
            标注保存
          </NButton>
          <NButton color="#ff69b4" style={{height:"85%",marginRight:"10px"}} onClick={()=>{
            savaPageChange("快捷保存")
          }}>
            快速保存[ctrl+s]
          </NButton>
          <NButton style={{height:"85%"}} color="#8a2be2" onClick={()=>{
            window.open(RENDER_URL+"?pageId="+pageId)
          }}>
            预览
          </NButton>
        </div>
        <NModal
          show={saveModalInfo.value.isShow}
          onMaskClick={handleModalClose}
          onClose={handleModalClose}
        >
          <NCard style={{
            width:"300px",
            height:"250px",
          }}
            title={"输入描述信息"}
          >
            <NInput placeholder={"请输入本次保存描述信息"} type="textarea" v-model:value={saveModalInfo.value.content}></NInput>
            <NButton style={{
              position:"relative",
              left:"180px",
              top:"30px",
            }}
              onClick={()=>{
                savaPageChange(saveModalInfo.value.content);
                handleModalClose();
              }}
            >确定</NButton>
          </NCard>
        </NModal>
        <NModal
          show={metaDataIsShow.value}
          onClose={()=>{
            metaDataIsShow.value = false;
          }}
          onMaskClick={()=>{
            metaDataIsShow.value = false;
          }}
          style={{
            width:"700px",
            height:"600px"
          }}
        >
          <NCard title={"页面Schema"}>
            <CodeEditor type="json" style={{width:"100%",height:"100%"}} initCode={JSON.stringify(pageData.value,null,2)} isEditor={false}></CodeEditor>
          </NCard>
        </NModal>
      </div>
    )
  }
})
