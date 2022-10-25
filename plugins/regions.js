export default defineNuxtPlugin((nuxtApp) => {
  const stores = nuxtApp.$pinia.state
  if(stores.value['region-store']){
    console.log('regions plugin store', stores.value['region-store'].value);
    // console.log('region-store', stores.value['region-store'].initializeRegions(), stores.value);
  }
  // context.store.dispatch('initializeRegions', context)
})

