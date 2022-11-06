<script setup>

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  }
})
</script>

<template>
  <div v-if="size === 'sm'" style="border-top-color:transparent"
      class=" border-4 border-green-600 border-solid rounded-full absolute  animate-spin w-8 h-8">
  </div>
  <div v-else-if="size==='md'" style="border-top-color:transparent"
      class=" border-4 border-green-600 border-solid rounded-full absolute  animate-spin w-12 h-12">
  </div>
  <div v-else-if="size==='lg'" style="border-top-color:transparent"
      class=" border-4 border-green-600 border-solid rounded-full absolute  animate-spin w-20 h-20">
  </div>
  <div v-else-if="size==='xlg'" style="border-top-color:transparent"
      class=" border-4 border-green-600 border-solid rounded-full absolute  animate-spin w-30 h-30">
  </div>
  <div v-else-if="size==='xlg'" style="border-top-color:transparent"
      class=" border-4 border-green-600 border-solid rounded-full absolute  animate-spin w-30 h-30">
  </div>

</template>
