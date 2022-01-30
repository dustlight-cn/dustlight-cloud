import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "index",
    component: () => import("./pages/Index.vue"),
    path: "/"
  },
  {
    name: "create",
    component: () => import("./pages/Create.vue"),
    path: "/create"
  }
]

export default routes
