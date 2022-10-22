import { defineStore } from 'pinia'
const API_BASE_URL = 'http://localhost:9000/'


export const useProductStore = defineStore('product-store', () => {
  const product = ref()

  const changeProduct = async (id) => {
    const {data} = await useFetch(`store/products/${id}`, { baseURL: API_BASE_URL, key: id })
    product.value = data.value.product
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

  const selectVariant = (option, variant) => {
    option.selected = option.selected === variant ? undefined : variant
  }

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

  return { product, changeProduct, options, optionIsSelected, selectedOptions, selectedVariant, allOptionsSelected, selectVariant, validated }
})

