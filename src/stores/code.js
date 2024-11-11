import { defineStore } from 'pinia'
import { codeService } from '../services/codeService'

export const useCodeStore = defineStore('code', {
    state: () => ({
        currentSnippet: null,
        languages: [],
        loading: false,
        error: null,
        languagesLastFetch: null
    }),

    actions: {
        async fetchSnippet(id) {
            this.loading = true
            try {
                this.currentSnippet = await codeService.getSnippet(id)
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async createSnippet({ id, code, language, title, serial }) {
            try {
                const data = {
                    code,
                    language,
                    serial,
                    ...(title ? { title } : {})
                }

                let result
                if (id) {
                    // 更新已有代码片段
                    result = await codeService.updateSnippet(id, data)
                } else {
                    // 创建新的代码片段
                    result = await codeService.createSnippet(data)
                }

                // 确保返回正确的结构
                return {
                    id: id || result.id,
                    data: result.data
                }
            } catch (error) {
                console.error('保存代码片段失败:', error)
                throw error
            }
        },

        async fetchLanguages() {
            console.log('Store: 开始获取语言列表')
            const now = Date.now()
            if (
                this.languages &&
                Object.keys(this.languages).length > 0 &&
                this.languagesLastFetch &&
                (now - this.languagesLastFetch < 3600000)
            ) {
                console.log('Store: 使用缓存的语言列表')
                return this.languages
            }

            try {
                console.log('Store: 请求后端语言列表')
                const response = await codeService.getLanguages()
                console.log('Store: 获取到语言列表', response)

                this.languages = response
                this.languagesLastFetch = now

                localStorage.setItem('codeLanguages', JSON.stringify({
                    languages: response,
                    timestamp: now
                }))

                return response
            } catch (error) {
                console.error('Store: 获取语言列表失败', error)
                const cached = localStorage.getItem('codeLanguages')
                if (cached) {
                    const { languages } = JSON.parse(cached)
                    this.languages = languages
                    return languages
                }
                throw error
            }
        },

        initLanguages() {
            const cached = localStorage.getItem('codeLanguages')
            if (cached) {
                const { languages, timestamp } = JSON.parse(cached)
                const now = Date.now()
                if (now - timestamp < 3600000) {
                    this.languages = languages
                    this.languagesLastFetch = timestamp
                    return
                }
            }
            this.fetchLanguages()
        },

        async getSharedCode(accessCode) {
            this.loading = true
            try {
                return await codeService.getSharedCode(accessCode)
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async shareCode({ snippetId, accessCode, expireTime }) {
            try {
                return await codeService.shareCode({
                    snippetId,
                    accessCode,
                    expireTime
                })
            } catch (error) {
                console.error('创建分享链接失败:', error)
                throw error
            }
        }
    }
}) 