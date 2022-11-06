import {useCartStore} from '~/store/cart'
import { defineStore, storeToRefs } from 'pinia'
import { loadStripe } from "@stripe/stripe-js";

export const usePaymentStore = defineStore('payment-store', () => {
  const cartStore = useCartStore()
  const {cart} = storeToRefs(cartStore)
  const {completeOrder} = cartStore
  const clientSecret = ref()
  const elements = ref()

  let stripe = loadStripe('pk_test_51LsqocClYU7g5v5lzZmind1W64YDhKbbwHEF0A9d9aIXGWaYJvBkFfpbhGtxVDXTUB1da6coOaGPc5AJXh4ZkTXp00cA0NerKa').then(resp=>{
    console.log('Stripe loaded');
    return stripe = resp
  })

  const getElements = async () => {
    if(!ready.value) {
      console.error('getElements was called but there is no "payment_session.data.client_secret" in the cart');
      return
    }
    const appearance = {theme: 'stripe'};
    const stripe = await getStripe()// "pi_3M0Tc7ClYU7g5v5l0K5TJanD_secret_7Gyt6HlwedJq9QU7UF1L6bFUE"
    return stripe.elements({ appearance, clientSecret: cart?.value?.payment_session?.data.client_secret });
  }

  const mountElement = async (el) => {
    elements.value = await getElements()
    const paymentElement = elements.value.create("payment")
    paymentElement.mount(el)
  }

  const paymentSessionExists = computed(()=>Boolean(cart.value?.payment_session?.id))

  const executePayment = async () => {
    const { error } = await stripe.confirmPayment({
      elements: elements.value,
      redirect: 'if_required'
    });
    console.log('error', error, error?.message);
    return(await completeOrder())
  }
  
  const getStripe = () => stripe

  // watch(()=>cart?.value?.payment_session?.data.client_secret, (secret) => {
  //   clientSecret.value = secret
  // }, {immediate: true})
  watch(()=>cart?.value?.payment_session, () => {
    if(!cart?.value?.payment_session) return
    console.log('watch cart.value.payment_session', cart.value.payment_session.data.client_secret);
    clientSecret.value = cart.value.payment_session.data.client_secret
  }, {immediate: true})

  const ready = computed(()=> Boolean(clientSecret.value) && paymentSessionExists.value)

  return {getStripe, getElements, mountElement, ready, executePayment}
})
