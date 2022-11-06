import { defineStore } from "pinia"

export const useMiscStore = defineStore('misc-store', () => {
  const overlayVisible = ref(false)
  const overlayMessages = ref([])
  return {overlayVisible, overlayMessages}
})
