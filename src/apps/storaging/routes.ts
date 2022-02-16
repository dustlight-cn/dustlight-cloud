import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "objects",
    component: () => import("./pages/Objects.vue"),
    path: "/objects"
  },
  {
    name: "configs",
    component: () => import("./pages/Configs.vue"),
    path: "/configs"
  },
]

export default routes
