import {RouteRecordRaw} from "vue-router";
import Test from './pages/Test.vue'

const routes: RouteRecordRaw[] = [
  {
    name: "index",
    component: () => import("./pages/Index.vue"),
    path: "/"
  },
  {
    name: "test",
    component: Test,
    path: "/test"
  }
]

export default routes
