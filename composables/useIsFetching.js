import { storeToRefs } from 'pinia'
import {useCartStore} from '~/store/cart'
import {useCustomerStore} from '~/store/customer'
import {useProductStore} from '~/store/product'
export const useIsFetching = () => {
  const {cartIsFetching} = storeToRefs(useCartStore())
  return {cartIsFetching}
}


