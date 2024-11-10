<script setup>
import { useThemeStore } from './stores/theme'
import { onMounted } from 'vue'

const themeStore = useThemeStore()

const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div
    class="h-full w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
    <nav class="bg-white dark:bg-gray-800 p-4 shadow-md">
      <div class="container mx-auto flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8 dark:filter dark:brightness-150" />
          <span class="text-xl font-bold text-gray-800 dark:text-white">代码分享</span>
        </router-link>
        <div class="flex items-center gap-4">
          <router-link to="/editor"
            class="flex items-center gap-2 px-4 py-2 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
            <img src="@/assets/edit.svg" alt="Editor" class="h-5 w-5 dark:filter dark:brightness-150" />
            <span>编辑器</span>
          </router-link>
          <button @click="toggleTheme"
            class="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
            <!-- 月亮图标（暗色模式） -->
            <svg v-if="!themeStore.isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <!-- 太阳图标（亮色模式） -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
/* 添加 logo 旋转动画 */
@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 鼠标悬停时触发动画 */
img:hover {
  animation: logo-spin 2s linear infinite;
}
</style>
