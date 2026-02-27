/* ============================================================
   content-loader.js — Fetches content from JSON files
   and exposes VIDEOS / ARTICLES / ART as global arrays.

   window.ContentReady is a Promise that resolves when all
   three data files have loaded. main.js awaits it before
   rendering any page.
   ============================================================ */

window.ContentReady = Promise.all([
  fetch('content/videos.json').then(r => r.json()),
  fetch('content/articles.json').then(r => r.json()),
  fetch('content/art.json').then(r => r.json()),
]).then(([vData, aData, artData]) => {

  /* Helper: Decap CMS wraps arrays in { items: [] } */
  function items(data) {
    return Array.isArray(data) ? data : (data.items || []);
  }

  window.VIDEOS = items(vData).map(v => ({
    id:       v.id,
    date:     v.date,
    thumb:    v.thumb || '',
    platform: v.platform,
    url:      v.url,
    en: { title: v.title_en, desc: v.desc_en },
    zh: { title: v.title_zh, desc: v.desc_zh }
  }));

  window.ARTICLES = items(aData).map(a => ({
    id:    a.id,
    date:  a.date,
    thumb: a.thumb || '',
    en: { title: a.title_en, excerpt: a.excerpt_en, body: a.body_en },
    zh: { title: a.title_zh, excerpt: a.excerpt_zh, body: a.body_zh }
  }));

  window.ART = items(artData).map(p => ({
    id:   p.id,
    date: p.date,
    src:  p.src || '',
    en: { title: p.title_en, desc: p.desc_en },
    zh: { title: p.title_zh, desc: p.desc_zh }
  }));

}).catch(err => {
  console.error('[content-loader] Failed to load content:', err);
  window.VIDEOS   = [];
  window.ARTICLES = [];
  window.ART      = [];
});
