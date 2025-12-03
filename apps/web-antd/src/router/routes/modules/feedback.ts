import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:message-square-text',
      order: 30,
      title: $t('page.feedback.title'),
    },
    name: 'Feedback',
    path: '/feedback',
    children: [
      {
        name: 'FeedbackList',
        path: '/feedback/list',
        component: () => import('#/views/feedback/list/index.vue'),
        meta: {
          icon: 'lucide:message-circle',
          title: $t('page.feedback.list'),
        },
      },
    ],
  },
];

export default routes;
