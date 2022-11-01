import { defineStore, storeToRefs } from 'pinia';
import {useCustomerStore} from '~/store/customer'
import {useCartStore} from '~/store/cart'
import validEmail from '~/helpers/validEmail'
import formatForLog from '~~/helpers/formatForLog';

export const useCheckoutStore = defineStore('checkout-store', () => {

  const sections = ['contact', 'address', 'delivery', 'payment']
  const customerStore = useCustomerStore()
  const cartStore = useCartStore()
  const { state: userState, loggedIn: userLoggedIn, loggingIn: userLoggingIn} = storeToRefs(customerStore)
  const { loading: cartIsLoading } = storeToRefs(cartStore)
  const { addGuestCustomerToCart, addShippingAddress, onCartFetched } = cartStore


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
          phone: undefined
        }
        state.activeSection.title = "Shipping Address"
        state.activeSection.data = {
          company: '',
          first_name: '',
          last_name: '',
          address_1: '',
          address_2: '',
          city: '',
          country_code: '',
          province: '',
          postal_code: '',
          phone: ''
        }
        break;
      case 'delivery':
        state.activeSection.title = "Delivery"
        state.activeSection.data = {
          
        }
        break;
      default:
        break;
      }
  })

  // this is the first section for the checkout process
  state.activeSection = state.sections.contact
  state.activeSection.closed = false

  // Watching userLoggedIn to set state.sections.contact.data once the user is logged-in 
  watch(userLoggedIn, () => {
    state.sections.contact.data = userState.value
  })

  const closeValidSectionsAndOpenInvalidOnces = () =>{
    sections.forEach( s => state.sections[s].valid ? (state.sections[s].closed = true) : (state.sections[s].closed = false))
  }

  const openInvalidSection = () => {
    const firstInvalidSectionID = sections.find( s => !state.sections[s].valid)
    const firstInvalidSection =  firstInvalidSectionID ? state.sections[firstInvalidSectionID] : undefined
    console.log('firstInvalidSection', firstInvalidSection.title);
    closeValidSectionsAndOpenInvalidOnces()

    if(firstInvalidSection){
      firstInvalidSection.closed = false
      return true
    }
    return false

  }

  /*
   for now it's used inside the CheckoutSection component
   it closes all sections and open this one
  */
  const openSection = id => {
    closeValidSectionsAndOpenInvalidOnces()
    state.sections[id].closed = false
  }

  // to manage the close and opening of the diferent sections
  const next = async (id) => {
    if(id === 'contact' && state.sections.contact.valid) {
      await addGuestCustomerToCart(state.sections.contact.data.email)
    } else if(id === 'address' && state.sections.address.valid) {
      const savedOK = await addShippingAddress(state.sections.address.data)
      if(!savedOK) {
        alert('Error saving whipping address')
        return
      }
    }
    
    openInvalidSection()

  }

  // when a cart is fetched we update the corresponding sections
  onCartFetched(cart=>{
    console.log('onCartFetched', cart.id);
    console.log('cart.shipping_address', cart.shipping_address);
    state.sections.address.data = cart.shipping_address || {}
    state.sections.contact.data.email = cart.email || ''
    setTimeout(() => {
      openInvalidSection()
    }, 100);
  })

  /*
    Validation
  */

  /*
    Watching state.sections.contact.data.email for contact validation
  */
//  let triggeredProp = undefined
//   watch( [
//     () => ({...state.sections.address.data}),
//     () => (state.sections.contact.data.email),
//   ], ([addressData, email], [oldAddressData, oldEmail])=>{
//     console.log('addressData', addressData[triggeredProp], oldAddressData[triggeredProp] );
//     console.log('email', email, oldEmail );
//     if(triggeredProp === 'email' && (email !== oldEmail)) console.log('xxemail', email);
//   }, {
//     deep: true, 
//     onTrigger(e){
//       console.log('watch triggered key = ', e.key);
//       triggeredProp = e.key
//     }
//   })
  
  watch( () => state.sections.contact.data.email, (email) => {
    if(userLoggingIn.value) return // Do nothing if logging-in

    state.sections.contact.valid = validEmail(email)
  } )

  /*
    Watching state.sections.address.data for address validation
  */
  watch(()=>state.sections.address.data, (data) => {
    if(userLoggingIn.value) return // Do nothing if logging-in
    const section = state.sections.address

    // clear all the errors
    for (const err in section.errors) section.errors[err] = undefined

    section.valid = true

    if(!data.first_name) section.errors.company = 'First Name can not be empty'
    if(!data.last_name) section.errors.company = 'Last Name can not be empty'
    if(!data.address_1) section.errors.company = 'Address can not be empty'
    if(!data.city) section.errors.company = 'City can not be empty'
    if(!data.phone) section.errors.company = 'Phone can not be empty'

    section.valid = data.first_name && data.last_name &&  data.address_1 && data.city && data.phone

  }, {deep: true})
  
  return { ...toRefs(state), next, openSection}
})
