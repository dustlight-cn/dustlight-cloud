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
    path: "/process/:name"
  },
  {
    name: "new-process",
    component: () => import("./pages/Process.vue"),
    path: "/process/"
  },
  {
    name: "instances",
    component: () => import("./pages/Instances.vue"),
    path: "/instances"
  },
  {
    name: "instance",
    component: () => import("./pages/Instance.vue"),
    path: "/instance/:id"
  }
]

export default routes
