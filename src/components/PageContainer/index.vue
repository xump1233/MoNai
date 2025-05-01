<script setup lang="ts">
import './index.less'
import { onMounted } from "vue"
import { useMessage } from 'naive-ui';

const message = useMessage();
onMounted(()=>{
  (window as any).message = message;
})
</script>

<template>
  <div class="monai-page-container">
    <slot></slot>
  </div>
</template>