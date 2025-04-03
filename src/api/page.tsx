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

export default {
  setPageDataByPageId,
  getPageDataByPageId,
  getPageList,
};