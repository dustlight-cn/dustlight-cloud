import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "processes",
    component: () => import("./pages/Processes.vue"),
    path: "/"
  },
  {
    name: "process",
    component: () => import("./pages/Process.vue"),
    path: "/process/:id"
  },
  {
    name: "instances",
    component: () => import("./pages/Instances.vue"),
    path: "/instances"
  }
]

export default routes
