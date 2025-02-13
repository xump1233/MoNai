<script setup lang="ts">
import "./index.less";
import DragUnit from "@/components/DragUnit/index.vue";

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
  </div>
</template>

