<script setup>
  import CheckoutSection from './CheckoutSection.vue';
  import {useCartStore} from '~/store/cart'
  import {useRegionStore} from '~/store/region'
import { storeToRefs } from 'pinia';
  const {cart} = storeToRefs(useCartStore())
  const {region, regions} = storeToRefs(useRegionStore())
  const props = defineProps({
    section:{
      type: Object,
      require: true
    }
  })
  const regionName = computed(() => {
    console.log('cart.value.region_id', cart.value.region_id);
    return regions.value.find(r => r.id === cart.value.region_id)?.name
  })
</script>

<template>
  <checkout-section :section="section">
    <!-- <label class="flex flex-col" for="email">Company
      <input class="mt-2 p-1 rounded-md" type="text" name="company" v-model.lazy="section.data.company"/>
      <span v-show="section.errors.company" class="field-error text-red-500 text-right">{{section.errors.company}}</span>
    </label> -->

    <div class="flex justify-between gap-4">
      <label class="flex flex-col w-full" for="first_name">First name
        <input class="mt-2 p-1 rounded-md" type="text" name="first_name" v-model.lazy="section.data.first_name"/>
        <div  v-if="section.errors.first_name" class="w-full text-right text-red-600, text-sm">{{section.errors.first_name}}</div>
      </label>
      <label class="flex flex-col w-full" for="last_name">Last name
        <input class="mt-2 p-1 rounded-md" type="text" name="last_name" v-model.lazy="section.data.last_name"/>
      </label>
    </div>

    <div class="flex justify-between gap-4 mt-5">
      <label class="flex flex-col" for="province">Province
        <input class="mt-2 p-1 rounded-md" type="text" name="province" v-model.lazy="section.data.province"/>
      </label>
      <label class="flex flex-col w-full" for="city">City
        <input class="mt-2 p-1 rounded-md" type="text" name="city" v-model.lazy="section.data.city"/>
      </label>

      <label class="flex flex-col w-25" for="postal_code">Postal code
        <input class="mt-2 p-1 rounded-md" type="text" name="postal_code" v-model.lazy="section.data.postal_code"/>
      </label>
    </div>

    <!-- <label class="flex flex-col" for="email">Country code
      <input class="mt-2 p-1 rounded-md" type="text" name="country_code" v-model.lazy="section.data.country_code"/>
    </label>
     -->
    <div class="flex gap-4 mt-5">
      <label class="flex flex-col w-full w-[380px]" for="address_1">Address
        <input class="mt-2 p-1 rounded-md" type="text" name="address_1" v-model.lazy="section.data.address_1"/>
      </label>

      <label class="flex flex-col mb-5 w-[180px]" for="phone">Phone
        <input class="mt-2 p-1 rounded-md" type="text" name="phone" v-model.lazy="section.data.phone"/>
      </label>

      <label class="flex flex-col mb-5 w-[100px]" for="country_code">Country Code
        <input disabled="disabled" class="mt-2 p-1 rounded-md" type="text" name="country_code" v-model.lazy="section.data.country_code"/>
      </label>
      <label class="flex flex-col mb-5" for="region_id">CartRegion
        <input disabled="disabled" class="mt-2 p-1 rounded-md w-13" type="text" name="region_id" :value="regionName"/>
      </label>    
    </div>
  </checkout-section>
</template>

