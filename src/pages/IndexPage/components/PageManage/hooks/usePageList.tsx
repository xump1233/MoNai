import { ref } from "vue";
import * as API from "@/api";

interface IPageListItem{
  page_id:number;
  page_name:string;
  page_create_time:string;
  page_current_version:number;
  page_version_time:string;
  isPermission?:1 | 2 | 0;
} 
type IPageList = IPageListItem[]

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
  async function getPermissionPageList(){
    return API.PAGE.postPermissionPageList().then(res=>{
      if(res.success){
        const list = res.data.list;
        const map = res.data.map;
        pageList.value = pageList.value.concat(list.map((item:any)=>{
          const t = map.find((i:any)=>i["page_id"]===item["page_id"]);
          return {
            ...item,
            isPermission:t["permission_level"],
          }
        }));
      }
    })
  }

export default function(){
  

  return {
    getAllPageList,
    pageList,
  }
}