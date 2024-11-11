<template>
    <div class="loading-spinner">
        <div class="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.loading-spinner {
    @apply flex items-center justify-center;
}

.spinner {
    width: 40px;
    height: 40px;
    position: relative;
}

.spinner div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid;
    @apply border-blue-500 dark:border-blue-400;
    border-radius: 50%;
    animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: currentColor transparent transparent transparent;
}

.spinner div:nth-child(1) {
    animation-delay: -0.45s;
}

.spinner div:nth-child(2) {
    animation-delay: -0.3s;
}

.spinner div:nth-child(3) {
    animation-delay: -0.15s;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>