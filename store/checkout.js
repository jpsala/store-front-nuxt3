import { defineStore, storeToRefs } from 'pinia';
import {usecustomerStore} from '~/store/customer'
import {useCartStore} from '~/store/cart'
import validEmail from '~/helpers/validEmail'

export const useCheckoutStore = defineStore('checkout-store', () => {

  const sections = ['contact', 'address', 'delivery', 'payment']
  const customerStore = usecustomerStore()
  const cartStore = useCartStore()
  const { state: userState, loggedIn: userLoggedIn, loggingIn: userLoggingIn} = storeToRefs(customerStore)
  const { loading: cartIsLoading } = storeToRefs(cartStore)
  const { addGuestCustomerToCart } = cartStore


  const state = reactive({
    sections: {},
    activeSection: undefined
  })

  // here we set the initial values for the different sections
  sections.forEach( section => {

      state.sections[section] = {
        title: section[0].toUpperCase() + section.slice(1),
        id: section,
        closed: true
      }

      state.activeSection = state.sections[section]

      // here we set the specific data for each section
      switch (section) {
        case 'contact':
          state.activeSection.closed = false
          state.activeSection.data = {}
          break;
      case 'address':
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
      
        default:
          break;
      }
  })

  // this is the first section for the checkout process
  state.activeSection = state.sections.contact

  // Watching userLoggedIn to set state.sections.contact.data once the user is logged-in 
  watch(userLoggedIn, () => state.sections.contact.data = userState.value)

  // to manage the close and opening of the diferent sections
  const next = (id) => {
    // first we set all sections.closed to true
    
    sections.forEach( s => state.sections[s].closed = true)
    // then we open the new active section
    if(id === 'contact') state.activeSection = state.sections['address']
    state.activeSection.closed = false
  }

  /*
    Validation
  */
  // Watching state.sections.contact.data.email for contact validation, here we set contactSection.valid accordingly
  // Also email is added to the cart if there is no logged-in user
  watch( ()=>state.sections.contact.data.email, (email) => {

    console.log('Validation watcher email %O, user is logging-in %O', email, userLoggingIn.value);
    if(userLoggingIn.value) return // Do nothing if logging-in

    const isValid = validEmail(email)
    console.log('Validating sections.contact.email', email, isValid ? 'valid':'invalid', email);
    if(isValid && !cartIsLoading.value) addGuestCustomerToCart(email)
    state.sections.contact.valid = isValid

  } )
  
  return { ...toRefs(state), next}
})
