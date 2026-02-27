/* ============================================================
   i18n.js — Language switching engine + all UI translations
   ============================================================ */

const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.home':     'Home',
    'nav.videos':   'Videos',
    'nav.articles': 'Articles',
    'nav.art':      'AI Art',
    'nav.contact':  'Contact',

    // Footer
    'footer.copy': '© 2026 ZettaSort. All rights reserved.',

    // Home
    'home.hero.title':        'Hi, I\'m ZettaSort',
    'home.hero.tagline':      'I explore AI tools and make them feel human — no hype, just honest discovery.',
    'home.hero.yt':           'YouTube',
    'home.hero.xhs':          'Xiaohongshu',
    'home.hero.x':            'X / Twitter',
    'home.latest.videos':     'Latest Videos',
    'home.latest.articles':   'Latest Articles',
    'home.latest.art':        'Latest AI Art',
    'home.seeAll':            'See all →',
    'home.about.name':        'ZettaSort',
    'home.about.bio':         'I create content about AI for curious people — breaking down complex ideas into clear, friendly stories.',

    // Videos page
    'videos.title':    'Videos',
    'videos.subtitle': 'Watch on YouTube or Xiaohongshu',

    // Articles page
    'articles.title':    'Articles',
    'articles.subtitle': 'Thoughts, guides, and honest takes on AI',

    // Article detail
    'article.back':       '← All Articles',
    'article.share':      'Share:',
    'article.copyLink':   'Copy link',
    'article.linkCopied': 'Copied!',
    'article.notFound':   'Article not found.',

    // AI Art page
    'art.title':    'AI Art',
    'art.subtitle': 'Created with AI, curated with care',

    // Contact page
    'contact.title': 'Let\'s Work Together',
    'contact.intro': 'Open to brand collaborations, content licensing, and speaking invitations. Fill in the form and I\'ll get back to you.',
    'contact.form.name':          'Name',
    'contact.form.email':         'Email',
    'contact.form.type':          'Type of Collaboration',
    'contact.form.type.brand':    'Brand Partnership',
    'contact.form.type.license':  'Content Licensing',
    'contact.form.type.speak':    'Speaking Invitation',
    'contact.form.type.other':    'Other',
    'contact.form.message':       'Message',
    'contact.form.submit':        'Send Message',
    'contact.form.submitting':    'Sending…',
    'contact.form.success':       '✓ Thank you! I\'ll be in touch soon.',
    'contact.form.error':         'Something went wrong. Please try again.',

    // Shared
    'load.more':           'Load more',
    'platform.youtube':    'YouTube',
    'platform.xiaohongshu':'Xiaohongshu',
    'platform.x':          'X / Twitter',
  },

  zh: {
    // Navigation
    'nav.home':     '首页',
    'nav.videos':   '视频',
    'nav.articles': '文章',
    'nav.art':      'AI 艺术',
    'nav.contact':  '联系合作',

    // Footer
    'footer.copy': '© 2026 ZettaSort 保留所有权利。',

    // Home
    'home.hero.title':        '你好，我是 ZettaSort',
    'home.hero.tagline':      '我探索 AI 工具，用人话讲给你听。不卖噱头，只有真实发现!',
    'home.hero.yt':           'YouTube',
    'home.hero.xhs':          '小红书',
    'home.hero.x':            'X / Twitter',
    'home.latest.videos':     '最新视频',
    'home.latest.articles':   '最新文章',
    'home.latest.art':        '最新 AI 艺术',
    'home.seeAll':            '查看全部 →',
    'home.about.name':        'ZettaSort',
    'home.about.bio':         '我为好奇的人创作 AI 内容，把复杂的概念拆解成清晰、友好的故事。',

    // Videos page
    'videos.title':    '视频',
    'videos.subtitle': '在 YouTube 或小红书观看',

    // Articles page
    'articles.title':    '文章',
    'articles.subtitle': '关于 AI 的思考、指南与真实观点',

    // Article detail
    'article.back':       '← 返回文章列表',
    'article.share':      '分享：',
    'article.copyLink':   '复制链接',
    'article.linkCopied': '已复制！',
    'article.notFound':   '找不到该文章。',

    // AI Art page
    'art.title':    'AI 艺术',
    'art.subtitle': '用 AI 创作，用心策划',

    // Contact page
    'contact.title': '期待与你合作',
    'contact.intro': '欢迎品牌合作、内容授权、演讲邀约等各种形式的合作。填写表单，我会尽快回复。',
    'contact.form.name':          '姓名',
    'contact.form.email':         '邮箱',
    'contact.form.type':          '合作类型',
    'contact.form.type.brand':    '品牌合作',
    'contact.form.type.license':  '内容授权',
    'contact.form.type.speak':    '演讲邀约',
    'contact.form.type.other':    '其他',
    'contact.form.message':       '留言',
    'contact.form.submit':        '发送消息',
    'contact.form.submitting':    '发送中……',
    'contact.form.success':       '✓ 感谢留言！我会尽快与你联系。',
    'contact.form.error':         '发送失败，请稍后重试。',

    // Shared
    'load.more':           '加载更多',
    'platform.youtube':    'YouTube',
    'platform.xiaohongshu':'小红书',
    'platform.x':          'X / Twitter',
  }
};

/* ── Core API ──────────────────────────────────────────────── */
const I18n = {

  detect() {
    const saved = localStorage.getItem('zs_lang');
    if (saved === 'zh' || saved === 'en') return saved;
    const b = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return b.startsWith('zh') ? 'zh' : 'en';
  },

  current() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  },

  t(key) {
    const lang = I18n.current();
    return (TRANSLATIONS[lang]?.[key]) ?? (TRANSLATIONS['en']?.[key]) ?? key;
  },

  applyDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = I18n.t(key);
    });
    document.documentElement.setAttribute('lang', I18n.current() === 'zh' ? 'zh-CN' : 'en');
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = I18n.current() === 'zh' ? 'EN' : '中文';
  },

  switchTo(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('zs_lang', lang);
    I18n.applyDOM();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  },

  toggle() {
    I18n.switchTo(I18n.current() === 'zh' ? 'en' : 'zh');
  },

  init() {
    const lang = I18n.detect();
    document.documentElement.setAttribute('data-lang', lang);
    I18n.applyDOM();
  }
};
