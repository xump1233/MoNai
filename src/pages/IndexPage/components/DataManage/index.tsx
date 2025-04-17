import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  setup(props, ctx) {
    return ()=>(
      <div style={{
        width:"100%",
        height:"100%",
      }}>
        <RouterView></RouterView>
      </div>
    )
  },
})