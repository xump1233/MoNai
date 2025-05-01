export default function(time:string | number,detail?:boolean){
  let t = time
  if(typeof time === "string"){
    t = Number(time)
  }
  const date = new Date(t);
  let result = date.toLocaleDateString();
  if(detail){
    result = result + " " + date.toLocaleTimeString();
  }
  return result;
}