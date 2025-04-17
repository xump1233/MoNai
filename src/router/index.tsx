import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

import IndexPage from "@/pages/IndexPage";
import LoginPage from "@/pages/LoginPage";
import PageEditor from "@/components/PageEditor";
import DataManage from "@/pages/IndexPage/components/DataManage";
import PageManage from "@/pages/IndexPage/components/PageManage";
import InfoManage from "@/pages/IndexPage/components/InfoManage";

const routes:RouteRecordRaw[] = [{
  path:"/",
  redirect: '/login',
  children:[{
    path:"/index",
    redirect:"/index/page_manage",
    component:IndexPage,
    
    children:[{
      path:"/index/data_manage",
      component:DataManage,
      redirect:"/index/data_manage/api_tree",
      children:[{
        path:"/index/data_manage/structure_data",
        component:()=>import("@/pages/IndexPage/components/DataManage/components/StructureData")
      },{
        path:"/index/data_manage/asset_data",
        component:()=>import("@/pages/IndexPage/components/DataManage/components/AssetData")
      },{
        path:"/index/data_manage/api_tree",
        component:()=>import("@/pages/IndexPage/components/DataManage/components/ApiTree")
      }]
    },{
      path:"/index/page_manage",
      component:PageManage
    },{
      path:"/index/info_manage",
      component:InfoManage
    }]
  },{
    path:"/login",
    component:LoginPage
  },{
    path:"/pageEditor",
    component:PageEditor,
  }]
}]

const router = createRouter({
  history:createWebHistory(),
  routes:routes,
})

export default router;