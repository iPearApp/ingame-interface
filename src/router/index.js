import Vue from 'vue'
import VueRouter from 'vue-router'
import WelcomeView from "@/views/WelcomeView";
import QrCodeView from "@/views/QrCodeView";
import SecretCodeView from "@/views/SecretCodeView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: QrCodeView
  },
  {
    path: '/secret',
    name: 'secret',
    component: SecretCodeView
  }
]

const router = new VueRouter({
  routes
})

export default router
