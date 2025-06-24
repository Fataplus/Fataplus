<template>
  <div 
    class="inline-flex items-center justify-center"
    :class="containerClass"
  >
    <svg
      class="animate-spin"
      :class="spinnerClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span v-if="label" class="ml-2 text-sm font-medium">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray' | 'green'
  label?: string
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  center: false,
})

const spinnerClass = computed(() => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const colors = {
    primary: 'text-green-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
  }

  return `${sizes[props.size]} ${colors[props.color]}`
})

const containerClass = computed(() => {
  return props.center ? 'w-full py-8' : ''
})
</script> 