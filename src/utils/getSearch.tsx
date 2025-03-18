export default function(){
  const searchArr = location.search.slice(1).split("&");
  const result:Record<string,string> = {};
  for(let item of searchArr){
    const [key,value] = item.split("=");
    result[key] = value
  }
  return result;
}
