import {RouteRecordRaw} from "vue-router";
import Test2 from './pages/Test2.vue'

const routes: RouteRecordRaw[] = [
  {
    name: "index",
    component: () => import("./pages/Test.vue"),
    path: "/"
  },
  {
    name: "test",
    component: Test2,
    path: "/test"
  }
]

export default routes
