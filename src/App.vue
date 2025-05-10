<script setup lang="ts">
import PageContainer from "./components/PageContainer/index.vue"
import { RouterView } from "vue-router"
import { NMessageProvider,NConfigProvider } from "naive-ui"
import "./App.less"


</script>

<template>
  <NConfigProvider>
    <NMessageProvider>
      <PageContainer>
        <RouterView />
      </PageContainer>
    </NMessageProvider>
  </NConfigProvider>
</template>

