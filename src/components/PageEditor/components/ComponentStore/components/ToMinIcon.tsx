import { defineComponent,ref } from "vue";


export default defineComponent({
  props:{
    onClick:Function
  },
  setup(props){
    const iconColor = ref<string>("#000");

    return ()=>(
      <svg
        onClick={(e:Event)=>{
          e.stopPropagation();
          props.onClick && props.onClick();
        }}
        onMouseover={()=>{
          iconColor.value = "#1296db";
        }}
        onMouseleave={()=>{
          iconColor.value = "#000"
        }}
        style={{cursor:"pointer",paddingRight:"10px"}}
        class="icon"
        viewBox="0 0 1024 1024" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" p-id="6902" width="16" height="16"><path d="M863.7 552.5H160.3c-10.6 0-19.2-8.6-19.2-19.2v-41.7c0-10.6 8.6-19.2 19.2-19.2h703.3c10.6 0 19.2 8.6 19.2 19.2v41.7c0 10.6-8.5 19.2-19.1 19.2z" p-id="6903" fill={iconColor.value}></path></svg>
    )
  }
})
