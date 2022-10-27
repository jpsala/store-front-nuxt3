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
        contentType: 'application/json',
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    } catch (error) {
      console.warn('Error:', error);
    } finally{
      console.log('resp', resp);
    }
    return resp
  }

  watchEffect(() => {
    if(state.id) loggedIn.value = true
  })

  login().then(resp=>{
    Object.assign(state, resp?.customer) 
  })

  return {state, login, loggedIn}
})
