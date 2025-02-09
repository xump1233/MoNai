<script setup lang="ts">
import BasicInput from "@/components/BasicComponents/BasicInput/index.vue"
import BasicButton from "@/components/BasicComponents/BasicButton/index.vue"

import { ref,computed,watch } from "vue";
import './index.less';

import useDrag from "@/hooks/useDrag";

const { 
  nowDragUnit,
  dragState 
} = useDrag();

watch(dragState,()=>{
  console.log(dragState.value)
})

const isDragEnter = ref(false);
const classList = computed(()=>{
  return {
    "monai-canvas-container":true,
    "drag-enter-cursor":isDragEnter.value,
  }
})

const childList = ref([{
  name:BasicInput,
  c_id:"sfd",
  props:{
    a:1,
    b:2
  },
  layout:{
    x:0,
    y:0,
    width:100,
    height:100,
  }
},
{
  name:BasicButton,
  c_id:"sfd",
  props:{
    a:1,
    b:2
  },
  layout:{
    x:0,
    y:0,
    width:100,
    height:100,
  }
}])


function handleDragenter(event: DragEvent){
  event.preventDefault();
  console.log("dragenter事件触发", event);
  isDragEnter.value = true;
}

function handleDragOver(event: DragEvent) {
  event.preventDefault(); // 必须阻止默认行为，才能触发 drop 事件
  console.log("dragover事件触发", event);
}


</script>

<template>
  <div
    @dragover="handleDragOver"
    @dragenter="handleDragenter"
    :class="classList"
  >
    <component v-for="item in childList" :key="item.c_id" :is="item.name" v-bind="item.props"></component>
  </div>
</template>