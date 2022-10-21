import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filter-store', () => {
  const filtersList = ref(['youtube', 'twitch'])
  function addFilter(filter) {
    console.log('addFilter', filter);
    filtersList.value.push(filter)
  }
  return { filtersList, addFilter }
})

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const name = ref('Eduardo')
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, name, doubleCount, increment }
// })
