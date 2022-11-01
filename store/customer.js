import { defineStore } from "pinia";

import {API_BASE_URL} from '~/helpers/baseUrl'

export const useCustomerStore = defineStore('customer-store', ()=>{
  
  let state = reactive({})
  let loggedIn = ref(false)
  let loggingIn = ref(true)

  const login = async ({email = 'jpsala@gmail.com', password = 'Jrf4519405'}) => {
    try {
      const resp = await $fetch(`/auth`, {
        baseURL: API_BASE_URL,
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      resp?.customer && setCustomerState(resp.customer)
      return resp
    } catch (error) {
      console.warn('Couldn\'t Login');
      return error
    }
  }

  const resetPasswordRequest = async (email) => {
    console.log('Resetting password for ', email);
    const {data, error} = await useFetch('/customers/password-token', {
      credentials: 'include',
      method: "POST",
      baseURL: API_BASE_URL,
      body: JSON.stringify({email}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('resetPasswrod', data.value, error.value);
    return error.value
  }
  const resetPassword = async ({email, password, token}) => {
    console.log('Resetting password for ', email);
    const {data, error} = await useFetch('/customers/password-reset', {
      credentials: 'include',
      method: "POST",
      baseURL: API_BASE_URL,
      body: JSON.stringify({email, password, token}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('resetPasswrod', data.value, error.value);
    return error.value
  }

  const loginSavedUser = async () => {
    if(!process.client) return
    try {
      const resp = await $fetch(`/customers/me`, {
        credentials: 'include',
        method: "GET",
        baseURL: API_BASE_URL,
      })
      console.log('Saved customer logged in', resp?.customer?.email);
      resp?.customer && setCustomerState(resp.customer)
      setCustomerState(resp?.customer)
    } catch (error) {
      console.warn('There is no saved customer :', error);
      setCustomerState({})
    }
  }

  const setCustomerState = (customer) => {
    loggingIn.value = false
    Object.assign(state, customer)
    loggedIn.value = state?.id !== undefined
  }

   const addUser = async (payload) => {
    let resp = undefined

    try {
      resp = await $fetch(`/customers`, {
        credentials: 'include',
        method: "POST",
        baseURL: API_BASE_URL,
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.warn('Error creating customer: ', error);
    } finally{
      console.log('Resp for New customer', resp);
      setCustomerState(resp?.customer)
    }
    return resp
  }

  /*
  try to login the user using the cookie saved in the browser
  */
  
  loginSavedUser()

  // just for testing!!!
  // addUser({
  //   first_name: "Juan",
  //   last_name: "Sala",
  //   email: "jpsala@gmail.com",
  //   phone: "02236686454",
  //   password: "Jrf4519405"
  // })
  // ddUser({
  //   first_name: "Angel",
  //   last_name: "Morales",
  //   email: "angelmoraleszero@gmail.com",
  //   phone: "02236686454",
  //   password: "angel"
  // })
  /*
   login and set the customer state, just for testing!!!
  */
  // login({email:'jpsala@gmail.com', password:'Jrf4519405'})
  // resetPassword('jpsala@gmail.com')

  return {state, login, loggedIn, loggingIn, resetPasswordRequest, resetPassword}
})
