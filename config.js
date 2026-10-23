/*
  ================================================================
  观星导航 · 唯一日常编辑入口（config.js）
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
  homepageNotice: '使用教程与相关说明持续更新',

  // ======================== B. 所有外部跳转网址 ========================
  // 只在这里改网址，HTML 里不再直接保存第三方外链地址。
  appDownloadUrl: 'https://yygx.download/', // 首页观星 APP 下载
  introUrl: 'https://scnxd815i94m.feishu.cn/wiki/IKapw2KCfirEb4kKBsbcrr9xnsc', // 初次使用说明
  fullGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/YSwLwVUM5icmxykY2ancqos2nXa', // 完整教程（备用地址）
  trialUrl: 'https://scnxd815i94m.feishu.cn/wiki/Ifgkw3qDtiOIbwkBD5ScJzoCnaf', // 功能介绍与试用
  licenseGuideUrl: 'https://scnxd815i94m.feishu.cn/wiki/W6oXwuNaHiaY0VkIEa1ctIaVnMd', // 授权规则
  manualUrl: 'https://scnxd815i94m.feishu.cn/wiki/DnCmwVpxFiHEz4kJSZ5cpDj4nHf', // 人工代导说明
  faqUrl: 'https://scnxd815i94m.feishu.cn/wiki/W01qwXumRinvU4kfqppcOSHwnxe', // 使用问题完整说明
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
    // 首页弹出的「最新公告」：每次打开网页都会显示（由 A 区开关控制）。
    announcement: {
      kicker: '观星 · 最新消息',
      title: '最新公告',
      line1: '现已停止售卖，此观星导航将正常保留。',
      line2Before: '如需了解后续消息，请关注 ',
      tgButton: 'TG 交流群', // 这几个字仍是可点开的群说明弹窗
      line2After: '。',
      line3: '因游戏更新无法使用，请下滑使用旧安装包或者等待适配',
      confirm: '我知道了',
      hint: '每次打开网页时显示'
    },

    // 交流群三张卡片下方说明，以及点击卡片后的弹窗内容。
    community: {
      qqCard: '无',
      tgCard: '暂不公开',
      internalCard: '打开查看入群说明',
      qqModal: '目前暂无 QQ 交流群入群渠道。',
      tgModal: '暂不公开，有需要的小伙伴自己找人拉一下吧。',
      internalModal: '已有授权用户的 Telegram 内部交流群，付费用户请在 TG 交流群联系机器人“步惊云”入群。'
    },

    // 当前销售暂停：只可改展示文字；店铺按钮保持禁用，不会重新连接购买链接。
    sales: {
      communityNote: '目前暂停新授权购买及预订',
      badge: '暂停购买',
      title: '闲鱼店铺',
      subtitle: '暂停购买',
      notice: '暂停购买，如需使用请签到获取'
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
