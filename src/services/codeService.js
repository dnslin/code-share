import { codeApi } from '../api/code'

export const codeService = {
    async getSnippet(id) {
        try {
            return await codeApi.getSnippet(id)
        } catch (error) {
            console.error('获取代码片段失败:', error)
            throw error
        }
    },

    async createSnippet(code, language, title = '') {
        try {
            const data = {
                code,
                language,
                title
            }
            return await codeApi.createSnippet(data)
        } catch (error) {
            console.error('创建代码片段失败:', error)
            throw error
        }
    },

    async updateSnippet(id, updates) {
        try {
            return await codeApi.updateSnippet(id, updates)
        } catch (error) {
            console.error('更新代码片段失败:', error)
            throw error
        }
    },

    async getLanguages() {
        try {
            return await codeApi.getLanguages()
        } catch (error) {
            console.error('获取语言列表失败:', error)
            throw error
        }
    },

    async getSharedCode(accessCode) {
        try {
            return await codeApi.getSharedCode(accessCode)
        } catch (error) {
            console.error('获取共享代码失败:', error)
            throw error
        }
    },

    async shareCode(data) {
        try {
            return await codeApi.shareCode(data)
        } catch (error) {
            console.error('创建共享链接失败:', error)
            throw error
        }
    }
} 