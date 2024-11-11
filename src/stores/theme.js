import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: window.matchMedia('(prefers-color-scheme: dark)').matches
    }),

    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            // 更新 document 的 class
            if (this.isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },

        // 初始化主题
        initTheme() {
            // 检查系统主题偏好
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            this.isDark = darkModeMediaQuery.matches

            // 监听系统主题变化
            darkModeMediaQuery.addEventListener('change', (e) => {
                this.isDark = e.matches
            })

            // 应用初始主题
            if (this.isDark) {
                document.documentElement.classList.add('dark')
            }
        }
    }
}) 