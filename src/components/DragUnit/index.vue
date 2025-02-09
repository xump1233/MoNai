<script setup lang="ts">
  function handleDrop(event: DragEvent) {
    event.preventDefault(); // 阻止默认行为
    console.log("drop事件触发", event);
  }


  function handleStart(event: DragEvent) {
    console.log("dragstart事件触发", event);
  }

  function handleClick(event: MouseEvent) {
    console.log("click事件触发", event);
  }
</script>
<template>
  <div
    class="drag-container"
    @drop="handleDrop"
    @dragstart="handleStart"
    @click="handleClick"
    draggable="true"
  >
    <slot></slot>
  </div>
</template>

<style>
.drag-container{
  width: fit-content;
}
</style>