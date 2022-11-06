<script setup>
  import { useCustomerStore} from '~/store/customer'
  const route = useRoute()
  const token = route.params.token
  const email = route.params.email
  const state = reactive({password:'', passwordRepeat: ''})
  const {resetPassword: resetUserPassword} = useCustomerStore()

  const validPasswords = computed(()=> state.password === state.passwordRepeat && state.password?.length > 4)
  const resetPassword =  ()=>resetUserPassword({email: email, password: state.password, token})
</script>

<template>
  <section class="dark:bg-gray-900 center w-[400px]">
    <div class="flex flex-col items-center justify-center px-6 py-4 mx-auto md:my-auto lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Password Reset
                </h1>
                <form @submit.prevent="submit" class="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input type="password" v-model="state.password" name="password" id="password" placeholder="••••••••" class=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat Password</label>
                        <input type="password" v-model="state.passwordRepeat" name="password" id="password-repeat" placeholder="••••••••" class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </div>
                    <button @click="resetPassword" :disabled="!validPasswords" type="submit" class="w-full  btn-ui">Submit</button>
                </form>
            </div>
        </div>
    </div>
  </section>
  </template>

<style>
.center{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>  
