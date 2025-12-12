import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image, Space } from 'ant-design-vue';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        const avatarValue = row[column.field];
        // 如果头像值为空，显示默认头像
        const hasAvatar = avatarValue && avatarValue.trim();
        const avatarSrc = hasAvatar ? avatarValue : '/avatars/no-avatar.png';
        // 没有头像时显示小一点
        const size = hasAvatar ? '32px' : '24px';
        return h('div', {
          style: { 'margin-top': '4px', display: 'inline-block' },
        }, [
          h(Image, {
            src: avatarSrc,
            style: { width: size, height: size, 'object-fit': 'cover', 'border-radius': '50%' },
            preview: false, // 禁用预览功能
            fallback: '/avatars/no-avatar.png', // 加载失败时显示默认头像
          }),
        ]);
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellOperation' },
    vxeUI.renderer.add('CellOperation', {
      renderTableDefault(renderOpts, params) {
        const { attrs } = renderOpts;
        const { row } = params;
        const { actions = [], onClick } = attrs || {};

        if (!actions || actions.length === 0) {
          return '';
        }

        const buttons = actions.map((action: string) => {
          const buttonText: Record<string, string> = {
            view: '查看',
            edit: '编辑',
            delete: '删除',
            reply: '回复',
          };

          const isDelete = action === 'delete';

          return h(
            Button,
            {
              size: 'small',
              type: 'link',
              danger: isDelete,
              onClick: () => {
                if (onClick) {
                  onClick({ code: action, row });
                }
              },
            },
            { default: () => buttonText[action] || action },
          );
        });

        return h(Space, { size: 'small' }, () => buttons);
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
