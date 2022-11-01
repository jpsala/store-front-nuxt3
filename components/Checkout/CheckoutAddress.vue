<script setup>
  import CheckoutSection from './CheckoutSection.vue';
  const props = defineProps({
    section:{
      type: Object,
      require: true
    },
  })
</script>

<template>
  <checkout-section :section="section">

    <!-- <label class="flex flex-col" for="email">Company
      <input class="mt-2 p-1 rounded-md" type="text" name="company" v-model.lazy="section.data.company"/>
      <span v-show="section.errors.company" class="field-error text-red-500 text-right">{{section.errors.company}}</span>
    </label> -->

    <div class="flex justify-between gap-4">
      <label class="flex flex-col w-full" for="email">First name
        <input class="mt-2 p-1 rounded-md" type="text" name="first_name" v-model.lazy="section.data.first_name"/>
      </label>
      <label class="flex flex-col w-full" for="email">Last name
        <input class="mt-2 p-1 rounded-md" type="text" name="last_name" v-model.lazy="section.data.last_name"/>
      </label>
    </div>

    <div class="flex justify-between gap-4 mt-5">
      <label class="flex flex-col" for="email">Province
        <input class="mt-2 p-1 rounded-md" type="text" name="province" v-model.lazy="section.data.province"/>
      </label>
      <label class="flex flex-col w-full" for="email">City
        <input class="mt-2 p-1 rounded-md" type="text" name="city" v-model.lazy="section.data.city"/>
      </label>

      <label class="flex flex-col w-25" for="email">Postal code
        <input class="mt-2 p-1 rounded-md" type="text" name="postal_code" v-model.lazy="section.data.postal_code"/>
      </label>
    </div>

    <!-- <label class="flex flex-col" for="email">Country code
      <input class="mt-2 p-1 rounded-md" type="text" name="country_code" v-model.lazy="section.data.country_code"/>
    </label>
     -->
    <div class="flex gap-4 mt-5">
      <label class="flex flex-col w-full" for="email">Address
        <input class="mt-2 p-1 rounded-md" type="text" name="address_1" v-model.lazy="section.data.address_1"/>
      </label>

      <label class="flex flex-col mb-5" for="email">Phone
        <input class="mt-2 p-1 rounded-md" type="text" name="phone" v-model.lazy="section.data.phone"/>
      </label>    
    </div>
  </checkout-section>
</template>

<style scoped>
  input{
    border: 1px solid black;
  }
</style>
