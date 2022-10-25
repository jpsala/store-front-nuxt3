<script setup lang="ts">
  const props = defineProps({
    quantity: {
      type: Number,
      default: 1
    }
  })
  const emit = defineEmits(["change", "increment", "decrement"])
  const emitChange = (quantity: string) => {
    if(Number(quantity) !== props.quantity) emit('change', quantity)
  }
</script>

<template>
  <div class="flex items-center rounded-md px-4 py-2 shadow">
    <button @click="$emit('decrement', quantity  > 1 ? quantity - 1: quantity)">
      –
    </button>
    <input 
        class="w-8 text-center" :value="quantity"
        @keydown.enter="($event.target as any).blur()"
        @blur="emitChange(($event.target as any).value)"
    />
    <button @click="$emit('increment', quantity + 1)">
      +
      <slot/>
    </button>
  </div>
</template>
