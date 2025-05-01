import { defineComponent,ref } from "vue";
import "./index.less"
import type { IBottomBarItem } from "@/interface";
import RetaBar from "@/components/RetaBar";
import HistoryList from "@/components/HistoryList";

import useSchedule from "../../hooks/useSchedule";
import usePageData from "@/hooks/usePageData";

export default defineComponent({
  props:{

  },
  setup(){
    const { changePageReta,pageData } = usePageData();
    const { barList,removeItem } = useSchedule();
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

        </div>
      </div>
    )
  }
})
