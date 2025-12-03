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
      {
        name: 'MemberList',
        path: '/account/members',
        component: () => import('#/views/account/members/index.vue'),
        meta: {
          icon: 'lucide:user-check',
          title: $t('page.account.members'),
        },
      },
      {
        name: 'OperationLog',
        path: '/account/logs',
        component: () => import('#/views/account/logs/index.vue'),
        meta: {
          icon: 'lucide:file-clock',
          title: $t('page.account.logs'),
        },
      },
    ],
  },
];

export default routes;
