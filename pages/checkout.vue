<script setup>
import {useCheckoutStore} from '~~/store/checkout'
import CheckoutAddress from '~~/components/Checkout/CheckoutAddress.vue';
import { storeToRefs } from 'pinia';
import 'assets/styles/checkout.css'

const checkoutStore = useCheckoutStore()
const {sections} = storeToRefs(checkoutStore)
const {next} = checkoutStore

onMounted(() => {
  document.querySelector('main').classList.add('bg-light-700')
})
</script>

<template>
  <div  class="checkout-wrapper">
    <div v-if="sections?.contact?.id" class="checkout flex flex-col gap-4 el ">

      <checkout-contact :section="sections.contact" @next="next" class="mt-8"/>
      <checkout-address :section="sections.address" @next="next"/>

    </div>
  </div>
</template>

<style scoped>
.checkout-wrapper{
  @apply w-full
}
.checkout{
  @apply w-[80%] mx-auto
}
.cart-section{
  @apply 
}
.checkout .checkout-section{
  @apply ;
}
</style>
