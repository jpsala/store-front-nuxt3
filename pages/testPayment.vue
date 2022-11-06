<script setup>
// import { storeToRefs } from 'pinia';
// import { useCartStore } from '~~/store/cart';
// import {usePaymentStore} from '~/store/payment'

// const {getStripe} = usePaymentStore()
// const cartStore = useCartStore()
// const {getCart} = cartStore
// const stripe = await getStripe()
// const cart = await getCart()

// onMounted(() => {
//   const appearance = {theme: 'stripe'};
//   const elements = stripe.elements({ appearance, clientSecret: cart?.value.payment_session.data.client_secret });
  
//   const paymentElement = elements.create("payment");
//   paymentElement.mount("#payment-element");
// })

</script>

<template>
  <div v-show="cart?.id" class="w-full">
    <div id="payment-element" class="p-5 w-[300px] m-auto"></div>
  </div>
</template>

<style scoped>
</style>
