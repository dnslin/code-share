<template>
    <span class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <template v-for="(key, index) in keys" :key="index">
            <kbd
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                {{ key }}
            </kbd>
            <span v-if="index < keys.length - 1">+</span>
        </template>
    </span>
</template>

<script setup>
defineProps({
    keys: {
        type: Array,
        required: true
    }
})
</script>