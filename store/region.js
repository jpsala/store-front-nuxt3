import { defineStore } from "pinia";
import {API_BASE_URL} from '~/helpers/baseUrl'
const REGION = 'medusa_region'
const COUNTRY = 'medusa_country'

export const useRegionStore = defineStore('region-store', ()=>{
  const country = ref()
  const region = ref()
  const regions = ref([])
  const currencyCode = ref()
  
  watch(region, ()=>{setTimeout(() => {currencyCode.value = region.value?.currency_code}, 1)})


  const updateRegion = (_region, _country) => {
    region.value = _region
    country.value = _country || _region.countries[0]
    localStorage.setItem(REGION, JSON.stringify(region.value))
    localStorage.setItem(COUNTRY, JSON.stringify(country.value))
  }

  const setRegions = (_regions) => {
    
    regions.value = _regions
  }

  const initializeRegions = async () => {
    const {data} = await useFetch('store/regions', {baseURL: API_BASE_URL} )

    setRegions(data.value.regions)
    
    if (process.client && localStorage) {
      const regionJSON = localStorage.getItem(REGION)
      const countryJSON = localStorage.getItem(COUNTRY)

      if (regionJSON && countryJSON) {
        const _region = JSON.parse(regionJSON)
        const _country = JSON.parse(countryJSON)
        updateRegion(_region,_country)
      } else {
        updateRegion( regions.value[0] )
      }
    }
  }
  
  initializeRegions()

  return {setRegions, initializeRegions, country, region, regions, updateRegion, currencyCode }
})

