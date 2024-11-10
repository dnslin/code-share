<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <select v-model="selectedLanguage">
                <optgroup v-for="(group, key) in languageOptions" :key="key" :label="group.label">
                    <option v-for="option in group.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </optgroup>
            </select>

            <!-- 简化访问控制为单一密码 -->
            <input v-model="accessCode" type="text" placeholder="设置访问密码（可选）" class="input-field" />

            <div class="buttons">
                <button @click="saveCode" class="save-btn">
                    保存代码
                </button>
                <button @click="copyShareLink" class="share-btn">
                    复制分享链接
                </button>
            </div>
        </div>

        <!-- 编辑器区域 -->
        <div class="flex-1 border border-gray-700 rounded relative group">
            <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
            <CodeEditor v-model:code="code" :language="selectedLanguage" />
        </div>

        <!-- 提示消息 -->
        <div v-if="showMessage"
            class="fixed bottom-4 right-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-base"
            :class="messageType === 'success' ? 'bg-emerald-500' : 'bg-red-500'">
            {{ message }}
        </div>

        <!-- 分享对话框 -->
        <TransitionFade>
            <div v-if="showShareDialog"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-lg font-semibold mb-4">分享代码</h3>

                    <!-- 密码选项 -->
                    <div class="mb-4">
                        <label class="flex items-center gap-2 text-sm mb-2">
                            <input type="checkbox" v-model="usePassword" class="rounded">
                            设置访问密码
                        </label>
                        <input v-if="usePassword" type="text" v-model="sharePassword" placeholder="请输入访问密码"
                            class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                    </div>

                    <!-- 分享结果 -->
                    <div v-if="shareResult" class="mb-4">
                        <p class="text-sm mb-2">分享链接：</p>
                        <div class="flex gap-2 mb-2">
                            <input type="text" :value="shareLink" readonly
                                class="flex-1 px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                            <button @click="copyShareLink"
                                class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                复制
                            </button>
                        </div>
                        <p class="text-sm mb-2">提取码：<span class="font-mono">{{ shareResult.accessCode }}</span></p>
                        <p v-if="shareResult.password" class="text-sm">
                            访问密码：<span class="font-mono">{{ shareResult.password }}</span>
                        </p>
                    </div>

                    <!-- 按钮组 -->
                    <div class="flex justify-end gap-2">
                        <button @click="closeShareDialog"
                            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            关闭
                        </button>
                        <button v-if="!shareResult" @click="confirmShare"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            确认分享
                        </button>
                    </div>
                </div>
            </div>
        </TransitionFade>

        <!-- 添加加载状态 -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useCodeStore } from '../stores/code'
import { useRouter } from 'vue-router'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'
import KeyboardShortcut from '../components/KeyboardShortcut.vue'
import languages from '../config/languages.json'

const router = useRouter()
const codeStore = useCodeStore()
const code = ref(codeStore.code || '')
const selectedLanguage = ref(codeStore.language || 'javascript')
const isFormatting = ref(false)
const showMessage = ref(false)
const message = ref('')
const messageType = ref('success')
const showShareDialog = ref(false)
const usePassword = ref(false)
const sharePassword = ref('')
const shareResult = ref(null)
const showSettings = ref(false)
const editorSettings = ref({
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on'
})
const isLoading = ref(false)
const accessCode = ref('')

watch(code, (newCode) => {
    codeStore.setCode(newCode)
})

watch(selectedLanguage, (newLanguage) => {
    codeStore.setLanguage(newLanguage)
})

const withLoading = async (fn) => {
    isLoading.value = true
    try {
        await fn()
    } finally {
        isLoading.value = false
    }
}

const formatCode = () => withLoading(async () => {
    try {
        isFormatting.value = true
        const formattedCode = await codeStore.formatCode()
        if (formattedCode) {
            code.value = formattedCode
            showToast('代码格式化成功！', 'success')
        }
    } catch (error) {
        showToast('格式化失败，请检查代码格式', 'error')
        console.error('格式化错误:', error)
    } finally {
        isFormatting.value = false
    }
})

const generateShareLink = () => withLoading(async () => {
    showShareDialog.value = true
})

const closeShareDialog = () => {
    showShareDialog.value = false
    usePassword.value = false
    sharePassword.value = ''
    shareResult.value = null
}

const confirmShare = () => {
    const password = usePassword.value ? sharePassword.value : ''
    const accessCode = codeStore.shareCode(code.value, selectedLanguage.value, password)
    shareResult.value = {
        accessCode,
        password: usePassword.value ? password : null
    }
}

const shareLink = computed(() => {
    if (!shareResult.value) return ''
    return `${window.location.origin}/share/${shareResult.value.accessCode}`
})

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(shareLink.value)
        showToast('链接已复制到剪贴板', 'success')
    } catch (err) {
        showToast('复制失败', 'error')
    }
}

const showToast = (msg, type = 'success') => {
    message.value = msg
    messageType.value = type
    showMessage.value = true
    setTimeout(() => {
        showMessage.value = false
    }, 3000)
}

const applySettings = () => {
    // 应用设置并保存到本地存储
    localStorage.setItem('editorSettings', JSON.stringify(editorSettings.value))
    showSettings.value = false
}

// 加载保存的设置
onMounted(() => {
    const savedSettings = localStorage.getItem('editorSettings')
    if (savedSettings) {
        editorSettings.value = JSON.parse(savedSettings)
    }
})

// 保存代码
const saveCode = async () => {
    try {
        const result = await codeStore.saveCode({
            code: code.value,
            language: selectedLanguage.value,
            accessCode: accessCode.value || null // 如果没有设置密码，则为 null
        })

        // 显示成功消息，包含分享链接
        alert(`保存成功！分享ID：${result.id}`)
    } catch (error) {
        alert('保存失败：' + error.message)
    }
}

// 在组件加载时获取语言列表
onMounted(async () => {
    try {
        await codeStore.fetchLanguages()
    } catch (error) {
        console.error('加载语言列表失败:', error)
    }
})

// 使用 store 中的语言列表
const languageOptions = computed(() => codeStore.languages || {})
</script>

<style scoped lang="scss">
.btn-hover {
    @apply transform transition-all duration-200 hover:scale-105 active:scale-95;
}

.card-hover {
    @apply transition-all duration-300 hover:shadow-lg hover:border-blue-500/50;
}

/* 自定义下拉框样式 */
.custom-select {
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #4B5563 #1F2937;

    /* Chrome, Edge, Safari */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        @apply bg-gray-100 dark:bg-gray-800;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        @apply bg-gray-400 dark:bg-gray-600;
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }

    /* 优化下拉选项样式 */
    & option {
        @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100;
        padding: 8px;
    }

    & optgroup {
        @apply bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400;
        font-weight: 600;
        padding: 4px;
    }

    /* 选中状态 */
    & option:checked {
        @apply bg-blue-50 dark:bg-blue-900;
    }

    /* 悬停状态 */
    & option:hover {
        @apply bg-gray-100 dark:bg-gray-600;
    }

    /* 下拉框本身的样式 */
    @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600;

    /* 聚焦状态 */
    &:focus {
        @apply outline-none ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50;
    }
}
</style>