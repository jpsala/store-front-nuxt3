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
    <label class="flex flex-col" for="email">Email
      <input class="mt-2 p-1 rounded-md" type="email" name="email" v-model="section.data.email"/>
    </label>
  </checkout-section>
</template>
