import { defineStore, storeToRefs } from 'pinia'
import { useRegionStore } from '~/store/region'

const API_BASE_URL = 'http://localhost:9000/'


export const useProductStore = defineStore('product-store', () => {
  const { currencyCode } = storeToRefs(useRegionStore())
  const product = ref()
  const products = ref([])
  let dontFetchProducts = false
  const pagination = reactive({
    count: 0,
    offset: 0,
    limit: 20,
    pages: 0
  })

  const changeProductByID = async (id) => {
    const {data} = await useFetch(`store/products/${id}`, { baseURL: API_BASE_URL, key: id })
    // console.log('data.value', JSON.stringify(data.value, null, 2));
    product.value = data.value.product
  }

  const fetchProducts = async () => {
    if(dontFetchProducts) return 
    dontFetchProducts = true
    const  data = await $fetch(`/store/products?limit=${pagination.limit}`, { baseURL: API_BASE_URL })
    console.log('data', data);
    pagination.count = data.count
    pagination.offset = data.offset
    pagination.limit = data.limit
    products.value.push(...data.products)
    dontFetchProducts = false
  }

  const lowestPrice = () => {
    return product.value.variants
      .reduce((prices, cur) => {
        return [...prices, ...cur.prices.filter(price => price.currency_code === currencyCode.value)]
      }, [])
      .sort((a, b) => a.amount - b.amount)[0]
  }

  const options = computed(() => {
    if (product.value.options) {
      return product.value.options.map((option) => {
        option.selected = false
        option.values = option.values.reduce((acc, curr) => {
          if (!acc.find(val => val.value === curr.value)) {
            return [...acc, { ...curr }]
          }
          return acc
        }, [])
        
        return option
      })
    }
  })

  const allOptionsSelected = computed(()=>selectedOptions.value.length === product.value.options.length)

  const selectedVariant = computed(()=>{
    if(!allOptionsSelected.value) return undefined
    return product.value.variants.find( p => {
      const equalOptions = selectedOptions.value.filter( so => {
        return p.options.find(o => o.value === so.value)
      })
      return equalOptions.length === selectedOptions.value.length
    })
  })

  const optionIsSelected = (option, value) => {
    return selectedOptions.value.find( o => o.option === option.title && o.value === value.value)
  }

  const validated = computed(()=> allOptionsSelected.value)

  const selectedOptions = computed( () => {
    return product.value.options
      .filter(o => o.selected)
      .map(o => {return {option: o.title, value: o.selected.value}})
  })

  watch(pagination, ()=>{
    if(dontFetchProducts) return
    console.log('pagination', pagination);
    fetchProducts()
  },{
    immediate: true
  })

  return { 
    products, product, changeProductByID, options, optionIsSelected, selectedOptions, selectedVariant, 
    allOptionsSelected, validated, lowestPrice, pagination
  }
})

