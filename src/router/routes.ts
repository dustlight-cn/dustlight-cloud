import {RouteRecordRaw} from 'vue-router';
import apps from '../apps'
import {computeRoutes} from "src/apps/App";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {name: 'index', path: '', component: () => import('pages/Index.vue')},
      {name: 'login', path: 'login', component: () => import('pages/cloud/Login.vue')}
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

// @ts-ignore
routes[0].children?.push(...computeRoutes(apps))

export default routes;
