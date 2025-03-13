const BASE_URL = "http://127.0.0.1:8080"

// TODO request

function getRequest(url:string){
  return fetch(BASE_URL+url)
}

function postRequest(url:string,options:RequestInit){
  return fetch(BASE_URL + url,{
    method:"post",
    ...options,
  })
}


export {
  getRequest,
  postRequest
}