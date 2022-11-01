import { defineStore, storeToRefs } from 'pinia'
import { useRegionStore } from '~/store/region'
import { formatPrice } from '~~/helpers/formatPrice'
import {API_BASE_URL} from '~/helpers/baseUrl'

export const useProductStore = defineStore('product-store', () => {
  const { currencyCode } = storeToRefs(useRegionStore())
  const product = ref()
  const products = ref([])

  const changeProductByID = async (id) => {
    const {data}: any = await useFetch(`products/${id}`, { baseURL: API_BASE_URL, key: id })
    // console.log('data.value', JSON.stringify(data.value, null, 2));
    product.value = data.value.product
  }

  const fetchProducts = async ({limit= 20, offset = 0} = {}) => {
    
    const fetchOptions = `?limit=${limit}&offset=${offset}`
    
    const data: any = await $fetch(`/products${fetchOptions}`, { baseURL: API_BASE_URL })
    products.value.push(...data.products.map(p => ({...p, lowest_price: getLowestPrice(p)})))
    console.log('(fetchProducts) -> Fetched %O products', products.value.length);

  }

  const getLowestPrice = (_product => {
    
    const lowestPrice = (_product.value ? _product.value.variants : _product.variants)
    .reduce((prices, cur) => {
      return [...prices, ...cur.prices.filter(price => price.currency_code === currencyCode.value)]
    }, [])
    .sort((a, b) => a.amount - b.amount)[0]
    
    return lowestPrice
  })

  const lowestPrice = computed(() => {
    return getLowestPrice(product.value)
  })

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

  const getVariantPrice = (variant, _currencyCode = currencyCode.value) => {
    return variant.prices.find(p => p.currency_code === _currencyCode)?.amount
  }

  const selectedVariantPrice = computed(()=>{
    if(selectedVariant.value){
      return getVariantPrice(selectedVariant.value)
    }
  })

  const priceToShow = computed(()=>{
    return formatPrice(selectedVariant.value ? selectedVariantPrice.value : lowestPrice.value?.amount, currencyCode.value)
  })

  const selectedVariantPriceToShow = computed(()=>{
    if(selectedVariant.value){
      console.log('detalle', selectedVariant.value);
      return formatPrice(selectedVariant.value.prices.find(p => p.currency_code === currencyCode.value).amount, currencyCode.value)
    }
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

  return { 
    products, product, changeProductByID, options, optionIsSelected, selectedOptions, selectedVariant, 
    allOptionsSelected, validated, lowestPrice, fetchProducts, getLowestPrice, selectedVariantPrice, priceToShow
  }
})

