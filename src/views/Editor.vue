<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <!-- 标题输入框 -->
            <div class="relative flex items-center">
                <DocumentTextIcon class="w-5 h-5 absolute left-3 text-gray-400 pointer-events-none" />
                <input v-model="title" type="text" placeholder="输入代码标题（可选）" maxlength="50"
                    class="w-64 h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200">
            </div>

            <!-- 语言选择 -->
            <div class="relative" ref="dropdown">
                <button @click="isDropdownOpen = !isDropdownOpen"
                    class="btn-base bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300">
                    <CodeBracketIcon class="w-5 h-5" />
                    <span>{{ getCurrentLanguageName() }}</span>
                    <ChevronDownIcon class="w-4 h-4 transform transition-transform"
                        :class="{ 'rotate-180': isDropdownOpen }" />
                </button>
                <!-- 语言下拉菜单 -->
                <div v-show="isDropdownOpen && storeLanguages"
                    class="absolute top-full left-0 mt-1 w-64 max-h-96 custom-scrollbar overflow-y-auto bg-white dark:bg-gray-800 rounded shadow-lg border dark:border-gray-700 z-10">
                    <div v-for="(languages, category) in storeLanguages" :key="category"
                        class="py-1 border-b last:border-b-0 dark:border-gray-700">
                        <div
                            class="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold bg-gray-50 dark:bg-gray-900">
                            {{ category }}
                        </div>
                        <button v-for="lang in languages" :key="lang.id" @click="selectLanguage(lang)"
                            class="dropdown-item" :class="{ 'active': language === lang.id }">
                            {{ lang.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 格式化按钮 -->
            <button @click="formatCode"
                class="btn-base bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-800/50 text-violet-700 dark:text-violet-300">
                <WrenchIcon class="w-5 h-5" />
                <span>格式化代码</span>
            </button>

            <!-- 保存按钮 -->
            <button @click="saveCode"
                class="btn-base bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300">
                <DocumentArrowDownIcon class="w-5 h-5" />
                <span>保存代码</span>
            </button>

            <!-- 分享按钮 -->
            <button @click="openShareSettings"
                class="btn-base bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300">
                <ShareIcon class="w-5 h-5" />
                <span>分享代码</span>
            </button>
            <button @click="copyEditLink"
                class="btn-base bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300">
                <LinkIcon class="w-5 h-5" />
                <span>编辑链接</span>
            </button>
            <!-- 返回首页按钮 -->
            <button @click="router.push('/')"
                class="btn-base bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <HomeIcon class="w-5 h-5" />
                <span>返回首页</span>
            </button>
        </div>

        <!-- 编辑器容器 -->
        <div class="flex-1 border border-gray-700 rounded relative group">
            <CodeEditor ref="editorRef" v-model="code" :language="language" @change="handleCodeChange" />
        </div>

        <!-- 分设置对话框 -->
        <TransitionFade>
            <div v-if="showShareSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-xl font-semibold mb-4">分享设置</h3>
                    <form @submit.prevent="shareCode" class="space-y-4">
                        <!-- 自定义提取码 -->
                        <div>
                            <label for="accessCode" class="block text-sm font-medium mb-2">
                                提取码（可选，不填将自动生成）
                            </label>
                            <input id="accessCode" v-model="accessCode" type="text" maxlength="6" placeholder="请输入6位提取码"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                pattern="[A-Za-z0-9]{0,6}" title="提取码应为6位字母或数字">
                        </div>
                        <!-- 过期时间设置 -->
                        <div>
                            <label for="expireTime" class="block text-sm font-medium mb-2">过期时间</label>
                            <select id="expireTime" v-model="expireTime"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1h">1小时</option>
                                <option value="1d">1天</option>
                                <option value="7d">7天</option>
                                <option value="30d">30天</option>
                                <option value="never">永不过期</option>
                            </select>
                        </div>
                        <!-- 按钮组 -->
                        <div class="flex justify-end gap-2 pt-4">
                            <button type="button" @click="showShareSettings = false"
                                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                取消
                            </button>
                            <button type="submit" :disabled="!code"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                生成链接
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TransitionFade>

        <!-- 加载状态 -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCodeStore } from '../stores/code'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import {
    CodeBracketIcon,
    DocumentTextIcon,
    ChevronDownIcon,
    WrenchIcon,
    DocumentArrowDownIcon,
    ShareIcon,
    HomeIcon,
    LinkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const codeStore = useCodeStore()
const dropdown = ref(null)

// 基本状态
const code = ref('')
const language = ref('javascript')
const title = ref('')
const currentSnippetId = ref(null)

// 界面状态
const isDropdownOpen = ref(false)
const showShareSettings = ref(false)
const isLoading = ref(false)
const accessCode = ref('')
const expireTime = ref('7d')

// 保存状态追踪 - 添加这些缺失的变量
const lastSavedCode = ref('')
const lastSavedLanguage = ref('')
const lastSavedTitle = ref('')
const snippetSerial = ref('')

// 编辑器引用
const editorRef = ref(null)

const { languages: storeLanguages } = storeToRefs(codeStore)

const toast = useToast()

// 添加格式化方法
const formatCode = () => {
    if (!code.value?.trim()) return showToast('代码内容不能为空', 'error')
    editorRef.value?.formatCode() && showToast('代码已格式化')
}
// 获取当前语言名称
const getCurrentLanguageName = () => {
    if (!language.value) return '未知语言'
    if (!codeStore.languages?.data) return language.value

    // 遍历所有分组查找当前语言
    for (const languages of Object.values(codeStore.languages.data)) {
        if (Array.isArray(languages)) { // 确保 languages 是数组
            const found = languages.find(lang => lang.id === language.value)
            if (found) return found.name
        }
    }
    return language.value
}

// 语言选择
const selectLanguage = (lang) => {
    if (lang?.id) {
        language.value = lang.id
        isDropdownOpen.value = false
    }
}

// 代码变更处理
const handleCodeChange = (newCode) => {
    code.value = newCode
}
// 保存代码
const saveCode = async () => {
    try {
        if (!code.value?.trim()) {
            showToast('代码内容不能为空', 'error')
            return null
        }

        // 检查是否需要保存
        const needsSave = !currentSnippetId.value || // 从未保存过
            code.value !== lastSavedCode.value || // 代码内容变更
            language.value !== lastSavedLanguage.value || // 语言变更
            title.value !== lastSavedTitle.value // 标题变更

        if (!needsSave) {
            // 如果代码没有变化，返回当前的状态
            return {
                id: currentSnippetId.value,
                data: snippetSerial.value
            }
        }

        // 保存码，传递序列号
        const result = await codeStore.createSnippet({
            code: code.value,
            language: language.value,
            title: title.value,
            serial: snippetSerial.value
        })
        // 更新保存状态
        currentSnippetId.value = result.id
        snippetSerial.value = result.data
        lastSavedCode.value = code.value
        lastSavedLanguage.value = language.value
        lastSavedTitle.value = title.value

        showToast('代码保存成功')
        return result
    } catch (error) {
        showToast(error.message || '保存代码失败', 'error')
        throw error
    }
}

// 分享设置
const openShareSettings = () => {
    showShareSettings.value = true
}

// 加载状态控制
const withLoading = async (fn) => {
    isLoading.value = true
    try {
        const result = await fn() // 获取并返回异步函数的结果
        return result
    } finally {
        isLoading.value = false
    }
}

// 分享代码
const shareCode = () => withLoading(async () => {
    if (!code.value?.trim()) {
        showToast('代码内容不能为空', 'error')
        return
    }

    // 先执行保存操作
    const saveResult = await saveCode()

    if (!saveResult?.data) {
        showToast('保存代码失败，无法生成分享链接', 'error')
        return
    }

    // 创建分享链接  返回错误则弹出错误信息
    const result = await codeStore.shareCode({
        snippetId: saveResult.data,
        accessCode: accessCode.value,
        expireTime: expireTime.value
    })

    // 如果返回成功，则弹出成功信息，并复制提取码到剪贴板

    if (result?.data) {
        const baseUrl = window.location.origin; // 获取当前网站的域名
        const shareLink = `${baseUrl}${result.data.shareLink}`;
        let clipboardText = `分享链接：${shareLink}`;

        if (result.data.accessCode) {
            clipboardText += `\n提取码：${result.data.accessCode}`;
        }

        await navigator.clipboard.writeText(clipboardText);
        showToast('分享链接' + (result.data.accessCode ? '和提取码' : '') + '已复制到剪贴板');
    }

    showShareSettings.value = false
    accessCode.value = ''
})

// 复制代码
const copyCode = async () => {
    try {
        await navigator.clipboard.writeText(code.value)
        showToast('代码已复制到剪贴板')
    } catch (err) {
        showToast('复制失败，请手动复制', 'error')
    }
}

// 消息提示
const showToast = (msg, type = 'success') => {
    toast[type](msg)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}
// 添加复制编辑链接方法
const copyEditLink = async () => {
    try {
        if (!snippetSerial.value) {
            showToast('请先保存代码', 'error')
            return
        }

        const baseUrl = window.location.origin
        const editLink = `${baseUrl}/editor/${snippetSerial.value}`  // 使用路径参数而不是查询参数

        await navigator.clipboard.writeText(editLink)
        showToast('永久编辑链接已复制到剪贴板')
    } catch (error) {
        showToast(error.message || '复制编辑链接失败', 'error')
    }
}
onMounted(async () => {
    console.log('Current route:', route.fullPath)  // 打印完整路由
    console.log('Query params:', route.query)
    const snippetId = route.params.id
    console.log(snippetId);
    if (snippetId) {
        try {
            isLoading.value = true
            // 获取代码内容
            const result = await codeStore.getSnippet(snippetId)

            if (result?.data) {
                // 设置编辑器内容
                code.value = result.data.code
                language.value = result.data.language
                title.value = result.data.title

                // 设置当前状态
                snippetSerial.value = snippetId

                // 更新保存状态
                lastSavedCode.value = code.value
                lastSavedLanguage.value = language.value
                lastSavedTitle.value = title.value
            }
        } catch (error) {
            showToast('加载代码失败', 'error')
        } finally {
            isLoading.value = false
        }
    }
    try {
        await codeStore.initLanguages()
    } catch (error) {
        console.error('初始化语言列表失败:', error)
    }
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.max-h-96 {
    max-height: 24rem;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #94a3b8 transparent;
}

/* Chrome, Edge, Safari */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #94a3b8;
    border-radius: 3px;
}

/* 暗色模式 */
:deep(.dark) .custom-scrollbar {
    scrollbar-color: #475569 transparent;
}

:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #475569;
}

/* 悬停效果 */
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #64748b;
}

:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #334155;
}

.btn-base {
    @apply px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200 font-medium;
}

/* 下拉菜单按钮样 */
.dropdown-item {
    @apply block w-full px-4 py-2 text-left transition-colors duration-200;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    @apply text-gray-700 dark:text-gray-200;
}

.dropdown-item.active {
    @apply bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300;
}

/* 添加输入框特定样式 */
input.btn-base {
    @apply block w-full;
    /* 确保输入框占满容器宽度 */
    @apply placeholder-gray-400 dark:placeholder-gray-500;
    /* 调整占位符颜色 */
}

/* 确保图标不会与文本重叠 */
input.btn-base:not(:placeholder-shown) {
    @apply text-gray-900 dark:text-gray-100;
    /* 输入文本的颜色 */
}
</style>