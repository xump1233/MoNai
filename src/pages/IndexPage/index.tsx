import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
  setup(props, ctx) {
    return ()=>(
      <RouterView></RouterView>
    )
  },
})