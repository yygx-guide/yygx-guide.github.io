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
  // 首页「最新通知」默认展开，显示最新2条，其余自动归入「历史公告」。

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
  storeUrl: 'https://m.tb.cn/h.ja2pSb2?tk=kqMZTqOyXKs', // 闲鱼店铺：仅在 02 试用与授权弹窗开放购买（首页不单独放购买按钮）
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
    // 首页「最新通知」：现在仅发布两条。最新2条显示在首页，第3条起自动进入历史公告。
    // date = 日期；title = 标题；body = 正文，可直接编辑反引号 `...` 内的多行文字。
    // 下一次有新消息时，在 items 数组最前面复制新增一条，旧消息会自动归入历史。
    bulletin: {
      title: '最新通知',
      items: [
        {
          date: '2026.11.05',
          title: '后续功能展望',
          body: `整理了一些后续可能推出或优化的功能方向，供大家参考：

1. 鬼市、恒山弟子相关功能
2. 打虎、打熊战斗序列推演（可能包含技能释放，但实际效果尚不确定）
3. 烟雨衣橱（主角捏脸、发型、时装及随从时装预览）
4. 现有功能的持续优化
5. 副本掉落矫正
6. 任务追踪功能（目前仅为设想，不保证能够实现）

以上仅为后续可能的更新方向，并非确定的开发或上线安排。具体功能能否实现、最终效果、上线时间及先后顺序均存在不确定性，后续也可能调整或取消。

目前没有可确认的具体时间安排，暂无法提供进一步答复，请以实际更新为准。`
        },
        {
          date: '2026.11.01',
          title: '软件更名与教程更新',
          body: `目前使用的软件已更名为「烟雨助手」，请通过导航下载最新版本 APP。

本站将持续整理和完善相关使用教程，包括下载安装、存档导出、功能使用及常见问题等内容。随着软件版本变化，部分操作方式可能调整，请以导航中的最新说明为准。`
        }
      ]
    },

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

    // 已恢复购买：02 弹窗店铺可点击购买；跳转地址在 B 区 storeUrl 修改。
    sales: {
      entryPrefix: '店铺入口', // 试用与授权弹窗底部的细小入口标签
      entryName: '闲鱼店铺', // 可点击链接的显示名称
      communityNote: '教程与问题说明将持续更新',
      badge: '开放购买',
      title: '闲鱼店铺',
      subtitle: '开放购买',
      notice: '授权码已恢复购买，可点击闲鱼店铺查看详情。'
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
