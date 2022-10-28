import { defineStore, storeToRefs } from 'pinia'
import {API_BASE_URL} from '~/helpers/baseUrl'
import {usecustomerStore} from '~/store/customer'


export const useCartStore = defineStore('cart-store', () => {
  const cart = ref({items:[]})
  const { loggedIn: userLoggedIn, state: userState} = storeToRefs(usecustomerStore())
  const loading = ref(true)
  let cartId = process.client && localStorage.getItem('cart_id');

  const getCart = async () => {
    if (cartId) {
      let resp
      try {
        resp = await $fetch(`/store/carts/${cartId}`, {baseURL: API_BASE_URL})
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

  const addGuestCustomerToCart = async (email) => {
    if(cart.value.customer_id){
      console.log('addGuestCustomerToCart: cart already has a customer assigned');
      return
    }
    const resp = await $fetch(`/store/carts/${cartId}`, {
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
    const resp = await $fetch(`/store/carts/${cartId}`, {
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
    const resp = await $fetch(`/store/carts`, {
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
    console.log('Setting the cart content and have %O item/s', c.items?.length);
    cart.value = c
    loading.value = false
  }

  const addItem = async (variantId, quantity) => {
    const resp = await $fetch(`/store/carts/${cartId}/line-items`, {
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
    console.log('lineItemID', `/store/carts/${cartId}/line-items/${lineItemID}`);
    const resp = await $fetch(`/store/carts/${cartId}/line-items/${lineItemID}`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'DELETE',
    })
    setCart(resp.cart)
  }

  const updateItem = async (lineItemID, quantity) => {
    console.log('lineItemID, quantity', lineItemID, quantity);
    const resp = await $fetch(`/store/carts/${cartId}/line-items/${lineItemID}`, {
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

  // finally we load the cart using the id from localStorage
  // if there is no cart in localStorage with that id we create a cart
  getCart().then(_cart=>{
    if(!_cart) createCart()
  })

  return { cart, setCart, addItem, removeItem, cartItemsCount, cartForDebug, updateItem, addGuestCustomerToCart, loading }
})

