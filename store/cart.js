import { defineStore, storeToRefs } from 'pinia'
import {API_BASE_URL} from '~/helpers/baseUrl'
import {useCustomerStore} from '~/store/customer'


export const useCartStore = defineStore('cart-store', () => {
  const cart = ref({items:[]})
  const { loggedIn: userLoggedIn, state: userState} = storeToRefs(useCustomerStore())
  const loading = ref(true)
  const cartFetchedCallbacks = []
  let cartId = process.client && localStorage.getItem('cart_id');

  const getCart = async () => {
    if (cartId) {
      let resp
      try {
        resp = await $fetch(`/carts/${cartId}`, {baseURL: API_BASE_URL})
      } catch (error) {
        console.warn('Error in getCart ', error)
      } finally{
        if(resp.cart){
          setCart(resp.cart)
          return resp.cart
        } else {
          localStorage.removeItem('cart_id')
          return undefined
        }
      }
    } else return new Promise(resolve => resolve())
  }

  const cartItemsCount = computed(()=>{
    return cart.value.items.reduce((accumulator, item)=>{
      return accumulator + item.quantity
    }, 0)
  })

  const addShippingAddress = async payload => {
    let returnState = false
    payload.country_code = 'es'
    try {
      const {data, error, pending} = await useFetch(`/carts/${cartId}`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify({"shipping_address":payload})
      })
      if(error.value){
        let errorData = 'Error getting error data'
        try {
          errorData = formatForLog(JSON.parse(error.value.data.message))
        } catch (error) {
           errorData = error.value
        }
        console.warn('addShippingAddress Error: %O', errorData);
      }else{
        setCart(data.value.cart);
        returnState = true
      }
    } catch (error) {
      console.log('error', error);      
    }
    return returnState
  }

  const addGuestCustomerToCart = async (email) => {
    if(cart.value.customer_id){
      console.log('addGuestCustomerToCart: cart has a customer assigned');
      return
    }
    const resp = await $fetch(`/carts/${cartId}`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      body: JSON.stringify({
        email
      })
    })
    console.log('addGuestCustomerToCart: Guest user email added to the cart', email);
    setCart(resp.cart);
  }

  const addCustomerToCart = async (customerId) => {
    if(customerId === cart.value.customer_id) return
    const resp = await $fetch(`/carts/${cartId}`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId
      })
    })
    setCart(resp.cart);
  }

  const createCart = async () => {
    if(!process.client) return
    console.log('Creating Cart', process.client);
    const resp = await $fetch(`/carts`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      body: JSON.stringify({
        // "region_id": "reg_01GFBKAA7SXN94PT913Q6E34A1",
        // "email": "lebron@james.com"
      })
    })
    cartId = resp.cart.id
    process.client && localStorage.setItem('cart_id', resp.cart.id);
    setCart(resp.cart)
  }

  const setCart = (c) => {
    c.shipping_address && delete c.shipping_address.id
    c.shipping_address && delete c.shipping_address.created_at
    c.shipping_address && delete c.shipping_address.updated_at 
    c.shipping_address && delete c.shipping_address.deleted_at 
    c.shipping_address && delete c.shipping_address.customer_id 
    cart.value = c
    loading.value = false
    cartFetchedCallbacks.forEach(callback => {
      callback(c)
    })
  }

  const onCartFetched = callback => {
    if(!cartFetchedCallbacks.find(c => c === callback)) cartFetchedCallbacks.push(callback)
    console.log('onCartFetched adding callback', cartFetchedCallbacks);
  }

  const addItem = async (variantId, quantity) => {
    const resp = await $fetch(`/carts/${cartId}/line-items`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'POST',
      body: JSON.stringify({
        variant_id: variantId,
        quantity
      })
    })
    setCart(resp.cart)
  }

  const removeItem = async (lineItemID) => {
    console.log('lineItemID', `/carts/${cartId}/line-items/${lineItemID}`);
    const resp = await $fetch(`/carts/${cartId}/line-items/${lineItemID}`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'DELETE',
    })
    setCart(resp.cart)
  }

  const updateItem = async (lineItemID, quantity) => {
    console.log('lineItemID, quantity', lineItemID, quantity);
    const resp = await $fetch(`/carts/${cartId}/line-items/${lineItemID}`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'POST',
      body: JSON.stringify({
        quantity: Number(quantity)
      })
    })
    setCart(resp.cart)
  }

  // watcher for cart.id to call addCustomerToCart
  watch(()=>cart.value?.id, (id)=>{
    if(id && userState.value.id){
      addCustomerToCart(userState.value.id)
    }
  })

  const cartForDebug = computed(() => {
    return {
      quantity: cartItemsCount.value,
      payment_provider: cart.value.payment_provider,
      email: cart.value.email,
      customer_id: cart.value.customer_id,
      subtotal: cart.value.subtotal,
      shipping_total: cart.value.shipping_total,
      discount_total: cart.value.discount_total,
      total: cart.value.total,

      items: cart.value?.items.map(i => 
        {
          return {
            title: i.title,
            description: i.description,
            quantity: i.quantity,
            variant_id: i.variant_id,
          }
      })
    }
  })

  /*
    finally we load the cart using the id from localStorage
    if there is no cart in localStorage we create a cart
  */

  getCart().then(_cart=>{
    if(!_cart) createCart()
  })

  return { 
    cart, setCart, addItem, removeItem, cartItemsCount, cartForDebug, updateItem, addGuestCustomerToCart, 
    addShippingAddress, onCartFetched, loading 
  }
})

