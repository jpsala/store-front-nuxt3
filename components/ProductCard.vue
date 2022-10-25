<script setup>
  import { formatPrice } from '~~/helpers/formatPrice';
import { useProductStore } from '~~/store/product'

  const productStore = useProductStore()
  const {getLowestPrice} = productStore

  const props = defineProps({
    product: {
      type: Object,
      name: "product"
    }
  })

  const lowestPrice = (product) => {
    const lp = getLowestPrice(product)
    return lp ? formatPrice(lp.amount, lp.currency_code) : ''
  }
</script>

<template>
  <div v-if="product">
    <nuxt-link :to="`/products/${product.id}`">
      <div
        class="group relative"
      >
        <div class="w-full min-h-auto bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
          <div class="w-auto h-full object-center object-cover bg-gray-100">
            <img
              alt=""
              :src="product.thumbnail"
            >
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <h3 class="text-sm text-gray-700 font-normal">
            {{ product.title }}
          </h3>
          <p class="text-sm font-semibold text-gray-900">
            from {{ lowestPrice(product) }}
          </p>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

