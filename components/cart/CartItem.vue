<script setup>
  import { useRegionStore } from '~/store/region'
  import { formatPrice } from '~~/helpers/formatPrice';

  const emit = defineEmits(["changeQuantity", "remove"])
  const { currencyCode } = useRegionStore()

  
  
  const changeQuantity = (quantity) => {
    const setSpinner = (on) => on ? $el.classList.remove('hidden') : $el.classList.add('hidden')
    const $el = document.getElementById(`cartItem${props.item.id}`).querySelector(`.spinner-quantity`)
    emit('changeQuantity', props.item, quantity, setSpinner)
  }
  
  const remove = () => {
    const $el = document.getElementById(`cartItem${props.item.id}`).querySelector(`.remove-item-spinner`)
    const setSpinner = (on) => on ? $el.classList.remove('hidden') : $el.classList.add('hidden')
    emit('remove', props.item, setSpinner) 
  }

  const props = defineProps({
      item: {
        type: Object
      }
  })
</script>

<template>
  <div :id="`cartItem${item.id}`" class="cart-item flex gap-4">
    <img class="rounded-md border1 w-[200px]" :src="item.variant.product.thumbnail" alt="">
    <div class="w-full flex flex-col justify-between ">

      <div class="relative">
        <spinner class="remove-item-spinner hidden" />
        <div class="remove-item-wrapper absolute top-2 right-0 mb-4">
          <button @click="remove" class="remove-popover text-gray-500 font-semibold hover:(font-bold text-black)">
            X
          </button>
          <div class="popover absolute right-[-18px] top-[29px] w-[200px] bg-white hidden border border-r">
            <div class="w-full border-b mb-3 p-2 bg-white  text-red-600 font-bold">Warning...</div>
              <div class="popover-body p-2">
                Remove this item from the cart.
                <div class="popover-arrow__arrow popover-arrow__arrow--tr"></div>
              </div>
            </div>
        </div>

        <div class="flex justify-between">
          <div class="font-semibold mb-4">{{item.title}}</div>
        </div>

        <div class="font-normal mb-4 font-light">{{item.variant.product.description}}</div>
        <div class="font-extralight">Variant: {{item.variant.title}}</div>

      </div>

      <div class="flex justify-between align-middle tracking-widest items-center">
        <div class="font-semibold  tracking-widest">
          {{formatPrice(item.total, currencyCode)}}
        </div>
        <quantity-selector 
            class="relative" :quantity="item.quantity" 
            @change="(quantity)=>changeQuantity(quantity)"
            @increment="(quantity)=>changeQuantity(quantity)" 
            @decrement="(quantity)=>changeQuantity(quantity)"
          >
          <spinner class="spinner-quantity top-2 left-7 hidden" />
        </quantity-selector>
      </div>
    </div>
  </div>
</template>

<style>
.remove-item-wrapper:hover .popover {
  display: block;
}
</style>
