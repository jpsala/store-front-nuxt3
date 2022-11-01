<script setup>
  import CheckoutSection from './CheckoutSection.vue';
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
</script>

<template>
  <checkout-section :section="section">
    {{section}}
  </checkout-section>
</template>

<style scoped>
  input{
    border: 1px solid black;
  }
</style>
