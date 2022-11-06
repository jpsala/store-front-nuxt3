import { storeToRefs } from 'pinia'
import {useMiscStore} from '~/store/misc'
import { uniqueString } from '~~/helpers/uniqueString'
export const useOverlay = () => {
  const callers = useState('callers', ()=>[])
  const {overlayVisible, overlayMessages} = storeToRefs(useMiscStore())

  const show = (id, message) => {
    const msgExists = callers.value.find(c => {
      return c.id === id
    })
    if(!msgExists) callers.value.push({id, message})
  }

  const hide = (id) => {
    const msgToHideIndex = callers.value.findIndex(c => c.id === id)
    callers.value.splice(msgToHideIndex, 1)
  }

  watch(callers, ()=> {
    overlayVisible.value = (callers.value.length > 0)
    overlayMessages.value = callers.value.filter(caller => caller.message).map(m=>m.message)
  }, {deep: true})
  return {overlayShow:show, overlayHide:hide, overlayMessages}
}


