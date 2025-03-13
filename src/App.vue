<script setup lang="ts">
import PageContainer from "./components/page-container/index.vue"
import PageEditor from "./components/PageEditor";
import { NMessageProvider } from "naive-ui"
import "./App.less"


</script>

<template>
  <NMessageProvider>
    <PageContainer>
      <PageEditor/>
    </PageContainer>
  </NMessageProvider>
</template>

