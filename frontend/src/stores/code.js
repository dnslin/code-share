import { defineStore } from 'pinia'
import { API } from '../config/api'

export const useCodeStore = defineStore('code', {
    state: () => ({
        currentCode: null,
        shareId: null,
        languages: null
    }),

    actions: {
        async saveCode({ code, language, accessCode }) {
            try {
                const response = await fetch(API.code.save, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code,
                        language,
                        accessCode
                    })
                })

                if (!response.ok) {
                    throw new Error('保存失败')
                }

                const data = await response.json()
                this.shareId = data.id
                return data
            } catch (error) {
                throw new Error('保存代码失败：' + error.message)
            }
        },

        async getCode(id, accessCode) {
            try {
                const response = await fetch(API.code.get(id), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessCode
                    })
                })

                if (!response.ok) {
                    throw new Error(response.status === 403 ? '访问密码错误' : '获取代码失败')
                }

                const data = await response.json()
                this.currentCode = data
                return data
            } catch (error) {
                throw new Error('获取代码失败：' + error.message)
            }
        },

        async fetchLanguages() {
            try {
                const response = await fetch(API.languages)
                if (!response.ok) {
                    throw new Error('获取语言列表失败')
                }
                const data = await response.json()
                this.languages = data
                return data
            } catch (error) {
                throw new Error('获取语言列表失败：' + error.message)
            }
        }
    }
}) 