import { onMounted, onUnmounted } from 'vue'

export function useShortcuts(shortcuts) {
    const handleKeydown = (event) => {
        const { key, ctrlKey, metaKey } = event

        for (const [shortcut, handler] of Object.entries(shortcuts)) {
            const [modifier, k] = shortcut.split('+')
            if ((modifier === 'ctrl' && ctrlKey || modifier === 'cmd' && metaKey) &&
                key.toLowerCase() === k.toLowerCase()) {
                event.preventDefault()
                handler()
            }
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
} 