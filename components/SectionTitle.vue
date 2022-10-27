<script setup>
const props = defineProps({
  title:{
    type: String,
    default: () => 'Missing title'
  }
})
</script>

<template>
  <div class="section-title w-full mx-auto pl-5 font-semibold text-base mt-4">{{title}}</div>
</template>

<style>
</style>
