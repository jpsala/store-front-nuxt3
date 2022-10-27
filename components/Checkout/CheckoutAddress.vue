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
  </checkout-section>
</template>
