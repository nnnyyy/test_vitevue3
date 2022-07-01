import { createApp } from 'vue'
import App from './App.vue'
import axios from  './plugins/axios'

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.mount("#app");
