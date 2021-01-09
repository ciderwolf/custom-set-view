import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
  },
  {
    path: '/search/card',
    name: 'Card',
    component: () => import(/* webpackChunkName: "card-detail" */ '../views/CardDetail.vue'),
  },
  {
    path: '/advanced',
    name: 'Advancd Search',
    component: () => import(/* webpackChunkName: "advanced-search" */ '../views/AdvancedSearch.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
