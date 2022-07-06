import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from './plugins/axios'
import router from './plugins/router'
import mitt from 'mitt'
import {createPinia} from 'pinia'
const emitter = mitt()

loadFonts()

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.config.globalProperties.emitter = emitter;
app.use(router);
app.use(vuetify);
app.use(createPinia());
app.mount("#app");