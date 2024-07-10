<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

defineComponent({
  components: {
    RouterView,
    RouterLink
  }
})
</script>

<style scoped></style>
