<script setup>
import {useCheckoutStore} from '~~/store/checkout'
import CheckoutAddress from '~~/components/Checkout/CheckoutAddress.vue';
import CheckoutPayment from '~~/components/Checkout/CheckoutPayment.vue';
import { storeToRefs } from 'pinia';
import {changeMainPageColor} from '~/pages/checkoutHelpers'
import { useCartStore } from '~~/store/cart';

const {cartIsFetching} = storeToRefs(useIsFetching())
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const {sections} = storeToRefs(checkoutStore)
const {next, selectShippingOptionFromUI, initCheckout} = checkoutStore
const {getCart} = cartStore
const {push: gotoRoute} = useRouter()

changeMainPageColor()

onBeforeMount( async () =>  {
  console.log('beforeMount', );
  const cart = await getCart()
  if(!cart?.value?.items?.length) gotoRoute('/')
  initCheckout()
})

</script>

<template>
  <div  class="checkout-wrapper">
  <!-- <pre>{{sections?.shipping}}</pre> -->
  <!-- <pre>{{cartFetchedCallbacks}}</pre> -->
    <div class="checkout flex flex-col gap-4 el pt-8">
      <checkout-contact  :section="sections.contact" @next="next"/>
      <checkout-address :section="sections.address" @next="next"/>
      <checkout-shipping-options @select="selectShippingOptionFromUI" :section="sections.shipping" @next="next"/>
      <checkout-payment :section="sections.payment" @next="next"/>
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
