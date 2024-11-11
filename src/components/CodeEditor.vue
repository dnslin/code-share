<template>
    <div class="w-full h-full relative">
        <div ref="editorContainer" class="absolute inset-0"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useThemeStore } from '../stores/theme'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'javascript'
    },
    readonly: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: Number,
        default: 14
    },
    tabSize: {
        type: Number,
        default: 2
    },
    wordWrap: {
        type: String,
        default: 'on'
    }
})

const emit = defineEmits(['update:modelValue', 'change'])
const editorContainer = ref(null)
let editor = null

const themeStore = useThemeStore()

// 修改格式化代码方法
const formatCode = async () => {
    if (!editor) return
    try {
        // 直接执行格式化动作
        const formatAction = editor.getAction('editor.action.formatDocument')
        if (formatAction) {
            await formatAction.run()
        } else {
            console.warn('Format action not available')
        }
    } catch (error) {
        console.error('Format error:', error)
    }
}

onMounted(() => {
    editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: props.language,
        theme: themeStore.isDark ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        minimap: {
            enabled: true,
            scale: 1,
            side: 'right',
            size: 'fit',
            showSlider: 'mouseover',
            renderCharacters: false
        },
        readOnly: props.readonly,
        scrollBeyondLastLine: false,
        fontSize: props.fontSize,
        tabSize: props.tabSize,
        wordWrap: props.wordWrap,
        contextmenu: true,
        lineNumbers: 'on',
        roundedSelection: false,
        renderWhitespace: 'selection',
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        folding: true,
        matchBrackets: 'always',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        bracketPairColorization: true,
        guides: {
            bracketPairs: true,
            indentation: true
        }
    })

    editor.onDidChangeModelContent(() => {
        if (!props.readonly) {
            const value = editor.getValue()
            emit('update:modelValue', value)
            emit('change', value)
        }
    })

    // 添加快捷键绑定
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        formatCode()
    })

    // 初始格式化
    formatCode()
})

watch(() => props.modelValue, (newValue) => {
    if (editor && newValue !== editor.getValue()) {
        editor.setValue(newValue)
    }
})

watch(() => props.language, (newLanguage) => {
    if (editor) {
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage)
    }
})

// 监听主题变化
watch(() => themeStore.isDark, (isDark) => {
    if (editor) {
        monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs-light')
    }
})

onBeforeUnmount(() => {
    if (editor) {
        editor.dispose()
    }
})

// 暴露格式化方法
defineExpose({
    formatCode
})
</script>

<style>
.monaco-editor {
    padding: 8px 0;
    height: 100% !important;
}
</style>