<script setup>
import { storeToRefs } from 'pinia';
import {useMiscStore} from '~/store/misc'

const {overlayVisible, overlayMessages} = storeToRefs(useMiscStore())

onMounted(() => document.getElementById('overlay-wrapper').classList.remove('hidden'))

</script>

<template>
  <div id="overlay-wrapper" v-show="overlayVisible" class="hidden z-[30000]">
    <!-- <div class="messages top-[18%] left-[32%] w-[400px] h-[250px] absolute text-center flex flex-col items-center place-content-end"> -->
      <!-- <div class="message text-red-700 text-green-600 text-3xl" v-for="message of overlayMessages">{{message}}</div> -->
    <!-- </div> -->
    <Spinner size="xlg" class="top-[40%] left-[44%] border-green-300 z-[20000]" />
    <div id="overlay" class="z-[30000]">
  </div>
</div>
</template>
<style>
#overlay{
  height: 100vh;
  width: 100vw;
  /* background-color: #21ec43; */
  z-index: 100000;
  position: absolute;
  top: 0;
  left: 0;
  opacity: .1;
}
</style>
