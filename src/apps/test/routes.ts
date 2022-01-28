import {RouteRecordRaw} from "vue-router";
import Test2 from './pages/Test2.vue'

const routes: RouteRecordRaw[] = [
  {
    name: "ggboy",
    component: () => import("./pages/Test.vue"),
    path: "/"
  },
  {
    name: "ggboy-2",
    component: Test2,
    path: "/test"
  }
]

export default routes
