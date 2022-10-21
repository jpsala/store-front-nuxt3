import { defineStore } from 'pinia'
const API_BASE_URL = 'http://localhost:9000/'
let cartId = process.client && localStorage.getItem('cart_id');
console.log('cartId', cartId);

export const useCartStore = defineStore('cart-store', () => {
  const _cart = ref({items:[]})
 
  const getCart = async () => {

    if (cartId) {
      const { data: resp } = useFetch(`/store/carts/${cartId}`, {baseURL: API_BASE_URL})
      watch(resp, async ()=>{
        if(resp.value?.cart){
          setCart(resp.value.cart)
        } else {
          localStorage.removeItem('cart_id')
          await createCart()
        }
      })
    } else await createCart()
  }

  const cartItemsCount = ref(0)
  watch(_cart, (aa)=>{
    console.log('AAA', aa.value?.items.lenght);
  }, {deep: true})
  
  const addGuestClientToCart = async (email) => {
    const resp = await $fetch(`/store/carts/${cartId}`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    console.log('resp', resp);
    cartId = resp.cart.id
    localStorage.setItem('cart_id', resp.cart.id);
    setCart(resp.cart)
    await addGuestClientToCart('user@example.com')
  }

  const setCart = (c) => {
    _cart.value = c
  }

  const addVariant = async (variantId) => {
    const resp = await $fetch(`/store/carts/${cartId}/line-items`, {
      baseURL: API_BASE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity: 1
      })
    })
    setCart(resp.cart)
  }

  const cart = computed( () => {
    return _cart
  })

  if(process.client) getCart()

  return { cart, setCart, addVariant, cartItemsCount }
})

