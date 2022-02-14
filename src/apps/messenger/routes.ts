import {RouteRecordRaw} from "vue-router";
import Test from './pages/Test.vue'

const routes: RouteRecordRaw[] = [
  {
    name: "notifications",
    component: () => import("./pages/Notifications.vue"),
    path: "/"
  },
  {
    name: "templates",
    component: () => import("./pages/Templates.vue"),
    path: "/templates"
  },
  {
    name: "channels",
    component: () => import("./pages/Channels.vue"),
    path: "/channels"
  },
  {
    name: "messages",
    component: () => import("./pages/Messages.vue"),
    path: "/messages"
  }
]

export default routes
