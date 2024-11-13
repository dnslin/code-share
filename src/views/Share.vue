<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <!-- 提取码输入界面 -->
        <div v-if="needAccessCode && !hasCode" class="flex-1 flex items-center justify-center">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 class="text-xl font-semibold mb-6 text-center">获取代码片段</h3>
                <form @submit.prevent="fetchContent" class="space-y-4">
                    <div>
                        <label for="accessCode" class="block text-sm font-medium mb-2">提取码</label>
                        <input id="accessCode" v-model="accessCode" type="text" placeholder="请输入提取码"
                            class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600" required>
                    </div>
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

        <!-- 代码展示界面 -->
        <template v-else>
            <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
                <!-- 语言显示 -->
                <div class="btn-base bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    <CodeBracketIcon class="w-5 h-5" />
                    <span>{{ getCurrentLanguageName() }}</span>
                </div>

                <!-- 复制按钮 -->
                <button @click="copyCode"
                    class="btn-base bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300">
                    <ClipboardDocumentIcon class="w-5 h-5" />
                    <span>复制代码</span>
                </button>
                <button @click="copyRawLink"
                    class="btn-base bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300">
                    <LinkIcon class="w-5 h-5" />
                    <span>原始链接</span>
                </button>
                <!-- 返回首页按钮 -->
                <button @click="router.push('/')"
                    class="btn-base bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <HomeIcon class="w-5 h-5" />
                    <span>返回首页</span>
                </button>
            </div>

            <!-- 代码编辑器 -->
            <div class="flex-1 border border-gray-700 rounded relative">
                <CodeEditor v-model="code" :language="language" :readonly="true" />
            </div>
        </template>

        <!-- 加载状态 -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner />
        </div>

        <TransitionFade>
            <div v-if="showAccessCodeDialog"
                class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-xl font-semibold mb-4">输入提取码</h3>
                    <form @submit.prevent="fetchContent" class="space-y-4">
                        <div>
                            <label for="accessCode" class="block text-sm font-medium mb-2">提取码</label>
                            <input id="accessCode" v-model="accessCode" type="text" placeholder="请输入提取码"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required>
                        </div>
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
    </div>
</template>

<style scoped lang="scss">
.btn-base {
    @apply px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200 font-medium;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { useCodeStore } from '../stores/code'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'
import {
    CodeBracketIcon,
    ClipboardDocumentIcon,
    LinkIcon,
    HomeIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const codeStore = useCodeStore()

const code = ref('')
const language = ref('')
const accessCode = ref('')
const isLoading = ref(false)
const needAccessCode = ref(false)
const hasCode = ref(false)
const showAccessCodeDialog = ref(false)
const toast = useToast()
// 获取代码信息
const fetchInfo = async () => {
    try {
        isLoading.value = true
        const shareId = route.params.id
        const result = await codeStore.getShareInfo(shareId)

        if (result?.data) {
            needAccessCode.value = result.data.needAccessCode
            language.value = result.data.language

            // 如果需要提取码，显示对话框
            if (needAccessCode.value) {
                showAccessCodeDialog.value = true
            } else {
                // 如果不需要提取码，直接获取内容
                await fetchContent()
            }
        }
    } catch (error) {
        showToast(error.detail, 'error')
    } finally {
        isLoading.value = false
    }
}

const copyRawLink = async () => {
    try {
        const baseUrl = window.location.origin
        const shareId = route.params.id
        let rawUrl = `${baseUrl}/api/snippets/share/${shareId}/raw`

        // 如果需要提取码且已经输入，则添加到URL
        if (needAccessCode.value && accessCode.value) {
            rawUrl += `?access_code=${accessCode.value}`
        }

        await navigator.clipboard.writeText(rawUrl)
        showToast('原始代码链接已复制到剪贴板')
    } catch (err) {
        showToast('复制失败，请手动复制', 'error')
    }
}
// 获取代码内容
const fetchContent = async () => {
    try {
        isLoading.value = true
        const shareId = route.params.id
        const result = await codeStore.getShareContent(shareId, accessCode.value)

        if (result?.data) {
            code.value = result.data.code
            language.value = result.data.language
            hasCode.value = true
            // 添加这一行：获取代码成功后关闭弹窗
            showAccessCodeDialog.value = false
        }
    } catch (error) {
        showToast(error.message, 'error')
    } finally {
        isLoading.value = false
    }
}

// 复制代码
const copyCode = async () => {
    try {
        await navigator.clipboard.writeText(code.value)
        showToast('代码已复制到剪贴板')
    } catch (err) {
        showToast('复制失败，请手动复制', 'error')
    }
}

// 获取当前语言名称
const getCurrentLanguageName = () => {
    if (!language.value) return '未知语言'
    if (!codeStore.languages?.data) return language.value

    // 在所有分组中查找当前语言
    for (const languages of Object.values(codeStore.languages.data)) {
        const found = languages.find(lang => lang.id === language.value)
        if (found) return found.name
    }
    return language.value
}

// 显示提示消息
const showToast = (msg, type = 'success') => {
    toast[type](msg)
}

onMounted(() => {
    fetchInfo()
})
</script>