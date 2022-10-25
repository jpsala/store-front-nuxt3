import { defineStore } from 'pinia'

const API_BASE_URL = 'http://localhost:9000/'
let cartId = process.client && localStorage.getItem('cart_id');

export const useCartStore = defineStore('cart-store', () => {
  const cart = ref({items:[]})

  const getCart = async () => {
    if (cartId) {
      const resp = await $fetch(`/store/carts/${cartId}`, {baseURL: API_BASE_URL})
      if(resp.cart){
        setCart(resp.cart)
      } else {
        localStorage.removeItem('cart_id')
        await createCart()
      }
    } else await createCart()
  }

  const cartItemsCount = computed(()=>{
    return cart.value.items.reduce((accumulator, item)=>{
      return accumulator + item.quantity
    }, 0)
  })

  const addGuestClientToCart = async (email) => {
    const resp = await $fetch(`/store/carts/${cartId}`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      body: JSON.stringify({
        email
      })
    })
    setCart(resp.cart);
  }

  const createCart = async () => {
    const resp = await $fetch(`/store/carts`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      body: JSON.stringify({
        // "region_id": "reg_01GFBKAA7SXN94PT913Q6E34A1",
        // "email": "lebron@james.com"
      })
    })
    cartId = resp.cart.id
    localStorage.setItem('cart_id', resp.cart.id);
    setCart(resp.cart)
    await addGuestClientToCart('user@example.com')
  }

  const setCart = (c) => {
    cart.value = c
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

  if(process.client) getCart()

  return { cart, setCart, addItem, removeItem, cartItemsCount, cartForDebug, updateItem }
})

