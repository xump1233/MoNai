import { postRequest,requestHeaders } from "@/request"


function postVerifyName(body:{username:string}){
  return postRequest("/login/verifyName",{
    body:JSON.stringify(body),
    headers:requestHeaders("json"),
  }).then((res)=>{
    return res.json();
  })
}

function postVerifyPwd(body:{username:string,password:string}){
  return postRequest("/login/verifyPassword",{
    body:JSON.stringify(body),
    headers:requestHeaders("json"),
  }).then((res)=>{
    return res.json();
  })
}

function postUserRegister(body:{username:string,password:string}){
  return postRequest("/login/register",{
    body:JSON.stringify(body),
    headers:requestHeaders("json"),
  }).then(res=>{
    return res.json();
  })
}

export default {
  postVerifyName,
  postVerifyPwd,
  postUserRegister
}