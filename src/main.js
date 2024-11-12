import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import './monaco-workers'
import { useThemeStore } from './stores/theme'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true
});

app.mount('#app')

// 初始化主题
const themeStore = useThemeStore(pinia)
themeStore.initTheme()
