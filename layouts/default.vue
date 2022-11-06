<script setup>
</script>
<template>

    <div class="min-h-screen flex flex-col">
      <app-navbar />
      <pre></pre>
      <Overlay />

      <main class="flex-1">
        <NuxtPage />
      </main>

      <app-footer />
    </div>

</template>

