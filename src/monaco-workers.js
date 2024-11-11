import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// 配置 Monaco 环境
self.MonacoEnvironment = {
    getWorker(_, label) {
        switch (label) {
            case 'json':
            case 'jsonc':
                return new jsonWorker()
            case 'css':
            case 'scss':
            case 'less':
                return new cssWorker()
            case 'html':
            case 'handlebars':
            case 'razor':
            case 'xml':
                return new htmlWorker()
            case 'typescript':
            case 'javascript':
            case 'jsx':
            case 'tsx':
                return new tsWorker()
            default:
                return new editorWorker()
        }
    }
}

// 配置默认格式化选项
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
})

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    typeRoots: ["node_modules/@types"]
})

// 配置 JSON 格式化选项
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: true,
    schemas: []
})

// 配置 HTML 格式化选项
monaco.languages.html.htmlDefaults.setOptions({
    format: {
        tabSize: 2,
        insertSpaces: true,
    },
    suggest: {
        html5: true,
    },
})

// 配置 CSS 格式化选项
monaco.languages.css.cssDefaults.setOptions({
    validate: true,
    lint: {
        compatibleVendorPrefixes: 'warning',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
    },
}) 