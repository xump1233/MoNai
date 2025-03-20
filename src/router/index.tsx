import { createWebHistory, createRouter } from "vue-router";

import IndexPage from "@/pages/IndexPage";
import LoginPage from "@/pages/LoginPage";
import PageEditor from "@/components/PageEditor";

const routes = [{
  path:"/index",
  component:IndexPage,
  children:[{
    path:"/index/pageEditor",
    component:PageEditor,
  }]
},{
  path:"/login",
  component:LoginPage
}]

const router = createRouter({
  history:createWebHistory(),
  routes:routes,
})

export default router;