<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <!-- 标题输入框 -->
            <input v-model="title" type="text" placeholder="输入代码标题（可选）" maxlength="50"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">

            <!-- 语言选择 -->
            <div class="relative" ref="dropdown">
                <button @click="isDropdownOpen = !isDropdownOpen"
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>{{ getCurrentLanguageName() }}</span>
                    <span class="transform transition-transform" :class="{ 'rotate-180': isDropdownOpen }">
                        ▼
                    </span>
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
                            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            :class="{ 'bg-blue-50 dark:bg-blue-900/20': language === lang.id }">
                            {{ lang.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 保存按钮 -->
            <button @click="saveCode"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                <span>保存代码</span>
            </button>

            <!-- 分享设置按钮 -->
            <button @click="openShareSettings"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
                <span>分享设置</span>
            </button>

            <!-- 复制按钮 -->
            <button @click="copyCode"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
                <span>复制代码</span>
            </button>

            <!-- 添加格式化按钮 -->
            <button @click="formatCode"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
                <span>格式化代码</span>
            </button>

            <!-- 返回首页按钮 -->
            <button @click="router.push('/')"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                返回首页
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCodeStore } from '../stores/code'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'
import { storeToRefs } from 'pinia'

const router = useRouter()
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

// 添加格式化方法
const formatCode = () => {
    editorRef.value?.formatCode()
}

// 获取当前语言名称
const getCurrentLanguageName = () => {
    if (!language.value) return '选择语言'
    if (!storeLanguages.value) return language.value

    // 直接遍历 storeLanguages.value 的所有分组
    for (const languages of Object.values(storeLanguages.value)) {
        const found = languages.find(lang => lang.id === language.value)
        if (found) return found.name
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
const saveCode = () => withLoading(async () => {
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

        // 保存代码，传递序列号
        const result = await codeStore.createSnippet({
            id: currentSnippetId.value,
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
        showToast(error.message || '保存失败', 'error')
        throw error
    }
})

// 分享设置
const openShareSettings = () => {
    showShareSettings.value = true
}

// 分享代码
const shareCode = () => withLoading(async () => {
    try {
        if (!code.value?.trim()) {
            showToast('代码内容不能为空', 'error')
            return
        }

        // 先执行保存操作
        const saveResult = await saveCode()

        // 如果保存失败或没有返回 id，则终止分享
        if (!saveResult?.id) {
            showToast('保存代码失败，无法生成分享链接', 'error')
            return
        }

        // 创建分享链接
        const result = await codeStore.shareCode({
            snippetId: saveResult.id, // 使用刚保存的代码的 id
            accessCode: accessCode.value,
            expireTime: expireTime.value
        })

        // 显示分享结果
        if (result?.accessCode) {
            showToast(`分享成功，提取码：${result.accessCode}`)
            // 复制提取码到剪贴板
            await navigator.clipboard.writeText(result.accessCode)
            showToast('提取码已复制到剪贴板')
        }

        showShareSettings.value = false
        // 重置提取码
        accessCode.value = ''
    } catch (error) {
        showToast(error.message || '分享失败', 'error')
    }
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

// 加载状态控制
const withLoading = async (fn) => {
    isLoading.value = true
    try {
        await fn()
    } finally {
        isLoading.value = false
    }
}

// 消息提示
const showToast = (msg, type = 'success') => {
    console.log(`${type.toUpperCase()}: ${msg}`)
    // 这里可以添加实际的 toast 实现
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

onMounted(async () => {
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

<style scoped>
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
</style>