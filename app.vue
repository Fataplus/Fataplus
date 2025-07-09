<template>
  <div class="min-h-screen">
    <!-- Minimal app wrapper -->
    <NuxtPage />
  </div>
</template>

<script setup>
// Basic app configuration
useHead({
  titleTemplate: "%s - Fataplus",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#16a34a" },
  ],
});
</script>

<style>
/* Variables CSS globales */
:root {
  --color-primary: #16a34a;
  --color-primary-dark: #15803d;
  --color-secondary: #f59e0b;
  --color-accent: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
}

/* Styles globaux */
html {
  font-family: "Fataplus", sans-serif;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

/* Animation transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Scrollbar personnalisé */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}
</style>
