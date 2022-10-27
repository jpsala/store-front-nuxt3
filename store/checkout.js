import { defineStore, storeToRefs } from 'pinia';
import {useUserStore} from '~/store/user'
import validEmail from '~/helpers/validEmail'

export const useCheckoutStore = defineStore('checkout-store', () => {

  const sections = ['contact', 'address', 'delivery', 'payment']
  const userStore = useUserStore()
  const { state: userState, loggedIn: userLoggedIn } = storeToRefs(userStore)


  const state = reactive({
    sections: {},
    sectionActive: 'contact',
  })

  sections.forEach( section => {

      state.sections[section] = {
        title: section[0].toUpperCase() + section.slice(1),
        id: section,
        closed: true
      }

      const currentSection = state.sections[section]

      switch (section) {
        case 'contact':
          currentSection.closed = false
          currentSection.data = userState?.value
          break;
      
        default:
          break;
      }
  })

  watchEffect(() => {
    if(userLoggedIn.value) {
      console.log('unRef(userState)', userState.value);
      state.sections.contact.data = userState.value
    }
  })

  const next = (id) => {
    sections.forEach( s => state.sections[s].closed = true)
    if(id === 'contact') state.sections.address.closed = false
  }

  /*
    Validation
  */
  // contact validation 
  watch( ()=>state.sections.contact, (contactSection) => {
    if(!contactSection) return 
    contactSection.valid = validEmail(contactSection?.data?.email)
  }, {deep: true} )
  
  return { ...toRefs(state), next}
})
