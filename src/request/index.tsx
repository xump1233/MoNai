import router from '@/router'

const BASE_URL = "http://127.0.0.1:8080"
const RENDER_URL = "http://localhost:5174"

// TODO request

function getRequest(url:string,options?:RequestInit){
  let newHeaders:Headers;
  if(options && options.headers){
    newHeaders = options.headers as Headers;
    newHeaders.append("Authorization",getToken())
  }else{
    newHeaders = new Headers();
    newHeaders.append("Authorization",getToken())
  }
  const request = fetch(BASE_URL+url,{
    ...options,
    headers:newHeaders
  })
  request.then((res)=>{
    if(res.status === 401){
      (window as any).message.error("登录信息已失效，请重新登录！")
      router.push("/login")
    }
  })
  request.catch(err=>{
    (window as any).message.error("遇到一个网络错误："+err.message)
  })
  return request
}

function postRequest(url:string,options:RequestInit){
  let newHeaders:Headers;
  if(options.headers){
    newHeaders = options.headers as Headers;
    newHeaders.append("Authorization",getToken())
  }else{
    newHeaders = new Headers();
    newHeaders.append("Authorization",getToken())
  }
  const request = fetch(BASE_URL + url,{
    method:"post",
    ...options,
    headers:newHeaders
  })

  request.then((res)=>{
    if(res.status === 401){
      (window as any).message.error("登录信息已失效，请重新登录！")
      router.push("/login")
    }
  })
  request.catch(err=>{
    (window as any).message.error("遇到一个网络错误："+err.message)
  })
  return request
}

function getToken():string{
  return localStorage.getItem("userInfo_token") || '';
}
function setToken(token:string){
  localStorage.setItem("userInfo_token",token)
}

const HeadersMap:Record<string,[string,string]> = {
  json:["Content-Type","application/json"],
  "form-data":["Content-Type","multipart/form-data"]
}

const requestHeaders = (...args:string[])=>{
  const head = new Headers();
  args.forEach((item:string)=>{
    if(!HeadersMap[item]) return;
    head.append(...HeadersMap[item])
  })
  return head
}


export {
  BASE_URL,
  RENDER_URL,
  getRequest,
  postRequest,
  requestHeaders,
  setToken
}