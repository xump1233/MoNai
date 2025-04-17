import { getRequest, postRequest,requestHeaders } from "@/request"

function postUploadFile(fileData:File,username:string){

  const formData = new FormData();
  let suffix = '';
  for(let i=fileData.name.length-1;i>=0;i--){
    if(fileData.name[i] !== "."){
      suffix = fileData.name[i] + suffix;
    }else{
      break;
    }
  }
  formData.append("suffix","." + suffix);
  formData.append("username",username);
  formData.append("file",fileData);
  return postRequest("/asset/saveAssetFile",{
    body:formData
  }).then(res=>{
    return res.json();
  })
}
function postCreateAsset(body:{
  id:string;
  name:string;
  user:string;
  type:string;
  path:string;
  description:string;
  create_time:string;

}){
  return postRequest("/asset/createAsset",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body)
  }).then(res=>{
    return res.json();
  })
}
function getAssetList(username:string){
  return getRequest("/asset/getAssetListByUsername?username="+username).then(res=>{
    return res.json();
  })
}
function postDeleteAsset(body:{id:string,path:string}){
  return postRequest("/asset/deleteAsset",{
    headers:requestHeaders("json"),
    body:JSON.stringify(body),
  }).then(res=>{
    return res.json();
  })
}

export default {
  postUploadFile,
  postCreateAsset,
  getAssetList,
  postDeleteAsset,
}