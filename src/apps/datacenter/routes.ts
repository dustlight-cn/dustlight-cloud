import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: "forms",
    component: () => import("./pages/Forms.vue"),
    path: "/forms"
  },
  {
    name: "form",
    component: () => import("./pages/Form.vue"),
    path: "/forms/:id"
  },
  {
    name: "new-form",
    component: () => import("./pages/Form.vue"),
    path: "/new-form"
  },
  {
    name: "records",
    component: () => import("./pages/Records.vue"),
    path: "/records"
  },
]

export default routes
