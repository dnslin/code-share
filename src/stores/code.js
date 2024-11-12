import { defineStore } from 'pinia'
import { codeService } from '../services/codeService'

export const useCodeStore = defineStore('code', {
    state: () => ({
        languages: null,
        languagesLastFetch: null,
        currentSnippet: null,
        loading: false,
        error: null
    }),

    actions: {
        async initLanguages() {
            try {
                const now = Date.now()
                if (
                    this.languages &&
                    this.languagesLastFetch &&
                    (now - this.languagesLastFetch < 3600000)
                ) {
                    return this.languages
                }

                this.loading = true
                const languages = await codeService.getLanguages()
                this.languages = languages.data
                this.languagesLastFetch = now
                return languages
            } catch (error) {
                this.error = error.message
                console.error('初始化语言列表失败:', error)
                return null
            } finally {
                this.loading = false
            }
        },

        async createSnippet(data) {
            try {
                this.loading = true
                const result = await codeService.createSnippet(data)
                this.currentSnippet = result
                return result
            } catch (error) {
                this.error = error.message
                console.error('创建代码片段失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateSnippet(id, data) {
            try {
                this.loading = true
                const result = await codeService.updateSnippet(id, data)
                this.currentSnippet = result
                return result
            } catch (error) {
                this.error = error.message
                console.error('更新代码片段失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getShareInfo(shareId) {
            try {
                this.loading = true
                return await codeService.getShareInfo(shareId)
            } catch (error) {
                this.error = error.message
                console.error('获取分享信息失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getShareContent(shareId, accessCode) {
            try {
                this.loading = true
                return await codeService.getShareContent(shareId, accessCode)
            } catch (error) {
                this.error = error.message
                console.error('获取分享内容失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async shareCode(data) {
            try {
                this.loading = true
                return await codeService.shareCode(data)
            } catch (error) {
                this.error = error.message
                console.error('创建分享链接失败:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
}) 