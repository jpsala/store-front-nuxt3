import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import { defineStore, storeToRefs } from 'pinia'
import {API_BASE_URL} from '~/helpers/baseUrl'
import {useCustomerStore} from '~/store/customer'
import { uniqueString } from '~~/helpers/uniqueString'
import { useRegionStore } from '~/store/region';
import formatForLog from '~~/helpers/formatForLog';

export const useCartStore = defineStore('cart-store', () => {
  const cart = ref({items:[]})
  const { state: userState} = storeToRefs(useCustomerStore())
  const cartIsFetching = ref(false)
  const cartFetchedCallbacks = ref([])
  const {overlayShow, overlayHide} = useOverlay()
  const shippingOptions = ref([])
  const {region, regions, country} = storeToRefs(useRegionStore())

  let cartId = process.client && localStorage.getItem('cart_id');
  let fetchPromise = undefined
  const fetchingShippingOptions = ref(false)

  const getCartOld = async () => {
    if(cart.value?.id) return cart
    if (cartId) {
      overlayShow('getCart', 'Fetching the cart')
      if(cartIsFetching.value || fetchPromise) return fetchPromise
      cartIsFetching.value = true
      return fetchPromise = $fetch(`/carts/${cartId}`, {baseURL: API_BASE_URL})
      .then(resp =>{
          setCart(resp.cart, 'getCart')
          return cart
      }).catch((error) => {
        console.warn('getCart catch', error);
        return (fetchPromise = createCart())
      }).finally(()=>{
        overlayHide('getCart')
        cartIsFetching.value = false
        fetchPromise = undefined
      })
    } else if(process.client) {
      return (fetchPromise = createCart())
    } else return undefined
  }

  const getCart = async () => {
    if(!process.client) return
    if(cart.value?.id) return cart
    if (cartId) {
      overlayShow('getCart', 'Fetching the cart')
      cartIsFetching.value = true
      return useFetch(`/carts/${cartId}`, {baseURL: API_BASE_URL}).then(resp => {
        return new Promise(success => {
          watch(resp.data, async (data) => {
            cartIsFetching.value = false
            overlayHide('getCart', 'Fetching the cart')
            if(data?.cart?.id){
              setCart(data.cart)
              success(cart)
            } else{
              success(await createCart());
            }
          })
        })
      })
    } else return createCart()
  }

  const cartItemsCount = computed(()=>{
    return cart.value.items.reduce((accumulator, item)=>{
      return accumulator + item.quantity
    }, 0)
  })

  const addShippingAddress = async payload => {
    try {
      overlayShow('addShippingAddress')
      const reg = regions.value.find(r => r.id === cart.value?.region_id)
      console.log('region %O country %O', reg.name, payload.country_code);
      cartIsFetching.value = true
      const resp = await $fetch(`/carts/${cartId}`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify({"shipping_address":payload, region_id: region.value.id}),
        key: uniqueString()
      })
      setCart(resp.cart, 'addShippingAddress');
      // we also get the shipping options for this address
      await getShippingOptions()
      return cart
    } catch (error) {
      console.log('payload', payload);
      console.log('error', error.message ? error.message : formatForLog(error));      
    } finally {
      overlayHide('addShippingAddress')
      cartIsFetching.value = false
    }
  }
  /*
  const completeCart = async () => {
    const cartId = await AsyncStorage.getItem("cart_id");

    // Sending a request to the server to empty the cart
    axios
      .post(`${baseURL}/store/carts/${cartId}/complete`)
      .then(async (res) => {
        // Removing the cart_id from the local storage
        await AsyncStorage.removeItem("cart_id");
        // Redirecting to the home screen
        Actions.push("products");
      });
  };
  */
  const completeOrder = async payload => {
    try {
      overlayShow('completeOrder')
      cartIsFetching.value = true
      const resp = await $fetch(`/carts/${cartId}/complete`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        key: uniqueString()
      })
      console.log('resp', resp);
      localStorage.removeItem('cart_id')
      cartId = undefined
      cart.value={items:[]}
      getCart()
      return resp?.type === 'order'
      // we also get the shipping options for this address
    } catch (error) {
      console.log('error', error);      
    } finally {
      overlayHide('completeOrder')
      cartIsFetching.value = false
    }
  }

  const emailExists = async (email) => {
    const resp = await $fetch(`auth/${email}`, {
      baseURL: API_BASE_URL
    })
    return resp.exists
  }

  const addGuestCustomerToCart = async (email) => {
    // if(cart.value.customer_id){
    //   console.log('addGuestCustomerToCart: cart has a customer assigned', cart.value.customer_id);
    //   return cart.value.email
    // }
    try {
      cartIsFetching.value = true
      overlayShow('addGuestCustomerToCart')
      const resp = await $fetch(`/carts/${cartId}`, {
        key: uniqueString(),
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify({
          email
        })
      })
      setCart(resp.cart, 'addGuestCustomerToCart');
      console.log('email added to the cart, the custmer ID is %O', resp.cart.customer_id);
      return true
    } catch (error) {
      console.error('addGuestCustomerToCart, Error fetching ', error)
      return false
    } finally {
      overlayHide('addGuestCustomerToCart')
      cartIsFetching.value = false
      console.log('addGuestCustomerToCart: Guest user email added to the cart', email);
    }
  }

  const addCustomerToCart = async (customerId) => {
    if(customerId === cart.value.customer_id) return
    try {
      overlayShow('addCustomerToCart')
      cartIsFetching.value = true
      const resp = await $fetch(`/carts/${cartId}`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId
        })
      })
      setCart(resp.cart, 'addCustomerToCart');
    } catch (error) {
      console.error('addCustomerToCart Error', error)
    } finally {
      overlayHide('addCustomerToCart')
      cartIsFetching.value = false
    }
  }

  const createCart = async () => {
    if(!process.client) return
    try {
      console.log('Creating Cart');
      cartIsFetching.value = true
      const resp = await $fetch(`/carts`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify({})
      })
      console.log('Finished creating a cart');
      cartId = resp.cart.id
      localStorage.setItem('cart_id', resp.cart.id);
      setCart(resp.cart, 'createCart')
      return cart
    } catch (error) {
      console.log('createCart error', error)       
    } finally {
      cartIsFetching.value = false
    }
  }

  const updateCart = async (payload) => {
    if(!process.client) return
    try {
      console.log('Updating Cart with payload:', payload);
      cartIsFetching.value = true
      const resp = await $fetch(`/carts/${cartId}`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        body: JSON.stringify(payload)
      })
      setCart(resp.cart, 'updateCart')
      return cart
    } catch (error) {
      console.log('Update Cart error', error)       
    } finally {
      cartIsFetching.value = false
    }
  }

  const setCart = (c, from = '') => {
    // c.shipping_address && delete c.shipping_address.id
    // c.shipping_address && delete c.shipping_address.created_at
    // c.shipping_address && delete c.shipping_address.updated_at 
    // c.shipping_address && delete c.shipping_address.deleted_at 
    // c.shipping_address && delete c.shipping_address.customer_id 
    console.log('setCart diff %O, from %O', diff(cart.value, c), from);
    Object.assign(cart.value, c)
    cartFetchedCallbacks.value.forEach(callback => {
      if(typeof callback === 'function') callback(cart)
    })
  }

  const onCartFetched = callback => {
    if(typeof callback === 'function') cartFetchedCallbacks.value.push(callback)
  }

  const addItem = async (variantId, quantity) => {
    try {
      cartIsFetching.value = true
      const resp = await $fetch(`/carts/${cartId}/line-items`, {
        baseURL: API_BASE_URL,
        key: (Date.now()).toString(),
        method: 'POST',
        body: JSON.stringify({
          variant_id: variantId,
          quantity
        })
      })
      setCart(resp.cart, 'addItem')
    } catch (error) {
      console.error('addItem Error', error )
    } finally {
      cartIsFetching.value = false
    }
  }

  const removeItem = async (lineItemID) => {
    cartIsFetching.value = true
    const resp = await $fetch(`/carts/${cartId}/line-items/${lineItemID}`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'DELETE',
    })
    setCart(resp.cart, 'removeItem')
    cartIsFetching.value = false
  }

  const updateItem = async (lineItemID, quantity) => {
    cartIsFetching.value = true
    const resp = await $fetch(`/carts/${cartId}/line-items/${lineItemID}`, {
      baseURL: API_BASE_URL,
      key: (Date.now()).toString(),
      method: 'POST',
      body: JSON.stringify({
        quantity: Number(quantity)
      })
    })
    setCart(resp.cart, 'updateItem')
    cartIsFetching.value = false
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

  const createPaymentSessions = async () => {
    try {
      cartIsFetching.value = true
      const resp = await $fetch(`carts/${cartId}/payment-sessions`, {
        baseURL: API_BASE_URL,
        credentials: 'include',
        method: 'POST'
      })
      setCart(resp.cart, 'cratePaymentSessions')
      return resp?.cart
    } catch (error) {
      console.log('Error', error);
    } finally{
      cartIsFetching.value = false
    }
  }

  const getShippingOptions = async () => {
    if(!cartId) {
      console.warn('getShippingOptions, no cartId' )
      return
    }
    try {
      fetchingShippingOptions.value = true
      cartIsFetching.value = true
      const resp = await $fetch(`shipping-options/${cartId}`, {
        baseURL: API_BASE_URL,
        method: 'GET'
      })
      shippingOptions.value = resp.shipping_options
      return resp.shipping_options
    } catch (error) {
      console.log('Error', error);
    } finally{
      cartIsFetching.value = false
      fetchingShippingOptions.value = false
    }
  }

  const setShippingMethod  = async (optionId) => {
    try {
      cartIsFetching.value = true
      const resp = await $fetch(`carts/${cartId}/shipping-methods`, {
        baseURL: API_BASE_URL,
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
           option_id: optionId 
        })
      })
      setCart(resp.cart, 'setShippingMethod')
      return resp
    } catch (error) {
      console.log('Error', error);
    } finally{
      cartIsFetching.value = false
    }
  }
  
  
  
  // watcher for userState.value?.id || cart.value?.id to assign the user to the cart
  watch(()=>userState.value?.id || cart.value?.id, ()=>{
    if(cart.value.customer_id !== userState.value?.id){
      cart.value.customer_id = userState.value?.id
    }
  })

  watch(()=>cart.value?.id && region.value?.name && country.value?.iso_2, async (ok) => {
    if(ok){
      cart.value.region_id = region.value.id
      if(cart.value.shipping_address){
        cart.value.shipping_address.country_code = country.value.iso_2
      }
    }
  }, {immediate: true})
  // watcher for region, we add/update it into the cart when changed
  // we also refetch the shipping options
  // watch(()=>(region.value?.id || country.value?.iso_2 || cart.value?.id), async () => {
  //   // if cart has a value region must be assigned to it
  //   // only if it is not already assigned and it's the same
  //   console.log('XXXX region country cart', region.value?.name, country.value?.iso_2, cart.value?.id);
  //   if(region.value?.id && cart.value?.region_id !== region.value?.id){
  //     console.log('XXXXXXXXXXXXX', );
  //     cart.value.region_id = region.value.id
  //   }
  // },{immediate: true})

  // watch(()=>cart.value.id || country.value || cart.value?.shipping_address, ()=>{
  //   (console.log('cart.value.id %O, country.value %O', cart.value.id, country.value?.iso_2, cart.value?.shipping_address))
  //   if(country.value?.iso_2){
  //     if(cart.value?.shipping_address && cart.value.shipping_address.country_code !== country.value.iso_2){
  //       console.log('YYYY', );
  //     }
  //   }
  // })
  /*
    finally we load the cart using the id from localStorage
    if there is no cart in localStorage we create a cart
  */
  getCart().then(()=>{
    getShippingOptions()//.then(so=>{
    //   console.log('so', so);
    //   addShippingMethod(so[0].id).then(resp => {
    //     console.log('addShippingMethod', resp);
    //     createPaymentSessions()
    //   })
    })
    // createPaymentSessions()
  // })

  return { 
    getCart, cart, setCart, addItem, removeItem, cartItemsCount, cartForDebug, updateItem, addGuestCustomerToCart, 
    addShippingAddress, onCartFetched, cartIsFetching, cartFetchedCallbacks, shippingOptions, setShippingMethod,
    fetchingShippingOptions, createPaymentSessions, completeOrder
  }
})

