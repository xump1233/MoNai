import { postRequest, getRequest, requestHeaders } from "@/request";


function setPageDataByPageId(pageId:string,body:{
  page_json:string;
  create_time:string
}){
  return postRequest("/pageStore/setPageByPageId?pageId="+pageId,{
    headers:requestHeaders("json"),
    body:JSON.stringify(body),
  }).then(res=>{
    return res.json();
  })
}
function getPageDataByPageId(pageId:string){
  return getRequest("/pageStore/getPageByPageId?pageId="+pageId).then(res=>{
    return res.json();
  })
}


function getPageList(){
  return getRequest("/pageStore/getPageList").then((res)=>{
    return res.json();
  })
}

function postCreatePage(body:{
  page_name:string;
  create_time:string;
  create_user:string;
  page_json:string;
}){
  return postRequest("/pageStore/createPage",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body),
  }).then(res=>{
    return res.json();
  })
}

function postHistoryListById(pageId:number){
  return postRequest("/pageStore/postHistoryListById",{
    headers:requestHeaders("json"),
    body:JSON.stringify({
      page_id:pageId,
    })
  }).then(res=>{
    return res.json();
  })
}
function postHistoryJSON(body:{
  "page_id":number;
  "page_version":number;
}){
  return postRequest("/pageStore/postHistoryJson",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body)
  }).then(res=>{
    return res.json();
  })
}

function postCreatePagePermission(body:{
  user:string;
  pageId:number;
  permissionLevel:number;
  grantBy:string;
  grantTime:string;
  description:string;
}){
  return postRequest("/pageStore/postCreatePagePermission",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body),
  }).then(res=>{
    return res.json();
  })
}
function postCancelPagePermission(body:{
  user:string;
  grantBy:string;
  pageId:number;
}){
  return postRequest("/pageStore/postCancelPagePermission",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body)
  }).then(res=>{
    return res.json();
  })
}

function postPermissionList(){
  return postRequest("/pageStore/postPermissionList",{}).then(res=>{
    return res.json()
  })
}

function postPermissionPageList(){
  return postRequest("/pageStore/postPermissionPageList",{}).then(res=>{
    return res.json();
  })
}

export default {
  setPageDataByPageId,
  getPageDataByPageId,
  getPageList,
  postCreatePage,
  postHistoryListById,
  postHistoryJSON,
  postCreatePagePermission,
  postCancelPagePermission,
  postPermissionList,
  postPermissionPageList,
};