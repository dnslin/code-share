import { codeApi } from '../api/code'

export const codeService = {
    async getLanguages() {
        try {
            return await codeApi.getLanguages()
        } catch (error) {
            console.error('获取语言列表失败:', error)
            throw error
        }
    },

    async createSnippet(data) {
        try {
            return await codeApi.createSnippet(data)
        } catch (error) {
            console.error('创建代码片段失败:', error)
            throw error
        }
    },

    async updateSnippet(id, data) {
        try {
            return await codeApi.updateSnippet(id, data)
        } catch (error) {
            console.error('更新代码片段失败:', error)
            throw error
        }
    },

    async getSnippet(id) {
        try {
            return await codeApi.getSnippet(id)
        } catch (error) {
            console.error('获取代码片段失败:', error)
            throw error
        }
    },

    async getShareInfo(shareId) {
        try {
            return await codeApi.getShareInfo(shareId)
        } catch (error) {
            console.error('获取分享信息失败:', error)
            throw error
        }
    },

    async getShareContent(shareId, accessCode) {
        try {
            return await codeApi.getShareContent(shareId, accessCode)
        } catch (error) {
            console.error('获取分享内容失败:', error)
            throw error
        }
    },

    async shareCode(data) {
        try {
            return await codeApi.shareCode(data)
        } catch (error) {
            console.error('创建分享链接失败:', error)
            throw error
        }
    }
}