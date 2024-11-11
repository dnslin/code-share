import api from './config'

export const codeApi = {
    // 获取代码片段
    getSnippet(id) {
        return api.get(`/snippets/${id}`)
    },

    // 创建新的代码片段
    createSnippet(data) {
        return api.post('/snippets', data)
    },

    // 更新代码片段
    updateSnippet(id, data) {
        return api.put(`/snippets/${id}`, data)
    },

    // 获取语言列表
    getLanguages() {
        return api.get('/languages')
    },

    // 获取共享代码
    getSharedCode(accessCode) {
        return api.get(`/snippets/shared/${accessCode}`)
    },

    // 创建共享链接
    shareCode(data) {
        return api.post('/snippets/share', data)
    }
} 