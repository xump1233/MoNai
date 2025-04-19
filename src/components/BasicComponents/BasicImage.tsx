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
  setup(props, ctx) {

    return ()=>(
      <div style={{width:props.width+"px" || "100px",height:props.height+"px" || "50px"}}>
        <img src={props.url || "/default_image.png"} draggable={false} alt="" style={{
          width:"100%",
          height:"100%",
          verticalAlign:"bottom"
        }} />
      </div>
    )
  },
})