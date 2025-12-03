import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:cpu',
      order: 20,
      title: $t('page.device.title'),
    },
    name: 'Device',
    path: '/device',
    children: [
      {
        name: 'ThingModel',
        path: '/device/thing-model',
        component: () => import('#/views/device/thing-model/index.vue'),
        meta: {
          icon: 'lucide:box',
          title: $t('page.device.thingModel'),
        },
      },
      {
        name: 'DeviceModel',
        path: '/device/model',
        component: () => import('#/views/device/model/index.vue'),
        meta: {
          icon: 'lucide:component',
          title: $t('page.device.model'),
        },
      },
      {
        name: 'DeviceList',
        path: '/device/list',
        component: () => import('#/views/device/list/index.vue'),
        meta: {
          icon: 'lucide:server',
          title: $t('page.device.list'),
        },
      },
      {
        name: 'DeviceDetail',
        path: '/device/detail/:id',
        component: () => import('#/views/device/detail/index.vue'),
        meta: {
          hideInMenu: true,
          title: $t('page.device.detail'),
        },
      },
      {
        name: 'DeviceNetwork',
        path: '/device/network',
        component: () => import('#/views/device/network/index.vue'),
        meta: {
          icon: 'lucide:wifi',
          title: $t('page.device.network'),
        },
      },
      {
        name: 'DeviceMessage',
        path: '/device/message',
        component: () => import('#/views/device/message/index.vue'),
        meta: {
          icon: 'lucide:mail',
          title: $t('page.device.message'),
        },
      },
    ],
  },
];

export default routes;
