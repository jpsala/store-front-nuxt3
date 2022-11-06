export const pause = (time = 1000, callback = () => {}) =>
  new Promise(success=>{
  setTimeout(() => {
    success(callback())
  }, time);
})
