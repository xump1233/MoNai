<script setup lang="ts">
import "./index.less";
import DragUnit from "@/components/DragUnit/index.vue";
import DragCanvas from "@/components/DragCanvas/index.vue";
import BasicInput from "@/components/BasicComponents/BasicInput/index.vue";

function handleClick(){
  console.log("click")
}

</script>

<template>
  <div ref="container">
    <DragUnit>
      <div
        style="background-color: #f66;width: 100px;height: 100px;"
        @click="handleClick"
      >
        xxhh
        <!-- <Input/> -->
      </div>
    </DragUnit>
    <DragCanvas/>
  </div>
</template>

