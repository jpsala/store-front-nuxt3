<script setup>
  import { useProductStore } from '~~/store/product'
  import { storeToRefs } from 'pinia'
  const productStore = useProductStore()
  const {products} = storeToRefs(productStore)
  const {fetchProducts} = productStore
  if(!products.value.length) fetchProducts()
 
</script>

<template>
  <div class="container mx-auto p-8">
    <div class="w-full border-b border-ui-medium pb-6 mb-2 lg:mb-6 flex items-center justify-between">
      <h1 class="font-semibold text-3xl">
        All Products
      </h1>
    </div>

    <div
      v-if="products?.length"
      class="grid grid-cols-4 gap-8 "
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
