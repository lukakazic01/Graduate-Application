import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'vue-toast-notification/dist/theme-sugar.css';
import App from './App.vue'
import VueCookies from 'vue-cookies';
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import jwtDecode from "jwt-decode";
import {useUserStore} from "../store/user";

const app = createApp(App)
app.use(VueCookies)
app.use(createPinia())
app.use(router)
router.app = app

app.mount('#app')

const store = useUserStore()
const { $cookies } = router.app.config.globalProperties
router.beforeEach((to, from) => {
    const token = $cookies.get('token')
    if (token) {
        try {
            const decoded = jwtDecode(token)
            store.setUsername(decoded.username)
        } catch (err) {
            //
        }
    }
    if(['login', 'register'].includes(to.name) && store.username) {
        return router.push('/')
    }
    if(!['login', 'register'].includes(to.name) && !store.username) {
        return router.push('/login')
    }
})



