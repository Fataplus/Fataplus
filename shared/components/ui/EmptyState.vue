<template>
  <div class="text-center py-12">
    <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
      <Icon
        v-if="icon"
        :name="icon"
        class="h-full w-full"
      />
      <svg v-else class="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      {{ title }}
    </h3>
    
    <p class="text-gray-500 mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>
    
    <slot name="actions">
      <UButton
        v-if="actionLabel && actionTo"
        :to="actionTo"
        color="primary"
        size="lg"
      >
        {{ actionLabel }}
      </UButton>
      
      <UButton
        v-else-if="actionLabel && actionClick"
        @click="actionClick"
        color="primary"
        size="lg"
      >
        {{ actionLabel }}
      </UButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon?: string
  actionLabel?: string
  actionTo?: string
  actionClick?: () => void
}

defineProps<Props>()
</script> 