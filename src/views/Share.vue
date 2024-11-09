<template>
    <div class="container mx-auto p-2 sm:p-4 h-full flex flex-col">
        <TransitionFade>
            <!-- 提取码输入界面 -->
            <div v-if="!hasCode" class="flex-1 flex items-center justify-center">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl card-hover">
                    <h3 class="text-xl font-semibold mb-6 text-center">获取代码片段</h3>
                    <div class="space-y-4">
                        <!-- 提取码输入 -->
                        <div>
                            <label class="block text-sm font-medium mb-2">提取码</label>
                            <input type="text" v-model="accessCode" placeholder="请输入提取码"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <!-- 密码输入（可选） -->
                        <div>
                            <label class="block text-sm font-medium mb-2">访问密码（如果有）</label>
                            <input type="password" v-model="password" placeholder="如果需要密码，请输入"
                                class="w-full px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <!-- 按钮 -->
                        <div class="flex justify-end gap-2 pt-4">
                            <button @click="router.push('/')"
                                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                返回首页
                            </button>
                            <button @click="fetchCode"
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                获取代码
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TransitionFade>

        <TransitionFade>
            <!-- 代码展示界面 -->
            <template v-if="hasCode">
                <!-- 原有的代码展示部分保持不变 -->
                <div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
                    <!-- ... 原有的工具栏内容 ... -->
                </div>
                <div class="flex-1 border border-gray-700 rounded relative group">
                    <!-- ... 原有的编辑器内容 ... -->
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCodeStore } from '../stores/code'
import CodeEditor from '../components/CodeEditor.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import TransitionFade from '../components/TransitionFade.vue'

const route = useRoute()
const router = useRouter()
const codeStore = useCodeStore()
const dropdown = ref(null)

const code = ref('')
const language = ref('javascript')
const isDropdownOpen = ref(false)
const accessCode = ref('')
const password = ref('')
const hasCode = ref(false)
const showMessage = ref(false)
const message = ref('')
const messageType = ref('success')
const isLoading = ref(false)

onMounted(() => {
    // 如果URL中有提取码，自动填充
    if (route.params.id) {
        accessCode.value = route.params.id
        fetchCode()
    }
})

const fetchCode = () => withLoading(async () => {
    if (!accessCode.value) {
        showToast('请输入提取码', 'error')
        return
    }

    try {
        const sharedCode = codeStore.getSharedCode(accessCode.value, password.value)
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