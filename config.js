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
  storeUrl: 'https://m.tb.cn/h.ja2pSb2?tk=kqMZTqOyXKs', // 闲鱼店铺
  trialUrl: 'https://scnxd815i94m.feishu.cn/wiki/Ifgkw3qDtiOIbwkBD5ScJzoCnaf', // 02 功能介绍与试用（与初次使用说明独立）
  communityUrl: '',       // 交流群入口；留空时显示“待设置”

  // 【三个系统的导出教程】留空时统一打开完整教程
  tutorialUrls: {
    android: '',
    ios: '',
    harmony: ''
  }
};
