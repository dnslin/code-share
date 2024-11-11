<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 工具栏 -->
        <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
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
                <div v-if="isDropdownOpen"
                    class="absolute top-full left-0 mt-1 w-48 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded shadow-lg border dark:border-gray-700 z-10">
                    <!-- 动态显示语言分组 -->
                    <div v-for="group in languageGroups" :key="group.name" class="py-1">
                        <div
                            class="px-4 py-1 text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold bg-gray-50 dark:bg-gray-900">
                            {{ group.name }}
                        </div>
                        <button v-for="lang in group.languages" :key="lang.id" @click="selectLanguage(lang)"
                            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
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

            <!-- 返回首页按钮 -->
            <button @click="router.push('/')"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                返回首页
            </button>
        </div>

        <!-- 编辑器容器 -->
        <div class="flex-1 border border-gray-700 rounded relative group">
            <CodeEditor v-model="code" :language="language" @change="handleCodeChange" />
        </div>

        <!-- 分享设置对话框 -->
        <TransitionFade>
            <div v-if="showShareSettings" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-xl font-semibold mb-4">分享设置</h3>
                    <form @submit.prevent="shareCode" class="space-y-4">
                        <!-- 过期时间设置 -->
                        <div>
                            <label for="expireTime" class="block text-sm font-medium mb-2">过期时间</label>
                            <select id="expireTime" v-model="expireTime"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
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
                            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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

const code = ref('')
const language = ref('javascript')
const isDropdownOpen = ref(false)
const showShareSettings = ref(false)
const expireTime = ref('7d')
const isLoading = ref(false)

const { languages: storeLanguages } = storeToRefs(codeStore)

// 修改计算属性部分
const languageGroups = computed(() => {
    if (!storeLanguages.value) return []
    return Object.entries(storeLanguages.value).map(([key, languages]) => ({
        name: key,
        languages: Array.isArray(languages) ? languages : []
    }))
})

// 修改获取当前语言名称的方法
const getCurrentLanguageName = () => {
    if (!language.value) return '选择语言'
    if (!storeLanguages.value) return language.value

    // 遍历所有分组查找当前语言
    for (const [groupName, languages] of Object.entries(storeLanguages.value)) {
        if (!Array.isArray(languages)) continue
        const found = languages.find(lang => lang.id === language.value)
        if (found) return found.name
    }
    return language.value
}

// 修改语言选择方法
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
        await codeStore.createSnippet(code.value, language.value)
        showToast('代码保存成功')
    } catch (error) {
        showToast(error.message, 'error')
    }
})

// 分享设置
const openShareSettings = () => {
    showShareSettings.value = true
}

// 分享代码
const shareCode = () => withLoading(async () => {
    try {
        const result = await codeStore.shareCode({
            code: code.value,
            language: language.value,
            expireTime: expireTime.value
        })
        // 处理分享结果，比如显示分享链接
        showToast('分享链接已生成')
        showShareSettings.value = false
    } catch (error) {
        showToast(error.message, 'error')
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
        console.log('Editor: 开始初始化语言列表')
        await codeStore.initLanguages()
        console.log('Editor: 语言列表初始化完成', storeLanguages.value)
    } catch (error) {
        console.error('Editor: 初始化语言列表失败', error)
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
</style>