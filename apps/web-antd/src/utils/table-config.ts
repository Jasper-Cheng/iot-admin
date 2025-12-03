import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/**
 * 默认表格配置
 */
export const defaultGridOptions: Partial<VxeTableGridOptions> = {
  height: 'auto',
  keepSource: true,
  rowConfig: {
    keyField: 'id',
  },
  toolbarConfig: {
    refresh: true,
    search: true,
    zoom: true,
  },
};

/**
 * 带导出功能的表格配置
 */
export const exportableGridOptions: Partial<VxeTableGridOptions> = {
  ...defaultGridOptions,
  toolbarConfig: {
    ...defaultGridOptions.toolbarConfig,
    export: true,
  },
};

/**
 * 带自定义工具栏的表格配置
 */
export const customToolbarGridOptions: Partial<VxeTableGridOptions> = {
  ...defaultGridOptions,
  toolbarConfig: {
    ...defaultGridOptions.toolbarConfig,
    custom: true,
    export: false,
  },
};

/**
 * 状态标签颜色映射
 */
export const statusColorMap = {
  // 通用状态
  active: 'success',
  inactive: 'default',
  disabled: 'default',
  enabled: 'success',

  // 设备状态
  online: 'success',
  offline: 'default',
  fault: 'error',

  // 发布状态
  draft: 'default',
  published: 'success',

  // 处理状态
  pending: 'default',
  processing: 'processing',
  resolved: 'success',

  // 消息级别
  info: 'blue',
  warning: 'orange',
  error: 'red',
};

/**
 * 获取状态标签颜色
 */
export function getStatusColor(status: string): string {
  return statusColorMap[status as keyof typeof statusColorMap] || 'default';
}

/**
 * 通用表单搜索配置
 */
export const defaultFormOptions = {
  submitOnChange: true,
};

/**
 * 带时间范围映射的表单配置
 */
export function createTimeRangeFormOptions(
  fieldName: string,
  startField: string,
  endField: string,
) {
  return {
    ...defaultFormOptions,
    fieldMappingTime: [[fieldName, [startField, endField]]],
  };
}
