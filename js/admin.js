/* ============================================================
   admin.js — ZettaSort Admin Panel Logic
   ============================================================

   PASSWORD: Change ADMIN_PASSWORD below to set your own password.
   ============================================================ */

const ADMIN_PASSWORD = 'lys0508';
const STORAGE_KEY    = 'zs_admin_draft';

/* ── State ──────────────────────────────────────────────────── */
let state = { videos: [], articles: [], art: [] };

/* ── Helpers ─────────────────────────────────────────────────── */
function clone(obj)  { return JSON.parse(JSON.stringify(obj)); }
function today()     { return new Date().toISOString().slice(0, 10); }
function uid(prefix) { return prefix + '-' + Date.now().toString(36); }

/** Escape for HTML attributes and content */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Show a toast notification */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast--hide');
    setTimeout(() => el.remove(), 450);
  }, 2200);
}

/* ── Init ────────────────────────────────────────────────────── */
function init() {
  const draft = localStorage.getItem(STORAGE_KEY);
  if (draft) {
    try { state = JSON.parse(draft); } catch(e) { resetToDefaults(); }
  } else {
    resetToDefaults();
  }
  setupGate();
  setupTabs();
  setupExport();
  setupModal();
  if (sessionStorage.getItem('zs_admin_auth') === '1') showAdmin();
}

function resetToDefaults() {
  state = {
    videos:   clone(typeof VIDEOS   !== 'undefined' ? VIDEOS   : []),
    articles: clone(typeof ARTICLES !== 'undefined' ? ARTICLES : []),
    art:      clone(typeof ART      !== 'undefined' ? ART      : [])
  };
}

/* ── Persist ─────────────────────────────────────────────────── */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ── Gate ────────────────────────────────────────────────────── */
function setupGate() {
  document.getElementById('gateForm').addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('gatePassword').value;
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('zs_admin_auth', '1');
      showAdmin();
    } else {
      document.getElementById('gateError').hidden = false;
      document.getElementById('gatePassword').select();
    }
  });

  document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.removeItem('zs_admin_auth');
    document.getElementById('adminUI').hidden = true;
    document.getElementById('gate').hidden    = false;
    document.getElementById('gatePassword').value = '';
    document.getElementById('gateError').hidden = true;
  });
}

function showAdmin() {
  document.getElementById('gate').hidden    = true;
  document.getElementById('adminUI').hidden = false;
  renderAll();
}

/* ── Tabs ────────────────────────────────────────────────────── */
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('is-active');
    });
  });

  document.getElementById('btnAddVideo').addEventListener('click',   () => openVideoForm(null));
  document.getElementById('btnAddArticle').addEventListener('click', () => openArticleForm(null));
  document.getElementById('btnAddArt').addEventListener('click',     () => openArtForm(null));
}

/* ── Render lists ────────────────────────────────────────────── */
function renderAll() { renderVideos(); renderArticles(); renderArt(); }

function renderVideos() {
  const el = document.getElementById('videoList');
  if (!state.videos.length) { el.innerHTML = '<p class="empty">No videos yet. Click "+ Add Video" to get started.</p>'; return; }
  el.innerHTML = state.videos.map((v, i) => `
    <div class="item-card">
      <div class="item-card__info">
        <strong>${esc(v.en.title)}</strong>
        <span class="item-card__sub">${esc(v.zh.title)} · ${v.date} · ${v.platform}</span>
      </div>
      <div class="item-card__btns">
        <button class="btn-admin btn-admin--sm btn-admin--ghost" onclick="openVideoForm(${i})">Edit</button>
        <button class="btn-admin btn-admin--sm btn-admin--danger" onclick="deleteItem('videos',${i})">Delete</button>
      </div>
    </div>`).join('');
}

function renderArticles() {
  const el = document.getElementById('articleList');
  if (!state.articles.length) { el.innerHTML = '<p class="empty">No articles yet. Click "+ Add Article" to get started.</p>'; return; }
  el.innerHTML = state.articles.map((a, i) => `
    <div class="item-card">
      <div class="item-card__info">
        <strong>${esc(a.en.title)}</strong>
        <span class="item-card__sub">${esc(a.zh.title)} · ${a.date}</span>
      </div>
      <div class="item-card__btns">
        <button class="btn-admin btn-admin--sm btn-admin--ghost" onclick="openArticleForm(${i})">Edit</button>
        <button class="btn-admin btn-admin--sm btn-admin--danger" onclick="deleteItem('articles',${i})">Delete</button>
      </div>
    </div>`).join('');
}

function renderArt() {
  const el = document.getElementById('artList');
  if (!state.art.length) { el.innerHTML = '<p class="empty">No artworks yet. Click "+ Add Artwork" to get started.</p>'; return; }
  el.innerHTML = state.art.map((p, i) => `
    <div class="item-card">
      <div class="item-card__info">
        <strong>${esc(p.en.title)}</strong>
        <span class="item-card__sub">${esc(p.zh.title)} · ${p.date}</span>
      </div>
      <div class="item-card__btns">
        <button class="btn-admin btn-admin--sm btn-admin--ghost" onclick="openArtForm(${i})">Edit</button>
        <button class="btn-admin btn-admin--sm btn-admin--danger" onclick="deleteItem('art',${i})">Delete</button>
      </div>
    </div>`).join('');
}

/* ── Delete ──────────────────────────────────────────────────── */
function deleteItem(type, index) {
  const name = state[type][index]?.en?.title || 'this item';
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  state[type].splice(index, 1);
  saveState();
  renderAll();
  toast('Deleted.');
}

/* ── Video Form ──────────────────────────────────────────────── */
function openVideoForm(index) {
  const isNew = index === null;
  const v = isNew ? {
    id: uid('vid'), date: today(), thumb: '', platform: 'youtube', url: '',
    en: { title: '', desc: '' }, zh: { title: '', desc: '' }
  } : clone(state.videos[index]);

  openModal(isNew ? 'Add Video' : 'Edit Video', `
    <div class="form-grid">
      <div class="form-row">
        <label>Date <input class="f-input" type="date" id="f_date" value="${v.date}"></label>
        <label>Platform
          <select class="f-input" id="f_platform">
            <option value="youtube"      ${v.platform==='youtube'      ?'selected':''}>YouTube</option>
            <option value="xiaohongshu"  ${v.platform==='xiaohongshu'  ?'selected':''}>Xiaohongshu</option>
          </select>
        </label>
      </div>
      <label>Video URL <input class="f-input" id="f_url" value="${esc(v.url)}" placeholder="https://www.youtube.com/watch?v=…"></label>
      <label>Thumbnail path <input class="f-input" id="f_thumb" value="${esc(v.thumb)}" placeholder="assets/images/thumbnails/file.jpg"></label>

      <p class="form-section-label">English</p>
      <label>Title <input class="f-input" id="f_en_title" value="${esc(v.en.title)}" placeholder="Video title"></label>
      <label>Description <textarea class="f-input f-ta" id="f_en_desc" placeholder="Short description">${esc(v.en.desc)}</textarea></label>

      <p class="form-section-label">中文</p>
      <label>标题 <input class="f-input" id="f_zh_title" value="${esc(v.zh.title)}" placeholder="视频标题"></label>
      <label>简介 <textarea class="f-input f-ta" id="f_zh_desc" placeholder="简短介绍">${esc(v.zh.desc)}</textarea></label>

      <div class="modal__footer">
        <button class="btn-admin btn-admin--primary" id="btnSaveForm">Save Video</button>
      </div>
    </div>`);

  document.getElementById('btnSaveForm').addEventListener('click', () => {
    v.date       = document.getElementById('f_date').value;
    v.platform   = document.getElementById('f_platform').value;
    v.url        = document.getElementById('f_url').value.trim();
    v.thumb      = document.getElementById('f_thumb').value.trim();
    v.en.title   = document.getElementById('f_en_title').value.trim();
    v.en.desc    = document.getElementById('f_en_desc').value.trim();
    v.zh.title   = document.getElementById('f_zh_title').value.trim();
    v.zh.desc    = document.getElementById('f_zh_desc').value.trim();
    if (!v.en.title) { alert('English title is required.'); return; }
    if (isNew) state.videos.unshift(v); else state.videos[index] = v;
    saveState(); renderVideos(); closeModal();
    toast(isNew ? 'Video added!' : 'Video saved!');
  });
}

/* ── Article Form ────────────────────────────────────────────── */
function openArticleForm(index) {
  const isNew = index === null;
  const a = isNew ? {
    id: uid('art'), date: today(), thumb: '',
    en: { title: '', excerpt: '', body: '' },
    zh: { title: '', excerpt: '', body: '' }
  } : clone(state.articles[index]);

  openModal(isNew ? 'Add Article' : 'Edit Article', `
    <div class="form-grid">
      <div class="form-row">
        <label>Date <input class="f-input" type="date" id="f_date" value="${a.date}"></label>
        <label>Thumbnail path <input class="f-input" id="f_thumb" value="${esc(a.thumb)}" placeholder="assets/images/thumbnails/file.jpg"></label>
      </div>

      <p class="form-section-label">English</p>
      <label>Title <input class="f-input" id="f_en_title" value="${esc(a.en.title)}" placeholder="Article title"></label>
      <label>Excerpt (shown on card) <textarea class="f-input f-ta" id="f_en_excerpt" placeholder="One or two sentence summary">${esc(a.en.excerpt)}</textarea></label>
      <label>
        Body (Markdown)
        <div class="md-preview-wrap">
          <div class="md-preview-tabs">
            <button type="button" class="md-tab is-active" data-target="en" data-mode="edit">Edit</button>
            <button type="button" class="md-tab"           data-target="en" data-mode="preview">Preview</button>
          </div>
          <textarea class="f-input f-ta f-ta--lg" id="f_en_body" placeholder="Write your article in Markdown…">${esc(a.en.body)}</textarea>
          <div class="md-preview-content" id="f_en_preview" hidden></div>
        </div>
      </label>

      <p class="form-section-label">中文</p>
      <label>标题 <input class="f-input" id="f_zh_title" value="${esc(a.zh.title)}" placeholder="文章标题"></label>
      <label>摘要（显示在卡片上）<textarea class="f-input f-ta" id="f_zh_excerpt" placeholder="一两句话的摘要">${esc(a.zh.excerpt)}</textarea></label>
      <label>
        正文（Markdown）
        <div class="md-preview-wrap">
          <div class="md-preview-tabs">
            <button type="button" class="md-tab is-active" data-target="zh" data-mode="edit">编辑</button>
            <button type="button" class="md-tab"           data-target="zh" data-mode="preview">预览</button>
          </div>
          <textarea class="f-input f-ta f-ta--lg" id="f_zh_body" placeholder="在此用 Markdown 写正文…">${esc(a.zh.body)}</textarea>
          <div class="md-preview-content" id="f_zh_preview" hidden></div>
        </div>
      </label>

      <div class="modal__footer">
        <button class="btn-admin btn-admin--primary" id="btnSaveForm">Save Article</button>
      </div>
    </div>`);

  // Wire up Markdown preview tabs
  document.querySelectorAll('.md-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      const mode   = tab.dataset.mode;
      const ta     = document.getElementById(`f_${target}_body`);
      const prev   = document.getElementById(`f_${target}_preview`);
      // Toggle sibling tabs
      tab.closest('.md-preview-tabs').querySelectorAll('.md-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      if (mode === 'preview') {
        prev.innerHTML = typeof marked !== 'undefined' ? marked.parse(ta.value) : ta.value;
        ta.hidden = true; prev.hidden = false;
      } else {
        ta.hidden = false; prev.hidden = true;
      }
    });
  });

  document.getElementById('btnSaveForm').addEventListener('click', () => {
    a.date       = document.getElementById('f_date').value;
    a.thumb      = document.getElementById('f_thumb').value.trim();
    a.en.title   = document.getElementById('f_en_title').value.trim();
    a.en.excerpt = document.getElementById('f_en_excerpt').value.trim();
    a.en.body    = document.getElementById('f_en_body').value;
    a.zh.title   = document.getElementById('f_zh_title').value.trim();
    a.zh.excerpt = document.getElementById('f_zh_excerpt').value.trim();
    a.zh.body    = document.getElementById('f_zh_body').value;
    if (!a.en.title) { alert('English title is required.'); return; }
    if (isNew) state.articles.unshift(a); else state.articles[index] = a;
    saveState(); renderArticles(); closeModal();
    toast(isNew ? 'Article added!' : 'Article saved!');
  });
}

/* ── Art Form ────────────────────────────────────────────────── */
function openArtForm(index) {
  const isNew = index === null;
  const p = isNew ? {
    id: uid('aart'), date: today(), src: '',
    en: { title: '', desc: '' }, zh: { title: '', desc: '' }
  } : clone(state.art[index]);

  openModal(isNew ? 'Add Artwork' : 'Edit Artwork', `
    <div class="form-grid">
      <div class="form-row">
        <label>Date <input class="f-input" type="date" id="f_date" value="${p.date}"></label>
        <label>Image path <input class="f-input" id="f_src" value="${esc(p.src)}" placeholder="assets/images/art/file.jpg"></label>
      </div>

      <p class="form-section-label">English</p>
      <label>Title <input class="f-input" id="f_en_title" value="${esc(p.en.title)}" placeholder="Artwork title"></label>
      <label>Description (tool + prompt) <textarea class="f-input f-ta" id="f_en_desc" placeholder="Midjourney v6 · Prompt: …">${esc(p.en.desc)}</textarea></label>

      <p class="form-section-label">中文</p>
      <label>标题 <input class="f-input" id="f_zh_title" value="${esc(p.zh.title)}" placeholder="作品名称"></label>
      <label>描述（工具 + 提示词）<textarea class="f-input f-ta" id="f_zh_desc" placeholder="Midjourney v6 · 提示词：…">${esc(p.zh.desc)}</textarea></label>

      <div class="modal__footer">
        <button class="btn-admin btn-admin--primary" id="btnSaveForm">Save Artwork</button>
      </div>
    </div>`);

  document.getElementById('btnSaveForm').addEventListener('click', () => {
    p.date     = document.getElementById('f_date').value;
    p.src      = document.getElementById('f_src').value.trim();
    p.en.title = document.getElementById('f_en_title').value.trim();
    p.en.desc  = document.getElementById('f_en_desc').value.trim();
    p.zh.title = document.getElementById('f_zh_title').value.trim();
    p.zh.desc  = document.getElementById('f_zh_desc').value.trim();
    if (!p.en.title) { alert('English title is required.'); return; }
    if (isNew) state.art.unshift(p); else state.art[index] = p;
    saveState(); renderArt(); closeModal();
    toast(isNew ? 'Artwork added!' : 'Artwork saved!');
  });
}

/* ── Modal ───────────────────────────────────────────────────── */
function setupModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal').hidden) closeModal();
  });
}

function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML    = bodyHTML;
  document.getElementById('modal').hidden           = false;
  document.body.style.overflow = 'hidden';
  // Focus first input
  setTimeout(() => {
    const first = document.querySelector('#modalBody input, #modalBody textarea, #modalBody select');
    if (first) first.focus();
  }, 50);
}

function closeModal() {
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
}

/* ── Export content.js ───────────────────────────────────────── */
function setupExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    const js   = generateContentJS();
    const blob = new Blob([js], { type: 'application/javascript' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'content.js'; a.click();
    URL.revokeObjectURL(url);
    toast('content.js downloaded! Replace the old file to publish.');
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    if (!confirm('Reset to content.js defaults? All unsaved admin edits will be lost.')) return;
    localStorage.removeItem(STORAGE_KEY);
    resetToDefaults();
    renderAll();
    toast('Reset to defaults.');
  });
}

function generateContentJS() {
  /** Escape a string for use inside a JS template literal */
  function tpl(s) {
    return String(s || '')
      .replace(/\\/g, '\\\\')
      .replace(/`/g,  '\\`')
      .replace(/\$\{/g, '\\${');
  }
  function q(s) { return JSON.stringify(s || ''); }

  const vEntries = state.videos.map(v => `  {
    id:       ${q(v.id)},
    date:     ${q(v.date)},
    thumb:    ${q(v.thumb)},
    platform: ${q(v.platform)},
    url:      ${q(v.url)},
    en: {
      title: ${q(v.en.title)},
      desc:  ${q(v.en.desc)},
    },
    zh: {
      title: ${q(v.zh.title)},
      desc:  ${q(v.zh.desc)},
    }
  }`).join(',\n');

  const aEntries = state.articles.map(a => `  {
    id:    ${q(a.id)},
    date:  ${q(a.date)},
    thumb: ${q(a.thumb)},
    en: {
      title:   ${q(a.en.title)},
      excerpt: ${q(a.en.excerpt)},
      body: \`
${tpl(a.en.body)}
      \`
    },
    zh: {
      title:   ${q(a.zh.title)},
      excerpt: ${q(a.zh.excerpt)},
      body: \`
${tpl(a.zh.body)}
      \`
    }
  }`).join(',\n');

  const pEntries = state.art.map(p => `  {
    id:   ${q(p.id)},
    date: ${q(p.date)},
    src:  ${q(p.src)},
    en: {
      title: ${q(p.en.title)},
      desc:  ${q(p.en.desc)},
    },
    zh: {
      title: ${q(p.zh.title)},
      desc:  ${q(p.zh.desc)},
    }
  }`).join(',\n');

  return `/* ============================================================
   content.js — All content data (videos, articles, AI art)
   ============================================================

   Manage content visually: open admin.html in your browser.
   After editing, click "Export content.js" and replace this file.

   ============================================================ */

/* ── Videos ────────────────────────────────────────────────── */
/* platform: 'youtube' | 'xiaohongshu'                         */
const VIDEOS = [
${vEntries}
];

/* ── Articles ───────────────────────────────────────────────── */
/* body: Markdown string. Use ## headings, **bold**, *italic*,  */
/* - list items, > blockquotes.                                 */
const ARTICLES = [
${aEntries}
];

/* ── AI Art ─────────────────────────────────────────────────── */
const ART = [
${pEntries}
];
`;
}

/* ── Boot ────────────────────────────────────────────────────── */
init();
