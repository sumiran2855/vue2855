<template>
  <v-app>
    <router-view class="flex-1" />
  </v-app>
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
