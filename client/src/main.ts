import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from './plugins/axios'
import router from './plugins/router'

loadFonts()

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(router);
app.use(vuetify);
app.mount("#app");