import { defineStore, storeToRefs } from 'pinia';
import {useCustomerStore} from '~/store/customer'
import {useCartStore} from '~/store/cart'
import validEmail from '~/helpers/validEmail'
import { useRegionStore } from './region';
import {usePaymentStore} from '~/store/payment'

export const useCheckoutStore = defineStore('checkout-store', () => {
  const {push: gotoRoute} = useRouter()

  const {country, region} = storeToRefs(useRegionStore())
  const sections = ['contact', 'address', 'shipping', 'payment']

  const customerStore = useCustomerStore()
  const { state: userState, loggedIn: userLoggedIn, loggingIn: userLoggingIn} = storeToRefs(customerStore)

  const cartStore = useCartStore()
  const { getCart, addGuestCustomerToCart, addShippingAddress, setShippingMethod, createPaymentSessions } = cartStore
  const { cart, shippingOptions, fetchingShippingOptions} = storeToRefs(cartStore)
  const paymentStore = usePaymentStore()
  const {executePayment} = paymentStore
  const {ready} = storeToRefs(paymentStore)

  // store state
  const state = reactive({
    sections: {},
    activeSection: undefined
  })

  // here we set the initial values for the different sections
  sections.forEach( section => {

      state.sections[section] = {
        id: section,
        closed: true
      }
  
      state.activeSection = state.sections[section]
  
      // here we set the specific data for each section
      switch (section) {
        case 'contact':
          state.activeSection.errors = {
            email: ''
          }
          state.activeSection.title = 'Contact'
          state.activeSection.data = {}
          break;
        case 'address':
          state.activeSection.errors = {
          company: undefined,
          first_name: undefined,
          last_name: undefined,
          address_1: undefined,
          address_2: undefined,
          city: undefined,
          country_code: undefined,
          province: undefined,
          postal_code: undefined,
          phone: undefined,
        }
        state.activeSection.title = "Shipping Address"
        state.activeSection.data = {
          company: '',
          first_name: '',
          last_name: '',
          address_1: '',
          address_2: '',
          city: '',
          province: '',
          postal_code: '',
          phone: '',
          country_code: country.value?.iso_2,
        }
        break;
      case 'shipping':
        state.activeSection.title = "Shipping Options"
        state.activeSection.fetching = false
        state.activeSection.data = {
          
        }
        break;
      case 'payment':
        state.activeSection.title = "Payment"
        state.activeSection.fetching = false
        state.activeSection.data = {
        }
        break;
      default:
        break;
      }
  })

  /* 
    openSection()
    it closes all sections and open the required one
  */
  const openSection = id => {
    closeValidSectionsAndOpenInvalidOnces()
    state.sections[id].closed = false
  }

  // next, to manage the close and opening of the diferent sections
  const next = async (id) => {
    if(id === 'contact' && state.sections.contact.valid) {
      contactNext(id)
    } else if(id === 'address' && state.sections.address.valid) {
      addressNext(state.sections.address.data)
    } else if(id === 'shipping' && state.sections.shipping.valid) {
      shippingNext(state.sections.shipping)
    } else if(id === 'payment' && state.sections.payment.valid) {
      console.log('paymentNext', 1);
      paymentNext()
    }
  }
  
  const paymentNext = async () => {
    console.log('paymentNext', 2);
    const ok = await executePayment()
    if(ok) {
      alert('order has been placed')
      gotoRoute('/').then(()=>location.reload())
    }
  }

  const contactNext = async () => {
    const resp = await addGuestCustomerToCart(state.sections.contact.data.email)
      if(typeof resp === 'string') {
        state.sections.contact.errors.email = 'Email already assigned to the cart'
        state.sections.contact.data.email = resp
        return
      }
      state.sections.contact.closed = true
      state.sections.address.closed = false
  }

  const addressNext = async (data) => {
    const savedOK = await addShippingAddress(data)
    if(!savedOK) return
    state.sections.address.closed = true
    state.sections.shipping.closed = false
  }

  const shippingNext = async (data) => {
    saveShippingOptionToTheCart()
    createPaymentSessions().then((resp)=>{
      console.log('resp', resp)
      if(resp?.payment_session?.id){
        closeValidSectionsAndOpenInvalidOnces()
        // state.sections.shipping.closed = true
        state.sections.payment.closed = false
      }
    })
  }


  // contact
  const setContact = (email) => {
    if(email) state.sections.contact.data.email = email
  }

  // Shipping
  const saveShippingOptionToTheCart = async () => {
    const selectedShippingOption = state.sections.shipping.data.find(o => o.selected)
    await setShippingMethod(selectedShippingOption.id)
  }
  
  const setShippingAddress = (shippingAddress) => {
    if(shippingAddress) state.sections.address.data = shippingAddress || {}
  }

  const setShippingOptions = (data) => {
    state.sections.shipping.data = data
  }

  const selectShippingOptionFromUI = id => {
    shippingOptions.value.forEach( o => o.selected = false)
    const option = shippingOptions.value.find( o => o.id === id)
    option.selected = true
  }

  const getSelectedShippingOptionFromCart = ()  => {
    if(!state.sections.shipping.data?.length) return
    if(!cart.value.shipping_methods?.length) return
    const cartShippingOptionId = cart.value.shipping_methods[0]?.shipping_option_id
    const option = state.sections.shipping.data.find(o => o.id === cartShippingOptionId)
    option.selected = true
  }

  // shipping end

  /*
    Validation
  */
    const closeValidSectionsAndOpenInvalidOnces = () =>{
      // if(!state.sections.contact.valid){
      //   state.sections.address.closed = false
      //   state.sections.shipping.closed = false
      //   state.sections.payment.closed = false
      // }else if(!state.sections.address.valid){
      //   state.sections.shipping.closed = false
      //   state.sections.payment.closed = false
      // }else if(!state.sections.shipping.valid){
      //   state.sections.payment.closed = false
      // }
      sections.forEach( s => state.sections[s].valid ? (state.sections[s].closed = true) : (state.sections[s].closed = false))
      const allValid = sections.forEach( s => state.sections[s].valid)
      if(allValid) sections.payment.closed = false
    }
  
    const getFirstInvalidSection = () => {
      const firstInvalidSectionID = sections.find( s => !state.sections[s].valid)
      const firstInvalidSection =  firstInvalidSectionID ? state.sections[firstInvalidSectionID] : undefined
      return firstInvalidSection
    }

  // contact
  const validateEmail = (email) => {
    console.log('validateEmail');
    if(userLoggingIn.value) return // Do nothing if logging-in
    const emailIsValid = validEmail(email)
    state.sections.contact.valid = emailIsValid
  }

  // address
  const validateAddress = (data) => {
    console.log('validateAddress');
    // if(userLoggingIn.value || !data) return // Do nothing if logging-in
    const section = state.sections.address

    // clear all the errors
    for (const err in section.errors) section.errors[err] = undefined

    section.valid = true
    if(!data.first_name) section.errors.first_name = 'First Name can not be empty'
    if(!data.first_name?.length < 10) section.errors.first_name = 'First Name has to be at least 10 characters'
    if(!data.last_name) section.errors.last_name = 'Last Name can not be empty'
    if(!data.address_1) section.errors.address_1 = 'Address can not be empty'
    if(!data.city) section.errors.city = 'City can not be empty'
    if(!data.phone) section.errors.phone = 'Phone can not be empty'
    if(!data.country_code) section.errors.country_code = 'Country code can not be empty'
    section.valid = data.first_name && data.last_name &&  data.address_1 && data.city
  }

  // shipping options
  const validateShippingOptions = () => {
    console.log('validateShippingOptions', );
    if(!state.sections.shipping.data?.length) return
    state.sections.shipping.valid = state.sections.shipping.data.find(o => o.selected) !== undefined
    closeValidSectionsAndOpenInvalidOnces()
    if(state.sections.shipping.valid) state.sections.payment.closed = false
  }
  
  /*
    Watchers
  */

  const validSectionsCount = computed(()=>{
    return Object.values(state.sections).reduce((acc, s)=>{
      return Boolean(s.valid) ? acc + 1 : acc
    },0)
  })

  // Watch shippingOptions and set state.sections.shipping.data
  watch(shippingOptions, (options) => {
    console.log('watch shippingOptions', );
    setShippingOptions(options)
    getSelectedShippingOptionFromCart()
    validateShippingOptions()
  }, {immediate: true})

  // watch if the shippment options are been fetched so we can keep the user updated
  watch(fetchingShippingOptions, fetching => state.sections.shipping.fetching = fetching)

  // Watching userLoggedIn to set state.sections.contact.data once the user is logged-in 
  watch(userLoggedIn, () => {
    state.sections.contact.data = userState.value?.email
  })

  // watch country, when changed, we assign it to the address section
  watch(()=>country.value?.iso_2 || cart.value?.id, ()=>{
    if(!country.value?.iso_2) return
    console.log('country watch, country %O, cart.id %O ', country.value?.name, cart.value?.id);
    state.sections.address.data.country_code = country.value?.iso_2
  }, {immediate: true})

  // Watch Contact to call the validation method
  watch(() => state.sections.contact.data.email, validateEmail,{immediate: true})
  
  // Watch Address to call the validation method
  watch(()=>state.sections.address.data, validateAddress, {immediate: true, deep: true})
  
  // Watch Shipping to call the validation method
  watch(()=>state.sections.shipping.data, validateShippingOptions, {deep: true})

  watch(ready,() => state.sections.payment.valid = ready?.value, {immediate: true})

  // get the cart and set things up
  const init = () => {
    getCart().then(cart=>{
      if(!process.client) return
      if(!cart?.value) {
        console.warn('checkout getCart, !cart.value cart:', cart)
        return
      }
      setShippingAddress(cart.value.shipping_address)
      setContact(cart.value.email)
      // cart.value.shipping_address && validateAddress(cart.value.shipping_address)
      // validateEmail(cart.value.email)
      nextTick(()=>{
        // Object.entries(state.sections).forEach(s=>s.closed = true)
        // console.log('validSectionsCount.value===4', validSectionsCount.value);
        // if(validSectionsCount.value===4) state.sections.payment.closed = false
        state.sections.contact.closed = false
      })
    })
  }

  // this is the first section for the checkout process
  // state.activeSection = userLoggedIn.value ? state.sections.address : state.sections.contact
  // state.activeSection.closed = false

  return { ...toRefs(state), next, openSection, selectShippingOptionFromUI, initCheckout: init}
})
