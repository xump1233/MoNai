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
        style={{cursor:"pointer"}}
        class="icon"
        viewBox="0 0 1024 1024" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" p-id="5010" width="16" height="16"><path d="M900 64H360c-33.137 0-60 26.863-60 60v146H124c-33.137 0-60 26.863-60 60v570c0 33.137 26.863 60 60 60h570c33.137 0 60-26.863 60-60V724h146c33.137 0 60-26.863 60-60V124c0-33.137-26.863-60-60-60zM664 634v176c0 33.137-26.863 60-60 60H214c-33.137 0-60-26.863-60-60V420c0-33.137 26.863-60 60-60h390c33.137 0 60 26.863 60 60v214z m206-60c0 33.137-26.863 60-60 60h-56V330c0-33.137-26.863-60-60-60H390v-56c0-33.137 26.863-60 60-60h360c33.137 0 60 26.863 60 60v360z" fill={iconColor.value} p-id="5011"></path></svg>
    )
  }
})
