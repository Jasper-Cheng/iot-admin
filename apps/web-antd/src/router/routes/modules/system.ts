import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 40,
      title: $t('page.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'FamilyManage',
        path: '/system/family',
        component: () => import('#/views/system/family/index.vue'),
        meta: {
          icon: 'lucide:users-round',
          title: $t('page.system.family'),
        },
      },
      {
        name: 'NoticeManage',
        path: '/system/notice',
        component: () => import('#/views/system/notice/index.vue'),
        meta: {
          icon: 'lucide:bell',
          title: $t('page.system.notice'),
        },
      },
      {
        name: 'VersionManage',
        path: '/system/version',
        component: () => import('#/views/system/version/index.vue'),
        meta: {
          icon: 'lucide:git-branch',
          title: $t('page.system.version'),
        },
      },
    ],
  },
];

export default routes;
