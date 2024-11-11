import { codeApi } from '../api/code'

export const codeService = {
    // 获取代码片段
    async getSnippet(id) {
        try {
            return await codeApi.getSnippet(id)
        } catch (error) {
            console.error('获取代码片段失败:', error)
            throw error
        }
    },

    // 创建代码片段
    async createSnippet(data) {
        try {
            return await codeApi.createSnippet(data)
        } catch (error) {
            console.error('创建代码片段失败:', error)
            throw error
        }
    },

    // 更新代码片段
    async updateSnippet(id, data) {
        try {
            return await codeApi.updateSnippet(id, data)
        } catch (error) {
            console.error('更新代码片段失败:', error)
            throw error
        }
    },

    // 获取语言列表
    async getLanguages() {
        try {
            return await codeApi.getLanguages()
        } catch (error) {
            console.error('获取语言列表失败:', error)
            throw error
        }
    },

    // 获取共享代码
    async getSharedCode(accessCode) {
        try {
            return await codeApi.getSharedCode(accessCode)
        } catch (error) {
            console.error('获取共享代码失败:', error)
            throw error
        }
    },

    // 创建分享链接
    async shareCode(data) {
        try {
            return await codeApi.shareCode(data)
        } catch (error) {
            console.error('创建分享链接失败:', error)
            throw error
        }
    }
}