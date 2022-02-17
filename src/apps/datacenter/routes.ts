import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "forms",
    component: () => import("./pages/Forms.vue"),
    path: "/forms"
  },
  {
    name: "records",
    component: () => import("./pages/Records.vue"),
    path: "/records"
  },
]

export default routes
