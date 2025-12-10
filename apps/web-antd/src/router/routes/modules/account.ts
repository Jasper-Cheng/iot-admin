import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:users',
      order: 10,
      title: $t('page.account.title'),
    },
    name: 'Account',
    path: '/account',
    children: [
      {
        name: 'AccountList',
        path: '/account/list',
        component: () => import('#/views/account/list/index.vue'),
        meta: {
          icon: 'lucide:user-cog',
          title: $t('page.account.list'),
        },
      },
      {
        name: 'UserList',
        path: '/account/users',
        component: () => import('#/views/account/users/index.vue'),
        meta: {
          icon: 'lucide:users-round',
          title: $t('page.account.users'),
        },
      },
    ],
  },
];

export default routes;
