import { defineStore } from "pinia";

import {API_BASE_URL} from '~/helpers/baseUrl'

export const useUserStore = defineStore('user-store', ()=>{
  
  let state = reactive({})
  let loggedIn = ref(false)

  const login = async (email = 'jpsala@gmail.com', password = 'Jrf4519405') => {
    let resp = undefined
    try {
      resp = await $fetch(`store/auth`, {
        baseURL: API_BASE_URL,
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    } catch (error) {
      console.warn('store/auth Error:', error);
    } finally{
      console.log('store/auth resp', resp);
    }
    return resp
  }

  const loginSavedUser = async () => {
    let resp = undefined

    try {
      resp = await $fetch(`/store/customers/me`, {
        credentials: 'include',
        method: "GET",
        baseURL: API_BASE_URL,
      })
    } catch (error) {
      console.warn('There is no saved user :', error);
    } finally{
      console.log('Saved user logged in', resp?.customer?.email);
      // console.log('Saved user logged in', `${resp.customer.first_name} ${resp.customer.last_name}`);
      Object.assign(state, resp?.customer)
      console.log('resp?.customer', resp?.customer);
    }
    return resp
  }

   const addUser = async () => {
    let resp = undefined

    try {
      resp = await $fetch(`http://localhost:9000/store/customers`, {
        credentials: 'include',
        method: "POST",
        baseURL: API_BASE_URL,
        body: JSON.stringify({
          first_name: "hhhhhhh",
          last_name: "hhhhhhh",
          email: "hhhhhhh@gmail.com",
          phone: "02236686454",
          password: "hhhhhhh"
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.warn('Error creating user: ', error);
    } finally{
      console.log('Resp for New User', resp);
      Object.assign(state, resp?.customer) 
      // await loginSavedUser()
    }
    return resp
  }


  watchEffect(() => {
    if(state.id) loggedIn.value = true
  })

  loginSavedUser()
  // login()
  // addUser()
  // login().then(resp=>{
  //   Object.assign(state, resp?.customer) 
  // })


  return {state, login, loggedIn}
})
