import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
    }),

    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
            this.applyTheme()
        },

        applyTheme() {
            if (this.isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            // 更新 Monaco Editor 主题
            if (window.monaco) {
                window.monaco.editor.setTheme(this.isDark ? 'vs-dark' : 'vs-light')
            }
        },

        init() {
            this.applyTheme()
            // 监听系统主题变化
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

            const handleChange = (e) => {
                if (!localStorage.getItem('theme')) {
                    this.isDark = e.matches
                    this.applyTheme()
                }
            }

            // 添加监听器
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange)
            } else {
                // 兼容旧版浏览器
                mediaQuery.addListener(handleChange)
            }
        },

        // 重置为跟随系统主题
        resetToSystem() {
            localStorage.removeItem('theme')
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            this.applyTheme()
        }
    }
}) 