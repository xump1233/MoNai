<script setup lang="ts">
import PageContainer from "./components/PageContainer/index.vue"
import { RouterView } from "vue-router"
import { NMessageProvider } from "naive-ui"
import "./App.less"


</script>

<template>
  <NMessageProvider>
    <PageContainer>
      <RouterView />
    </PageContainer>
  </NMessageProvider>
</template>

