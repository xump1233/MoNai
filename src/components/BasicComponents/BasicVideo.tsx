import { defineComponent, onMounted, ref, watch } from "vue";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

export default defineComponent({
  props:{
    src:{
      type:String
    },
    width:{
      type:Number,
    },
    height:{
      type:Number
    }
  },
  setup(props) {
    const plyrPlayer = ref<HTMLVideoElement>();
    const errInfo = ref<{isShow:boolean;message:string}>({isShow:false,message:""})

    watch(()=>props.src,()=>{
      errInfo.value.isShow = false;
    })
    onMounted(() => {
      if (!plyrPlayer.value) {
        return;
      }

      new Plyr(plyrPlayer.value, {
        controls: [
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
        fullscreen: { enabled: true },
      });

      plyrPlayer.value.addEventListener("error", (e) => {
        const err = plyrPlayer.value?.error;
        console.error("❌ 视频加载失败", err);
        errInfo.value.isShow = true;
        if (err) {
          switch (err.code) {
            case err.MEDIA_ERR_ABORTED:
              errInfo.value.message = "视频加载被中断";
              break;
            case err.MEDIA_ERR_NETWORK:
              errInfo.value.message = "网络错误，无法加载视频";
              break;
            case err.MEDIA_ERR_DECODE:
              errInfo.value.message = "视频解码失败";
              break;
            case err.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errInfo.value.message = "视频格式不受支持或文件不存在";
              break;
            default:
              errInfo.value.message = "未知错误";
              break;
          }
        }
      });
    });

    return () => (
      <div
        style={{
          width: (props.width || 500)+"px",
          height: (props.height || 350)+"px",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#000",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          position:"relative",
        }}
      >
        <video
          style={errInfo.value.isShow ? {display:"none"} : {}}
          ref={plyrPlayer}
          controls
          playsinline
          src={props.src}
        ></video>
        <div class="video-mask"
          style={{
            position:"absolute",
            inset:0,
            display:errInfo.value.isShow ? "flex" : "none",
            alignItems:"center",
            justifyContent:"center",
            color:"white",
            fontSize:"24px",
          }}
        >
          <span>{errInfo.value.message}</span>
        </div>
      </div>
    );
  },
});
