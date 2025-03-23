import { defineComponent, ref } from "vue";
import "./index.less";

import { NCard,NModal } from "naive-ui";

interface IPageListItem{
  name:string;
  id:number;
  lastChange:string;

} 
type IPageList = IPageListItem[]

export default defineComponent({
  setup(props, ctx) {
    const pageList = ref<IPageList>([]);
    return ()=>(
      <div class={"index-page-manage"}>
        {pageList.value && pageList.value.map((item:IPageListItem)=>{
          return <NCard class="page-list-item"></NCard>
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