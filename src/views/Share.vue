<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <TransitionFade>
            <!-- 提取码输入界面 -->
            <div v-if="!hasCode" class="flex-1 flex items-center justify-center">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl card-hover">
                    <h3 class="text-xl font-semibold mb-6 text-center">获取代码片段</h3>
                    <form @submit.prevent="fetchCode" class="space-y-4">
                        <!-- 提取码输入 -->
                        <div>
                            <label for="accessCode" class="block text-sm font-medium mb-2">提取码</label>
                            <input id="accessCode" type="text" v-model="accessCode" placeholder="请输入提取码"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <!-- 按钮 -->
                        <div class="flex justify-end gap-2 pt-4">
                            <button type="button" @click="router.push('/')"
                                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                返回首页
                            </button>
                            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                获取代码
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TransitionFade>

        <TransitionFade>
            <!-- 代码展示界面 -->
            <template v-if="hasCode">
                <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
                    <!-- 语言选择 -->
                    <div class="relative" ref="dropdown">
                        <button @click="isDropdownOpen = !isDropdownOpen"
                            class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span>{{ getLanguageDisplay(language) }}</span>
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
                <div class="flex-1 border border-gray-700 rounded relative group">
                    <CodeEditor v-model="code" :language="language" :readonly="true" />
                </div>
            </template>
        </TransitionFade>

        <!-- 加载状态 -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCodeStore } from '../stores/code'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const codeStore = useCodeStore()
const dropdown = ref(null)

const code = ref('')
const language = ref('javascript')
const isDropdownOpen = ref(false)
const accessCode = ref('')
const hasCode = ref(false)
const showMessage = ref(false)
const message = ref('')
const messageType = ref('success')
const isLoading = ref(false)

const { languages: storeLanguages } = storeToRefs(codeStore)

const languageGroups = computed(() => {
    if (!storeLanguages.value) return []
    return Object.entries(storeLanguages.value).map(([key, languages]) => ({
        name: key,
        languages: Array.isArray(languages) ? languages : []
    }))
})

const getLanguageDisplay = (langId) => {
    if (!langId) return ''
    if (!storeLanguages.value) return langId

    // 遍历所有分组查找当前语言
    for (const [groupName, languages] of Object.entries(storeLanguages.value)) {
        if (!Array.isArray(languages)) continue
        const found = languages.find(lang => lang.id === langId)
        if (found) return found.name
    }
    return langId
}

const selectLanguage = (lang) => {
    if (lang && lang.id) {
        language.value = lang.id
        isDropdownOpen.value = false
    }
}

const copyCode = async () => {
    try {
        await navigator.clipboard.writeText(code.value)
        showToast('代码已复制到剪贴板')
    } catch (err) {
        showToast('复制失败，请手动复制', 'error')
    }
}

onMounted(async () => {
    // 初始化语言列表
    await codeStore.initLanguages()

    if (route.params.id) {
        await codeStore.fetchSnippet(route.params.id)
    }
})

const fetchCode = () => withLoading(async () => {
    if (!accessCode.value) {
        showToast('请输入提取码', 'error')
        return
    }

    try {
        const sharedCode = await codeStore.getSharedCode(accessCode.value)
        loadCode(sharedCode)
        hasCode.value = true
        showToast('获取代码成功', 'success')
    } catch (error) {
        showToast(error.message, 'error')
    }
})

const loadCode = (sharedCode) => {
    code.value = sharedCode.code
    language.value = sharedCode.language
}

const showToast = (msg, type = 'success') => {
    message.value = msg
    messageType.value = type
    showMessage.value = true
    setTimeout(() => {
        showMessage.value = false
    }, 3000)
}

// 添加加载状态控制
const withLoading = async (fn) => {
    isLoading.value = true
    try {
        await fn()
    } finally {
        isLoading.value = false
    }
}

</script>

<style scoped lang="scss">
.card-hover {
    @apply transition-all duration-300 hover:shadow-lg hover:border-blue-500/50;
}
</style>