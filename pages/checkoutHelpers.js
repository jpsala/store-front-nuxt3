export const changeMainPageColor = () => {

  let mainEl = undefined
  
  onMounted(() => {
    mainEl = document.querySelector('main')
    mainEl.classList.add('bg-light-700')
  })
  onUnmounted(() => {
    mainEl.classList.remove('bg-light-700')
  })

}
