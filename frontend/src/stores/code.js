import { defineStore } from 'pinia'
import * as prettier from 'prettier'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'
import html from 'prettier/plugins/html'
import postcss from 'prettier/plugins/postcss'
import typescript from 'prettier/plugins/typescript'
import yaml from 'prettier/plugins/yaml'

export const useCodeStore = defineStore('code', {
    state: () => ({
        code: '',
        language: 'javascript',
        formattedCode: '',
        sharedCodes: new Map(),
        expirationTime: null,
        viewCount: 0,
    }),

    actions: {
        async formatCode() {
            try {
                if (!this.code.trim()) {
                    return this.code
                }

                const { parser, plugins } = this.getParserAndPlugins()
                const options = {
                    parser,
                    plugins,
                    semi: true,
                    singleQuote: true,
                    tabWidth: 2,
                    printWidth: 100,
                    trailingComma: 'es5'
                }

                this.formattedCode = await prettier.format(this.code, options)
                return this.formattedCode
            } catch (error) {
                console.error('格式化代码失败:', error)
                return this.code
            }
        },

        getParserAndPlugins() {
            switch (this.language) {
                case 'javascript':
                    return {
                        parser: 'babel',
                        plugins: [babel, estree]
                    }
                case 'typescript':
                    return {
                        parser: 'typescript',
                        plugins: [typescript, estree]
                    }
                case 'html':
                case 'xml':
                    return {
                        parser: 'html',
                        plugins: [html]
                    }
                case 'css':
                case 'scss':
                case 'less':
                    return {
                        parser: 'css',
                        plugins: [postcss]
                    }
                case 'json':
                    return {
                        parser: 'json',
                        plugins: [estree]
                    }
                case 'yaml':
                    return {
                        parser: 'yaml',
                        plugins: [yaml]
                    }
                case 'markdown':
                    return {
                        parser: 'markdown',
                        plugins: [html]
                    }
                case 'python':
                case 'java':
                case 'csharp':
                case 'cpp':
                case 'go':
                case 'rust':
                case 'php':
                case 'ini':
                case 'toml':
                case 'dockerfile':
                case 'shell':
                case 'powershell':
                case 'batch':
                    throw new Error(`暂不支持 ${this.language} 语言的格式化`)
                default:
                    throw new Error('不支持的语言类型')
            }
        },

        setCode(newCode) {
            this.code = newCode
        },

        setLanguage(newLanguage) {
            this.language = newLanguage
        },

        generateAccessCode(length = 6) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            let result = ''
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            return result
        },

        shareCode(code, language, password = '', expireHours = 24) {
            const accessCode = this.generateAccessCode()
            this.sharedCodes.set(accessCode, {
                code,
                language,
                password,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + expireHours * 60 * 60 * 1000).toISOString(),
                viewCount: 0,
                maxViews: 100
            })
            return accessCode
        },

        getSharedCode(accessCode, password = '') {
            const sharedCode = this.sharedCodes.get(accessCode)
            if (!sharedCode) {
                throw new Error('提取码无效')
            }

            if (new Date(sharedCode.expiresAt) < new Date()) {
                this.sharedCodes.delete(accessCode)
                throw new Error('分享链接已过期')
            }

            if (sharedCode.viewCount >= sharedCode.maxViews) {
                throw new Error('查看次数已达上限')
            }

            if (sharedCode.password && sharedCode.password !== password) {
                throw new Error('密码错误')
            }

            sharedCode.viewCount++
            this.sharedCodes.set(accessCode, sharedCode)

            return sharedCode
        },

        cleanExpiredCodes() {
            const now = new Date()
            for (const [key, value] of this.sharedCodes.entries()) {
                if (new Date(value.expiresAt) < now) {
                    this.sharedCodes.delete(key)
                }
            }
        }
    }
}) 