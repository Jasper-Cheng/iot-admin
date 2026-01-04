import { usePageResponseSuccess } from '../../../utils/response';

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page ? String(query.page) : '1';
  const pageSize = query.pageSize ? String(query.pageSize) : '10';
  // 返回空数组，真实数据应从真实后端获取
  return usePageResponseSuccess(page, pageSize, []);
});
