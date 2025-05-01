import { defineComponent } from "vue";


export default defineComponent({
  props:{
    url:{
      type:String,
    },
    width:{
      type:Number,
    },
    height:{
      type:Number
    }
  },
  setup(props) {

    return ()=>(
      <div style={{width:(props.width || 64)+"px",height:(props.height || 64)+"px"}}>
        <img src={props.url || "/default_image.png"} draggable={false} alt="" style={{
          width:"100%",
          height:"100%",
          verticalAlign:"bottom"
        }} />
      </div>
    )
  },
})