import { defineComponent } from "vue";
import "./index.less"

export default defineComponent({
  setup(props, ctx) {
    return ()=>(
      <div class={"login-container"}>
        <div class="box"></div>
      </div>
    )
  },
})