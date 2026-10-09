/*
  观星导航 · 日常修改只需要看这个文件。
  1. 修改下面的链接（保留两边的英文单引号）。
  2. 如果以后明确允许恢复售卖，再把 salesPaused 改成 false。
  3. APP 下载地址修改 appDownloadUrl，弹窗提示在 index.html 中修改。
  4. 首页小提示修改 homepageNotice；其他文字在 index.html 中修改。
*/
const SITE_CONFIG = {
  // 【售卖状态】true = 暂停；false = 恢复。恢复前请先确认实际可以售卖。
  salesPaused: true,

  // 【首页小提示】修改引号里的文字即可更新首页说明。
  homepageNotice: '使用教程与相关说明持续更新',

  // 【常用链接】
  appDownloadUrl: 'https://yygx.download/', // 【观星 APP 下载地址】把网址填写在英文单引号中，留空则显示“下载地址待设置”
  introUrl: 'https://scnxd815i94m.feishu.cn/wiki/IKapw2KCfirEb4kKBsbcrr9xnsc', // 初次使用说明
  fullGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/YSwLwVUM5icmxykY2ancqos2nXa', // 完整教程
  storeUrl: 'https://m.tb.cn/h.ja2pSb2?tk=kqMZTqOyXKs', // 闲鱼店铺：暂停购买时仍可打开，便于关注与查看动态
  trialUrl: 'https://scnxd815i94m.feishu.cn/wiki/Ifgkw3qDtiOIbwkBD5ScJzoCnaf', // 02 功能介绍与试用（与初次使用说明独立）
  // QQ 群和内部 TG 群不放直达邀请链接，点击后显示申请说明弹窗。
  telegramUrl: 'https://t.me/yanyu_utils', // TG公开交流群（根据提供的截图）
  licenseGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/W6oXwuNaHiaY0VkIEa1ctIaVnMd', // 03 授权码说明与获取
  manualUrl: 'https://scnxd815i94m.feishu.cn/wiki/DnCmwVpxFiHEz4kJSZ5cpDj4nHf', // 04 人工代导专用入口
  faqUrl: 'https://scnxd815i94m.feishu.cn/wiki/W01qwXumRinvU4kfqppcOSHwnxe', // 05 常见问题完整版

  // 【三个系统的导出教程】每个系统各自配置，人工代导在 manualUrl
  tutorialUrls: {
    android: 'https://scnxd815i94m.feishu.cn/wiki/A1tWw73zBiktGskxMp0csesun02',
    ios: 'https://scnxd815i94m.feishu.cn/wiki/BtYLwNKjhiKExZkoaX8c0VOInjM',
    harmony: 'https://scnxd815i94m.feishu.cn/wiki/AfctwWagMi4xdmkbqVRcm7t5nwe'
  }
};
