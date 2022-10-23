<script setup >
  import { useCartStore } from '~/store/cart'
  import { useProductStore } from '~/store/product'
  import { useRegionStore } from '~/store/region'
  import { storeToRefs } from 'pinia'
  import { formatPrice } from '~/helpers/formatPrice'

  const route = useRoute()
  const showDetails = ref(false)
  const imageToShow = ref('default_image')
  const quantity = ref(1)

  const cartStore = useCartStore()
  const {cart, cartForDebug} = storeToRefs(cartStore)
  const {addVariant: addVariantToCart} = cartStore

  const productStore = useProductStore()
  const {product, options, selectedVariant, validated, lowestPrice} = storeToRefs(productStore)
  const {changeProductByID , optionIsSelected} = productStore
  
  const {currencyCode} = storeToRefs(useRegionStore())

  const changeOption = (option, variant) => {
    option.selected = option.selected === variant ? undefined : variant
  }

  const increment = () => {
    quantity.value ++
  }

  const decrement = () => {
    if (quantity.value > 1) quantity.value --
  }

  await changeProductByID(route.params.id)
  
  if(product.value?.images.length) imageToShow.value = product.value.images[0].id

  const addToBag = () => {
      if(validated){
        addVariantToCart(selectedVariant.value.id,quantity.value)
    }
  }

</script>

<template>
  <div v-if="product" class="container mx-auto p-8">
    {{currencyCode}}
    <div class="flex flex-col lg:flex-row">
      <div class="lg:w-3/5 lg:pr-14">
        <div class="flex">
          <div class="hidden lg:flex flex-col items-center mr-4">
            <div class="w-auto h-full object-center object-cover px-4 space-y-4">
              <img
                v-for="image in product.images"
                :key="image.id"
                width="150"
                alt=""
                :src="image.url"
                class="cursor-pointer"
                @click="imageToShow = image.id"
              >
            </div>
          </div>

          <div class="h-auto w-full flex-1 flex flex-col rounded-lg overflow-hidden">
            <div class="w-auto h-full">
              <div
                v-for="image in product.images"
                :key="image.id"
              >
                <div v-if="image.id === imageToShow">
                  <img
                    alt=""
                    :src="image.url"
                    class="w-full"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 lg:mt-0 lg:w-2/5 lg:max-w-xl">
        <h1 class="font-semibold text-3xl">
          {{ product.title }}
        </h1>
        <p v-if="product.variants" class="text-lg mt-2 mb-4">
          {{ formatPrice(product.variants[0].prices[0].amount, currencyCode) }} (?{{ product.variants[0].prices[0].currency_code }})
        </p>
        <p v-else>
          10 USD
        </p>
        <p class="font-light">
          {{ product.description }}
        </p>
        <div v-for="option in options" :key="option.id" class="mt-6">
          <div class="text-sm">
            <p class="font-medium mb-2">
              {{ option.title }}
            </p>
            <div>
              <button
                v-for="value in option.values"
                :key="value.id"
                :class="{'bg-red-500': optionIsSelected(option, value)}"
                @click="changeOption(option, value)"
                class="btn"
              >
                {{ value.value }}
              </button>
            </div>
          </div>
        </div>
        <div class="inline-flex mt-12">
          <button :disabled="!validated" @click="addToBag()" class="btn-ui mr-2 px-12">
            Add to bag
          </button>
          <quantity-selector :quantity="quantity" @increment="increment" @decrement="decrement" />
        </div>
        <div class="mt-12">
          <div class="border-t last:border-b border-ui-medium py-6">
            <h3 class="-my-3 flow-root">
              <button
                class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
                type="button"
                @click="showDetails = !showDetails"
              >
                <span class="font-medium text-gray-900">Details</span>
                <span class="ml-6 flex items-center">
                  <span>—</span>
                </span>
              </button>
            </h3>
            <div v-if="showDetails" class="pt-6">
              <div class="space-y-4 text-ui-dark text-sm">
                <ul class="list-inside list-disc space-y-2">
                  <li>Weight: {{ product.weight ? `${product.weight} g` : 'Unknown' }}</li>
                  <li>Width: {{ product.width ? `${product.width} cm` : 'Unknown' }}</li>
                  <li>Height: {{ product.height ? `${product.height} cm` : 'Unknown' }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <pre :if="cart">Cart debug: {{cartForDebug}}</pre>
  </div>
  <div v-else>
    Loading...
  </div>
</template>
