import api from './config'

export const codeApi = {
    // 获取语言列表
    getLanguages() {
        return api.get('/languages')
    },

    // 创建代码片段
    createSnippet(data) {
        return api.post('/snippets', data)
    },

    // 更新代码片段
    updateSnippet(id, data) {
        return api.put(`/snippets/${id}`, data)
    },

    // 获取代码片段
    getSnippet(id) {
        return api.get(`/snippets/${id}/edit`)
    },

    // 获取分享信息
    getShareInfo(shareId) {
        return api.get(`/snippets/share/${shareId}/info`)
    },

    // 获取分享内容
    getShareContent(shareId, accessCode) {
        return api.post(`/snippets/share/${shareId}/content`, { accessCode })
    },

    // 创建分享链接
    shareCode(data) {
        return api.post('/snippets/share', data)
    }
} 