/*
  ================================================================
  烟雨助手使用指南 · 唯一日常编辑入口（config.js）
  ================================================================
  修改规则：
  1. 所有网址、公告、交流群说明、销售状态文案、旧安装包名称，都在这里改。
  2. 文字和网址只能改英文单引号 '...' 中的内容；英文冒号、逗号、括号别删。
  3. 链接需要以 https:// 开头；某些可选链接留空 '' 会回退到完整教程。
  4. 修改后在 GitHub 点击 Commit changes。若显示旧内容，可 Ctrl+Shift+R。
  5. 页面布局和样式不在这里修改：index.html = 结构，style.css = 外观。
  6. 如要重做图标、插图，修改 assets/ 文件夹；不要随意更改 script.js。
  提示：不要把登录密码、授权码、密钥等私人数据写入本文件，GitHub Pages 是公开的。
*/
const SITE_CONFIG = {
  // ======================== A. 功能开关与首页 ========================
  // true = 每次打开/刷新网页弹窗；false = 不自动弹窗。
  dailyAnnouncementEnabled: true,
  // 首页标题下方绿色圆点后的说明
  homepageNotice: '使用教程持续更新 · 操作说明同步完善',
  // 首页绿色圆点下面第二行：小字号显示，适合放更名、教程更新说明。
  homepageUpdate: '当前软件名称为「烟雨助手」 · 请下载最新版本 APP 使用',

  // ======================== B. 所有外部跳转网址 ========================
  // 只在这里改网址，HTML 里不再直接保存第三方外链地址。
  appDownloadUrl: 'https://download.yyhelper.app/', // 首页烟雨助手 APP 下载
  introUrl: 'https://scnxd815i94m.feishu.cn/wiki/RrA3wUG8ai2EZmkApTVce15mnjc', // 初次使用说明
  fullGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/YSwLwVUM5icmxykY2ancqos2nXa', // 完整教程（备用地址）
  trialUrl: 'https://scnxd815i94m.feishu.cn/wiki/C2hhwrFpIipSTBk0zlEcY5Hknhf', // 2.1 试用说明
  featureNoticeUrl: 'https://scnxd815i94m.feishu.cn/wiki/Ifgkw3qDtiOIbwkBD5ScJzoCnaf', // 04 使用须知
  licenseGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/W6oXwuNaHiaY0VkIEa1ctIaVnMd', // 授权规则
  manualUrl: 'https://scnxd815i94m.feishu.cn/wiki/DnCmwVpxFiHEz4kJSZ5cpDj4nHf', // 人工代导说明
  faqUrl: 'https://scnxd815i94m.feishu.cn/wiki/W01qwXumRinvU4kfqppcOSHwnxe', // 使用问题完整说明
  storeUrl: 'https://m.tb.cn/h.ja2pSb2?tk=kqMZTqOyXKs', // 闲鱼店铺：仅在 02 试用与授权弹窗开放查看（当前暂停购买，可关注）
  legacyPackageUrl: 'https://hcnorqxeoi1e.feishu.cn/wiki/RuHmwmjY3iuQagkHdYGcFTRTn6f', // 页面最底部的「部分渠道旧安装包」
  // QQ、TG 没有直达入口，只使用提示弹窗；这里不保存邀请链接。

  // ======================== C. 常见问题的四个链接 ========================
  // 留空表示自动指向 faqUrl（使用问题完整说明）。
  faqCategoryUrls: {
    download: '', // 下载/安装/更新
    verify: '',   // 授权码验证失败
    export: '',   // 导出存档失败
    usage: ''     // 软件使用问题
  },

  // ======================== D. 设备导出教程链接 ========================
  tutorialUrls: {
    android: 'https://scnxd815i94m.feishu.cn/wiki/A1tWw73zBiktGskxMp0csesun02', // 安卓
    ios: 'https://scnxd815i94m.feishu.cn/wiki/BtYLwNKjhiKExZkoaX8c0VOInjM',     // 苹果
    harmony: 'https://scnxd815i94m.feishu.cn/wiki/AfctwWagMi4xdmkbqVRcm7t5nwe' // 鸿蒙
  },

  // ======================== E. 页面上经常调整的文字 ========================
  editableTexts: {
    // 首页弹出的「教程更新说明」：每次打开网页显示（由 A 区开关控制），不涉及购买状态。
    announcement: {
      kicker: '烟雨助手 · 最新消息',
      title: '教程更新说明',
      line1: '本站使用教程将持续更新',
      line2: '我们将根据软件版本变化，持续完善下载安装、存档导出和常见问题等操作说明。',
      line3: '当前使用的软件为「烟雨助手」，请下载最新版本 APP 使用。',
      confirm: '我知道了',
      hint: '每次打开网页时显示'
    },

    // 交流群三张卡片下方说明，以及点击卡片后的弹窗内容。
    community: {
      qqCard: '无',
      tgCard: '暂不公开',
      internalCard: '打开查看入群说明',
      qqModal: '无 QQ 交流群。',
      tgModal: '暂不公开，有需要的小伙伴自己找群友拉一下吧。',
      internalModal: '已有授权用户的 Telegram 内部交流群，付费用户请在 TG 交流群联系机器人“步惊云”入群。'
    },

    // 暂停购买：02 弹窗保留可点击店铺，用户仍可访问和关注；跳转地址在 B 区 storeUrl 修改。
    sales: {
      entryPrefix: '店铺入口', // 试用与授权弹窗底部的细小入口标签
      entryName: '闲鱼店铺', // 可点击链接的显示名称
      communityNote: '教程与问题说明将持续更新',
      badge: '暂停购买',
      title: '闲鱼店铺',
      subtitle: '暂停购买',
      notice: '当前暂停授权码购买，店铺仍可访问，欢迎先关注。'
    },

    // 页面最下方「其他文件」卡片。真正的跳转地址在 B 区 legacyPackageUrl。
    legacyFiles: {
      heading: '其他文件',
      caption: '历史文件 · 按需查看',
      title: '部分渠道旧安装包',
      description: '查看旧版安装包 · 请确认渠道与版本'
    }
  }
};
