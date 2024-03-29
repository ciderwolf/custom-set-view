import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Innistrad Exhumed',
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
    meta: {
      title: 'Search | Innistrad Exhumed',
    },
  },
  {
    path: '/search/card',
    name: 'Card',
    component: () => import(/* webpackChunkName: "card-detail" */ '../views/CardDetail.vue'),
    meta: {
      title: 'Card Details | Innistrad Exhumed',
    },
  },
  {
    path: '/advanced',
    name: 'Advancd Search',
    component: () => import(/* webpackChunkName: "advanced-search" */ '../views/AdvancedSearch.vue'),
    meta: {
      title: 'Advanced Search | Innistrad Exhumed',
    },
  },
  {
    path: '/search/syntax',
    name: 'Syntax Help',
    component: () => import(/* webpackChunkName: "syntax-help" */ '../views/SyntaxHelp.vue'),
    meta: {
      title: 'Syntax | Innistrad Exhumed',
    },
  },
  {
    path: '/deckbuilder',
    name: 'Deckbuilder',
    component: () => import(/* webpackChunkName: "deckbuilder" */ '../views/Deckbuilder.vue'),
    meta: {
      title: 'Deckbuilder | Innistrad Exhumed',
    },
  },
  {
    path: '/deck',
    name: 'Deck Preview',
    component: () => import(/* webpackChunkName: "deck-preview" */ '../views/SharedDeck.vue'),
    meta: {
      title: 'Deck Preview | Innistrad Exhumed',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error 404',
    component: () => import(/* webpackChunkName: "error404" */ '../views/404.vue'),
    meta: {
      title: 'Not Found | Innistrad Exhumed',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta["title"] as string;
});

export default router;
