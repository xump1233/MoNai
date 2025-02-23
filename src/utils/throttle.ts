export default function(fn:Function,time:number){
  let timer:any = null;

  return (...args:any)=>{
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(()=>{
      fn(...args);
    },time);
  }
}