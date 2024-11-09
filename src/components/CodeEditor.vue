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
    code: {
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

const emit = defineEmits(['update:code'])
const editorContainer = ref(null)
let editor = null

const themeStore = useThemeStore()

onMounted(() => {
    editor = monaco.editor.create(editorContainer.value, {
        value: props.code,
        language: props.language,
        theme: themeStore.isDark ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        minimap: {
            enabled: false
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
        formatOnType: true
    })

    editor.onDidChangeModelContent(() => {
        if (!props.readonly) {
            emit('update:code', editor.getValue())
        }
    })
})

watch(() => props.code, (newCode) => {
    if (editor && newCode !== editor.getValue()) {
        editor.setValue(newCode)
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
</script>

<style>
.monaco-editor {
    padding: 8px 0;
    height: 100% !important;
}
</style>