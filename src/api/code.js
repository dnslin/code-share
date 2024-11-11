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

    // 获取语言列表
    getLanguages() {
        return api.get('/snippets/languages').then(response => {
            // 确保返回 data 字段中的数据
            return response.data || {}
        })
    },

    // 获取共享代码
    getSharedCode(accessCode) {
        return api.get(`/snippets/shared/${accessCode}`)
    },

    // 创建分享链接
    shareCode(data) {
        return api.post('/snippets/share', data)
    }
} 