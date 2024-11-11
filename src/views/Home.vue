<template>
    <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col relative">
        <!-- Hero Section -->
        <div class="flex-1 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 py-8 lg:py-0"
            ref="heroSection">
            <!-- 文字部分 -->
            <div class="text-center lg:text-left lg:flex-1 px-4 sm:px-6 lg:px-8">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 
                    animate-fade-in-up opacity-0 leading-tight" style="animation-delay: 200ms">
                    代码分享从未如此简单
                </h1>
                <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 animate-fade-in-up opacity-0"
                    style="animation-delay: 400ms">
                    一个优雅的在线代码编辑器，支持多种编程语言
                    <span class="hidden sm:inline"><br>让分享代码片段变得轻而易举</span>
                </p>
                <router-link to="/editor"
                    class="relative inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 text-base font-medium text-white bg-blue-600 rounded-lg 
                    hover:bg-blue-700 transition-all duration-300 hover:scale-105 animate-fade-in-up opacity-0 shadow-lg group"
                    style="animation-delay: 600ms">
                    开始使用
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </router-link>
            </div>

            <!-- 插画部分 -->
            <div class="lg:flex-1 w-full max-w-lg animate-fade-in-up opacity-0" style="animation-delay: 400ms">
                <div class="illustration-container">
                    <img src="@/assets/predictive.svg" alt="Code Sharing Illustration"
                        class="w-full h-auto transition-colors duration-300"
                        :class="{ 'svg-light': !isDark, 'svg-dark': isDark }" />
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="container mx-auto px-4 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
                <div v-for="(feature, index) in features" :key="feature.title"
                    class="flip-card animate-fade-in-up opacity-0"
                    :style="{ animationDelay: `${800 + index * 200}ms` }">
                    <div class="flip-card-inner">
                        <!-- 正面 -->
                        <div
                            class="flip-card-front bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div
                                :class="`w-8 sm:w-10 h-8 sm:h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mb-3 sm:mb-4`">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    :class="`h-4 sm:h-5 w-4 sm:w-5 ${feature.iconColor}`" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="feature.icon" />
                                </svg>
                            </div>
                            <h3 class="text-base sm:text-lg font-semibold mb-2">{{ feature.title }}</h3>
                            <p class="text-sm text-gray-400">{{ feature.description }}</p>
                        </div>
                        <!-- 背面 -->
                        <div
                            class="flip-card-back bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{{ feature.title }}</h3>
                            <p class="text-xs sm:text-sm text-gray-300">{{ feature.detailedDescription }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="container mx-auto px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <div class="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                <p>用❤️打造 | 开源分享 Vue 3 + Monaco Editor</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const [heroSection] = useAutoAnimate()
const [featuresSection] = useAutoAnimate()

const features = [
    {
        title: '多语言支持',
        description: '支持多种主流编程语言，语法高亮，代码格式化',
        detailedDescription: '支持 JavaScript、Python、HTML、CSS 等多种编程语言，提供实时语法高亮和智能代码格式化功能，让你的代码更加规范美观。',
        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        bgColor: 'bg-blue-500/10',
        iconColor: 'text-blue-400'
    },
    {
        title: '即时分享',
        description: '一键生成分享链接，随时随地分享你的代码',
        detailedDescription: '只需点击一下，即可生成永久的分享链接。支持访问控制和代码版本管理，让代码分享变得更加安全和便捷。',
        icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
        bgColor: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400'
    },
    {
        title: '优雅界面',
        description: '简洁直观的界面设计，专于编码体验',
        detailedDescription: '精心设计的用户界面，支持深色主题，自定义字体大小和编辑器主题。多种快捷键支持，提供最佳的编码体验。',
        icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        bgColor: 'bg-purple-500/10',
        iconColor: 'text-purple-400'
    }
]
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
}

.flip-card {
    perspective: 1000px;
    height: 200px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
}

.flip-card-back {
    transform: rotateY(180deg);
    background: linear-gradient(135deg,
            rgba(59, 130, 246, 0.1),
            rgba(16, 185, 129, 0.1));
    @apply bg-white/80 dark:bg-gray-800/90;

    & h3 {
        @apply text-gray-800 dark:text-white font-bold;
    }

    & p {
        @apply text-gray-600 dark:text-gray-300;
        line-height: 1.6;
    }

    @apply border border-gray-200/50 dark:border-gray-700/50;
    backdrop-filter: blur(8px);
}

.flip-card-front {
    @apply bg-white/90 dark:bg-gray-800/80;
    backdrop-filter: blur(8px);
    border: 1px solid;
    @apply border-gray-200/50 dark:border-gray-700/50;
}

/* 添加一些微妙的阴影效果 */
.flip-card-front,
.flip-card-back {
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 添加悬停时的光晕效果 */
.flip-card:hover .flip-card-front,
.flip-card:hover .flip-card-back {
    box-shadow:
        0 0 15px rgba(59, 130, 246, 0.3),
        0 0 5px rgba(59, 130, 246, 0.1);
}

/* 添加移动端优化样式 */
@media (max-width: 640px) {
    .flip-card {
        height: 180px;
        /* 移动端卡片高度稍微减小 */
    }

    .flip-card-front,
    .flip-card-back {
        padding: 1rem;
    }

    /* 优化移动端翻转体验 */
    .flip-card-inner {
        transition: transform 0.6s;
        /* 移动端动画稍快一些 */
    }
}

/* 加触摸设备的支持 */
@media (hover: none) {
    .flip-card:active .flip-card-inner {
        transform: rotateY(180deg);
    }
}

/* 优化移动端阴影效果 */
@media (max-width: 640px) {

    .flip-card-front,
    .flip-card-back {
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
    }
}


/* 移除 overflow-hidden */
/* 添加响应式内边距控制 */
@media (max-width: 1024px) {
    .max-w-lg {
        max-width: 70%;
        margin: 0 auto;
    }
}

@media (max-width: 640px) {
    .max-w-lg {
        max-width: 90%;
    }
}

/* 插画动画样式 */
.illustration-container {
    animation: float 6s ease-in-out infinite;
    position: relative;
}

.illustration-container::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 20px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 80%);
    animation: shadow 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}

@keyframes shadow {
    0% {
        opacity: 0.4;
        transform: translateX(-50%) scale(1);
    }

    50% {
        opacity: 0.2;
        transform: translateX(-50%) scale(0.8);
    }

    100% {
        opacity: 0.4;
        transform: translateX(-50%) scale(1);
    }
}

/* 添加悬停效果 */
.illustration-container:hover {
    animation-play-state: paused;
}

.illustration-container:hover::after {
    animation-play-state: paused;
}

/* 添加响应式动画控制 */
@media (prefers-reduced-motion: reduce) {
    .illustration-container {
        animation: none;
    }

    .illustration-container::after {
        animation: none;
    }
}

/* 优化移动端显示 */
@media (max-width: 640px) {
    .illustration-container {
        animation-duration: 4s;
    }

    .illustration-container::after {
        animation-duration: 4s;
    }
}

/* 烟花效果样式 */
.sparkles-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.sparkle {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    animation: sparkle 1s ease-out forwards;
    transform: translate(-50%, -50%);
}

@keyframes sparkle {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
        opacity: 1;
        scale: 0;
    }

    100% {
        transform:
            translate(calc(cos(var(--angle)) * var(--velocity) * 100px),
                calc(sin(var(--angle)) * var(--velocity) * 100px)) rotate(360deg);
        opacity: 0;
        scale: 1;
    }
}

/* 添加按钮悬停效果 */
.group:hover svg {
    animation: bounce 1s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(4px);
    }
}
</style>