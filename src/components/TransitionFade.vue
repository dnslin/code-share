<template>
    <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <slot></slot>
    </Transition>
</template>

<script setup>
// 使用 Vue 内置的 Transition 组件
</script>