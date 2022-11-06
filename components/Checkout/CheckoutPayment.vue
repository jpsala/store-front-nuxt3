<script setup>
  import CheckoutSection from './CheckoutSection.vue';
  import {usePaymentStore} from '~/store/payment'
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
  const paymentStore = usePaymentStore()
  const {mountElement} = paymentStore
  const {ready} = storeToRefs(paymentStore)
  
  console.log('ready', ready.value, !props.section.closed);
  
  onMounted(() => {
    watch(()=>ready.value,()=>{
      nextTick(()=>{
        if(!ready.value) return
          mountElement("#payment-element")
        })
    }, {immediate: true})
  })
</script>

<template>
  <checkout-section :section="section">
    <pre>{{ready ? 'ready':'no'}}</pre>
    <div class="w-full">
      <div id="payment-element" class="p-5 w-[300px] m-auto"></div>
    </div>
  </checkout-section>
</template>
