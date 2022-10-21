<template>
  <div class="container mx-auto p-8">
    <div class="w-full border-b border-ui-medium pb-6 mb-2 lg:mb-6 flex items-center justify-between">
      <h1 class="font-semibold text-3xl">
        All Products
      </h1>
    </div>

    <div
      v-if="products.length"
      class="grid grid-cols-4 gap-8 "
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :item="product"
      />
    </div>
  </div>
</template>

<script setup>
      const {API_BASE_URL} = useRuntimeConfig() 
      const  { data, pending, refresh, error } = await useFetch(() => '/store/products', { baseURL: API_BASE_URL })
      const products = data.value.products
      const {data: d2, error: e2} = await useFetch(`/store/products/prod_01GFBKAAF2RECZ81F4KMSRAMDC`, { baseURL: API_BASE_URL })
</script>
