function createEventBus(){
  const map:Map<string,Set<Function>> = new Map();

  return {
    on(key:string,fn:Function){
      let set = map.get(key);
      if(!set){
        map.set(key,set = new Set())
      }
      set.add(fn);
    },
    emit(key:string,...args:any[]){
      let set = map.get(key);
      if(!set){
        return;
      }
      set.forEach(fn=>{
        fn && fn(...args);
      })
    }
  }
}

const bus = createEventBus();


export default bus;