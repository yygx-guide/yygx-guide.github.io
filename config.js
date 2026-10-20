/*
  观星导航 · 日常修改只需要看这个文件。
  1. 修改下面的链接（保留两边的英文单引号）。
  2. 店铺购买入口已停用；页面仅保留使用说明与教程。
  3. APP 下载地址修改 appDownloadUrl，弹窗提示在 index.html 中修改。
  4. 首页小提示修改 homepageNotice；其他文字在 index.html 中修改。
*/
const SITE_CONFIG = {
  // 【每日公告】true = 开启（同一浏览器每天首次访问弹出）；false = 关闭。
  dailyAnnouncementEnabled: true,

  // 【首页小提示】修改引号里的文字即可更新首页说明。
  homepageNotice: '使用教程与相关说明持续更新',

  // 【常用链接】
  appDownloadUrl: 'https://yygx.download/', // 【观星 APP 下载地址】把网址填写在英文单引号中，留空则显示“下载地址待设置”
  introUrl: 'https://scnxd815i94m.feishu.cn/wiki/IKapw2KCfirEb4kKBsbcrr9xnsc', // 初次使用说明
  fullGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/YSwLwVUM5icmxykY2ancqos2nXa', // 完整教程
  trialUrl: 'https://scnxd815i94m.feishu.cn/wiki/Ifgkw3qDtiOIbwkBD5ScJzoCnaf', // 02 功能介绍与试用（与初次使用说明独立）
  // TG 交流群入口已改为提示弹窗，不再保留群组直达链接。
  licenseGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/W6oXwuNaHiaY0VkIEa1ctIaVnMd', // 03 授权码说明与获取
  manualUrl: 'https://scnxd815i94m.feishu.cn/wiki/DnCmwVpxFiHEz4kJSZ5cpDj4nHf', // 04 人工代导专用入口
  faqUrl: 'https://scnxd815i94m.feishu.cn/wiki/W01qwXumRinvU4kfqppcOSHwnxe', // 05 使用问题完整说明

  // 【使用问题的四个目录链接】留空则自动打开上面的 faqUrl。
  // 如果以后拿到飞书文档各章节的直接链接，填到对应引号里即可跳到相应章节。
  faqCategoryUrls: {
    download: '', // 下载 / 安装 / 更新
    verify: '',   // 授权码验证失败
    export: '',   // 导出存档失败
    usage: ''     // 软件使用问题
  },

  // 【三个系统的导出教程】每个系统各自配置，人工代导在 manualUrl
  tutorialUrls: {
    android: 'https://scnxd815i94m.feishu.cn/wiki/A1tWw73zBiktGskxMp0csesun02',
    ios: 'https://scnxd815i94m.feishu.cn/wiki/BtYLwNKjhiKExZkoaX8c0VOInjM',
    harmony: 'https://scnxd815i94m.feishu.cn/wiki/AfctwWagMi4xdmkbqVRcm7t5nwe'
  }
};
