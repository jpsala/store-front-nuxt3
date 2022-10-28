import { defineStore } from "pinia";

import {API_BASE_URL} from '~/helpers/baseUrl'

export const usecustomerStore = defineStore('customer-store', ()=>{
  
  let state = reactive({})
  let loggedIn = ref(false)
  let loggingIn = ref(true)

  const login = async ({email = 'jpsala@gmail.com', password = 'Jrf4519405'}) => {
    try {
      const resp = await $fetch(`store/auth`, {
        baseURL: API_BASE_URL,
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      resp?.customer && setCustomerState(resp.customer)
    } catch (error) {
      console.warn('Couldn\'t Login');
    }
  }

  const loginSavedUser = async () => {
    if(!process.client) return
    try {
      const resp = await $fetch(`/store/customers/me`, {
        credentials: 'include',
        method: "GET",
        baseURL: API_BASE_URL,
      })
      if(!resp || !resp.customer) return 
      console.log('Saved customer logged in', resp?.customer?.email);
      resp?.customer && setCustomerState(resp.customer)
    } catch (error) {
      console.log('There is no saved customer :', error);
      setCustomerState({})
    }
  }

  const setCustomerState = (customer) => {
    loggingIn.value = false
    Object.assign(state, customer)
    loggedIn.value = state?.id !== undefined
  }

   const addUser = async () => {
    let resp = undefined

    try {
      resp = await $fetch(`http://localhost:9000/store/customers`, {
        credentials: 'include',
        method: "POST",
        baseURL: API_BASE_URL,
        body: JSON.stringify({
          first_name: "Angel",
          last_name: "Morales",
          email: "angelmoraleszero@gmail.com",
          phone: "02236686454",
          password: "angel"
        }),
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
  // addUser()

  /*
   login and set the customer state, just for testing!!!
  */
  // login({email:'jpsala@gmail.com', password:'Jrf4519405'})


  return {state, login, loggedIn, loggingIn}
})
