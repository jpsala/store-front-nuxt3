<script setup>
import {useCheckoutStore} from '~~/store/checkout'

const {openSection} = useCheckoutStore()
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })

</script>

<template>
  <div>
  <div v-show="!section.closed" class="checkout-section-body">
    <section-title :title="section.title" />
    <div class="section-body px-5 py-4">
      <slot />
      <button :disabled="!section.valid" @click="$emit('next', section.id)" class="btn-ui ml-auto mt-6 block">Next</button>
    </div>
  </div>
  <div v-show="section.closed" class="checkout-section-body p-4 mr-6 flex place-content-between items-center">
    <div class="font-semibold">{{section.title}}</div>
    <button v-if="section.valid" class="btn-ui" @click="openSection(section.id)">✓</button>
    <div v-else></div>
  </div>
</div>
</template>

<style>
.checkout-section-body{
  @apply rounded-lg mx-8 sm:w-full w-[70%]  max-w-[800px] bg-white
}
</style>
