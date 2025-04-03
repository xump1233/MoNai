import { createWebHistory, createRouter } from "vue-router";

import IndexPage from "@/pages/IndexPage";
import LoginPage from "@/pages/LoginPage";
import PageEditor from "@/components/PageEditor";

const routes = [{
  path:"/",
  redirect: '/login',
  children:[{
    path:"/index",
    component:IndexPage,
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