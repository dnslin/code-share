import { codeApi } from '../api/code'

export const codeService = {
    async getLanguages() {
        try {
            return await codeApi.getLanguages()
        } catch (error) {
            throw error.response?.data?.message || '获取语言列表失败'
        }
    },

    async createSnippet(data) {
        try {
            return await codeApi.createSnippet(data)
        } catch (error) {
            throw error.response?.data?.message || '创建代码片段失败'
        }
    },

    async updateSnippet(id, data) {
        try {
            return await codeApi.updateSnippet(id, data)
        } catch (error) {
            throw error.response?.data?.message || '更新代码片段失败'
        }
    },

    async getSnippet(id) {
        try {
            return await codeApi.getSnippet(id)
        } catch (error) {
            throw error.response?.data?.message || '获取代码片段失败'
        }
    },

    async getShareInfo(shareId) {
        try {
            return await codeApi.getShareInfo(shareId)
        } catch (error) {
            throw error.response?.data?.message || '获取分享信息失败'
        }
    },

    async getShareContent(shareId, accessCode) {
        try {
            return await codeApi.getShareContent(shareId, accessCode)
        } catch (error) {
            throw error.response?.data?.message || '获取分享内容失败'
        }
    },

    async shareCode(data) {
        try {
            return await codeApi.shareCode(data)
        } catch (error) {
            throw error.response?.data?.message || '创建分享链接失败'
        }
    }
}