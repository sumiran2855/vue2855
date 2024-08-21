<template>
    <div class="relative" @click="handleClick">
      <button
        class="bg-gray-200 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none"
        @click="toggleDropdown"
      >
        {{ label }}
      </button>
      <transition name="fade">
        <div
          v-if="isOpen"
          class="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10"
        >
          <ul class="p-2">
            <li
              v-for="option in options"
              :key="option"
              class="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              @click="selectOption(option)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, watch } from 'vue'
  
  const props = defineProps<{
    label: string
    options: string[]
  }>()
  
  const emit = defineEmits<{
    (event: 'select', option: string): void
  }>()
  
  const showDropdown = ref(false)
  const isOpen = ref(false)
  
  const toggleDropdown = (event: MouseEvent) => {
    event.stopPropagation()
    isOpen.value = !isOpen.value
  }
  
  const selectOption = (option: string) => {
    isOpen.value = false
    emit('select', option)
  }
  
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    if (isOpen.value) {
      isOpen.value = false
    }
  }
  
  watch(isOpen, (newValue) => {
    if (newValue) {
      document.addEventListener('click', handleClick)
    } else {
      document.removeEventListener('click', handleClick)
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  