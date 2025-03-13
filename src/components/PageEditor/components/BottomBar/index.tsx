import { defineComponent } from "vue";
import "./index.less"
import type { IBottomBarItem } from "@/interface";

import useSchedule from "../../hooks/useSchedule";


export default defineComponent({
  props:{

  },
  setup(){

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
        </div>
        <div class="operate-container">

        </div>
      </div>
    )
  }
})
