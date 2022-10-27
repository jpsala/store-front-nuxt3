<script setup>
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
</script>

<template>
  <div v-if="!section.closed" class="checkout-section-body">
    <section-title :title="section.title" />
    <div class="section-body px-5 py-4">
      <slot />
      <button :disabled="!section.valid" @click="$emit('next', section.id)" class="btn-ui ml-auto mt-6 block">Next</button>
    </div>
  </div>
  <div v-else class="checkout-section-body p-4 mr-6 flex place-content-between items-center">
    <div class="font-semibold">{{section.title}}</div>
    <button v-if="section.valid" class="btn-ui" @click="section.closed = false">✓</button>
    <div v-else></div>
  </div>
</template>

<style>
.checkout-section-body{
  @apply rounded-lg mx-8 w-[50%] max-w-[800px] bg-white
}
</style>
