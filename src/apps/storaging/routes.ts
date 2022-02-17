import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "objects",
    component: () => import("./pages/Objects.vue"),
    path: "/objects"
  },
  {
    name: "object",
    component: () => import("./pages/Object.vue"),
    path: "/objects/:id"
  },
  {
    name: "configs",
    component: () => import("./pages/Configs.vue"),
    path: "/configs"
  },
]

export default routes
