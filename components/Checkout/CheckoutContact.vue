<script setup>
  import { storeToRefs } from 'pinia';
  import { useCustomerStore } from '~~/store/customer';
  import CheckoutSection from './CheckoutSection.vue';

  const {loggedIn, loggingIn} = storeToRefs(useCustomerStore())

  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
</script>

<template>
  <checkout-section :section="section" v-if="true || !loggedIn && !loggingIn">
    <label class="flex flex-col" for="email">Email
      <input :disabled="loggedIn" class="mt-2 p-1 rounded-md" type="email" name="email" v-model="section.data.email"/>
      <div v-if="section.errors.email" class="w-full text-right text-red-600 text-sm py-2">{{section.errors.email}}</div>
    </label>
  </checkout-section>
</template>
