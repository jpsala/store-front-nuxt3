<script setup>
  import { storeToRefs } from 'pinia';
  import { formatPrice } from '~~/helpers/formatPrice';
  import {useCartStore} from '~~/store/cart'
  import { useRegionStore } from '~/store/region'

  const cartStore = useCartStore()
  const {cart} = storeToRefs(cartStore)
  const {updateItem, removeItem} = cartStore
  const { currencyCode } = storeToRefs(useRegionStore())

  const changeQuantity = async (item, quantity, setSpinner) => {
    setSpinner(true)
    await updateItem(item.id, quantity)    
    setSpinner(false)
  }

  const remove = async (item, setSpinner) => {
    setSpinner(true)
    await removeItem(item.id);
    setSpinner(false)
  }
</script>

<template>
  <div class="cart flex">

    <div>
      <!-- Title -->
      <div class="p-4 font-semibold text-xl">Shopping Bag</div>
      <!-- Body -->
      <div class="cart-body flex">
        <div class="cart-items ">
          <div v-for="item of cart.items">
            <cart-item  @changeQuantity="changeQuantity" @remove="remove" class="p-2 m-4 rounded-md" :item="item" />
          </div>
        </div>
      </div>
    </div>
    <!-- Summary -->
    <div v-if="cart.subtotal" class="m-3 border rounded self-start p-4">
      <div class="mx-2 mb-3 font-semibold text-xl w-300px">Order Summary</div>
      <div class="summary-line">
        <span class="font-light">Subtotal</span>
        <span class="">{{formatPrice(cart.subtotal, currencyCode)}}</span>
      </div>
      <div class="summary-line">
        <span class="font-light">Estimated Shipping</span>
        <span class="">{{formatPrice(0, currencyCode)}}</span>
      </div>
      <div class="summary-line">
        <span class="font-light">Taxes</span>
        <span class="">{{formatPrice(0, currencyCode)}}</span>
      </div>
      <hr>
      <div class="summary-line">
        <span class="font-light">Total</span>
        <span class="">{{formatPrice(cart.total, currencyCode)}}</span>
      </div>
      <button class="btn-ui w-full mt-4">Checkout</button>
    </div>

  </div>
</template>

<style >

.cart {
  @apply mt-5 mx-auto w-[90%] lg:w-[1024px] rounded-md
}
.summary-line{
  @apply flex justify-between mx-2 mb-2
}
</style>
