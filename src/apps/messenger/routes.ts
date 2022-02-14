import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "notifications",
    component: () => import("./pages/Notifications.vue"),
    path: "/notifications"
  },
  {
    name: "templates",
    component: () => import("./pages/Templates.vue"),
    path: "/templates"
  },
  {
    name: "template",
    component: () => import('./pages/Template.vue'),
    path: "/templates/:id"
  },
  {
    name: "channels",
    component: () => import("./pages/Channels.vue"),
    path: "/channels"
  },
  {
    name: "channel",
    component: () => import("./pages/Channel.vue"),
    path: "/channels/:id"
  },
  {
    name: "messages",
    component: () => import("./pages/Messages.vue"),
    path: "/messages"
  }
]

export default routes
