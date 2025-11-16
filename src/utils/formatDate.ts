export const formatDate = (value: string) => {
  // 后端时间格式为 "YYYY-MM-DD HH:mm:ss"。Safari 不支持空格分隔的日期，需要转成 ISO 形态。
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
