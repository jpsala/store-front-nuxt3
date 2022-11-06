<script setup>
  import CheckoutSection from './CheckoutSection.vue';
  import {formatCurrency} from '~/helpers/formatCurrency'
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
</script>

<template>
  <checkout-section :section="section">
    <div class="flex flex-col gap-2">
      <div v-if="section.fetching" class="text-center text-lg text-warm-gray-800">
          Getting the shippment options...
      </div>
      <div v-else @click="$emit('select', option.id)" :class="{'selected': option.selected}" class="option shadow rounded-md p-4 cursor-pointer flex gap-2 place-content-between items-center relative"
        v-for="option in section.data" :key="option.id"
      >
        <div class="font-semibold text-sm">
          {{ option.name }}
        </div>
        <div class="text-xs text-gray-500 mt-2">
          {{ formatCurrency(option.amount) }}
        </div>
        <span v-if="option.selected" class="absolute right-[-9px] top-[-15px] text-green-600 text-2xl">✓</span>
      </div>
    </div>
  </checkout-section>
</template>

<style scoped>
  input{
    border: 1px solid black;
  }
  .selected{
    @apply elevation-3 shadow-gray-900 text-black font-bold
  }
  .selected div{
    @apply text-black font-bold
  }

</style>
