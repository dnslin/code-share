<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <select v-model="language"
                class="px-3 sm:px-4 py-2 rounded bg-gray-700 text-white text-sm sm:text-base min-w-[120px] custom-select">
                <!-- 编程语言 -->
                <optgroup label="编程语言">
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="php">PHP</option>
                </optgroup>
                <!-- 标记语言 -->
                <optgroup label="标记语言">
                    <option value="html">HTML</option>
                    <option value="xml">XML</option>
                    <option value="markdown">Markdown</option>
                </optgroup>
                <!-- 样式语言 -->
                <optgroup label="样式语言">
                    <option value="css">CSS</option>
                    <option value="scss">SCSS</option>
                    <option value="less">Less</option>
                </optgroup>
                <!-- 配置文件 -->
                <optgroup label="配置文件">
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="ini">INI</option>
                    <option value="toml">TOML</option>
                    <option value="dockerfile">Dockerfile</option>
                </optgroup>
                <!-- Shell 脚本 -->
                <optgroup label="Shell 脚本">
                    <option value="shell">Shell</option>
                    <option value="powershell">PowerShell</option>
                    <option value="batch">Batch</option>
                </optgroup>
            </select>

            <!-- 操作按钮组 -->
            <div class="flex flex-1 gap-2 sm:gap-4 flex-wrap">
                <button @click="formatCode"
                    class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group"
                    :class="{ 'opacity-50 cursor-not-allowed': isFormatting }" :disabled="isFormatting">
                    <svg v-if="isFormatting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span class="hidden sm:inline">{{ isFormatting ? '格式化中...' : '格式化代码' }}</span>
                    <span class="sm:hidden">{{ isFormatting ? '处理中...' : '格式化' }}</span>
                    <KeyboardShortcut :keys="['Ctrl', 'S']" class="hidden group-hover:inline-flex ml-2" />
                </button>

                <button @click="generateShareLink"
                    class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group"
                    :class="{ 'opacity-50 cursor-not-allowed': isLoading }" :disabled="isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316" />
                    </svg>
                    <span class="hidden sm:inline">分享代码</span>
                    <span class="sm:hidden">分享</span>
                    <KeyboardShortcut :keys="['Ctrl', 'D']" class="hidden group-hover:inline-flex ml-2" />
                </button>

                <!-- 新增设置按钮 -->
                <button @click="showSettings = true"
                    class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="hidden sm:inline">设置</span>
                </button>
            </div>
        </div>

        <!-- 设置对话框 -->
        <TransitionFade>
            <div v-if="showSettings"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-lg font-semibold mb-4">编辑器设置</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">字体大小</label>
                            <input type="number" v-model="editorSettings.fontSize" min="12" max="24"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">缩进大小</label>
                            <input type="number" v-model="editorSettings.tabSize" min="2" max="8"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">自动换行</label>
                            <select v-model="editorSettings.wordWrap"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                                <option value="on">开启</option>
                                <option value="off">关闭</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6">
                        <button @click="showSettings = false"
                            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            取消
                        </button>
                        <button @click="applySettings"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            应用
                        </button>
                    </div>
                </div>
            </div>
        </TransitionFade>

        <!-- 编辑器区域 -->
        <div class="flex-1 border border-gray-700 rounded relative group">
            <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
            <CodeEditor v-model:code="code" :language="language" />
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

const router = useRouter()
const codeStore = useCodeStore()
const code = ref(codeStore.code || '')
const language = ref(codeStore.language || 'javascript')
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

watch(code, (newCode) => {
    codeStore.setCode(newCode)
})

watch(language, (newLanguage) => {
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
    const accessCode = codeStore.shareCode(code.value, language.value, password)
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