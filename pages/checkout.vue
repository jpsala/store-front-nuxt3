<script setup>
import {useCheckoutStore} from '~~/store/checkout'
import CheckoutAddress from '~~/components/Checkout/CheckoutAddress.vue';
import { storeToRefs } from 'pinia';
import {changeMainPageColor} from '~/pages/checkoutHelpers'
import 'assets/styles/checkout.css'

const checkoutStore = useCheckoutStore()
// const cartStore = useCartStore()
const {sections} = storeToRefs(checkoutStore)
const {next} = checkoutStore
// const {cart} = storeToRefs(cartStore)

changeMainPageColor()

</script>

<template>
  <div  class="checkout-wrapper">
    <div class="checkout flex flex-col gap-4 el pt-8">
      <checkout-contact  :section="sections.contact" @next="next"/>
      <checkout-address :section="sections.address" @next="next"/>
      <checkout-delivery :section="sections.delivery" @next="next"/>

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
