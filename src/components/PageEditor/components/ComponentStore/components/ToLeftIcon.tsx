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
        xmlns="http://www.w3.org/2000/svg" p-id="5040" width="16" height="16">
          <path fill={iconColor.value} d="M924 616a36 36 0 0 0-36 36v236H136V136h128a36 36 0 0 0 0-72H100a36 36 0 0 0-36 36v824a36 36 0 0 0 36 36h824a36 36 0 0 0 36-36V652a36 36 0 0 0-36-36z" p-id="5041"></path>
          <path fill={iconColor.value} d="M444 616h272a36 36 0 0 0 0-72H530.91l418.55-418.54a36 36 0 1 0-50.92-50.91L480 493.09V308a36 36 0 0 0-72 0v272a36 36 0 0 0 36 36z" p-id="5042"></path>
        </svg>
    )
  }
})

