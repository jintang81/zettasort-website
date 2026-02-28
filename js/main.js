/* ============================================================
   main.js — App entry point, global nav, page modules
   ============================================================ */

/* ── Skeleton cards: shown immediately while JSON loads ────── */
(function insertSkeletons() {
  var page = document.body.getAttribute('data-page');
  function cardSkel() {
    return '<div class="card card--skeleton" aria-hidden="true">' +
      '<div class="card__thumb skeleton-shimmer"></div>' +
      '<div class="card__body">' +
        '<div class="skeleton-line skeleton-line--short skeleton-shimmer"></div>' +
        '<div class="skeleton-line skeleton-line--long skeleton-shimmer"></div>' +
        '<div class="skeleton-line skeleton-line--med skeleton-shimmer"></div>' +
      '</div></div>';
  }
  function artSkel() {
    return '<div class="art-item" aria-hidden="true">' +
      '<div class="art-tile skeleton-shimmer"></div>' +
      '</div>';
  }
  function fill(id, fn, n) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = Array.from({ length: n }, fn).join('');
  }
  if (page === 'home') {
    fill('homeVideos',   cardSkel, 2);
    fill('homeArticles', cardSkel, 2);
    fill('homeArt',      artSkel,  3);
  } else if (page === 'videos') {
    fill('videosList',   cardSkel, 4);
  } else if (page === 'articles') {
    fill('articlesList', cardSkel, 4);
  } else if (page === 'art') {
    fill('artGrid',      artSkel,  6);
  }
})();

/* ── Global: init language ─────────────────────────────────── */
I18n.init();

/* ── Global: language toggle button ───────────────────────── */
document.getElementById('langToggle')
  ?.addEventListener('click', () => I18n.toggle());

/* ── Global: hamburger menu ────────────────────────────────── */
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    hamburger?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

/* ── Global: active nav link ───────────────────────────────── */
(function markActiveLink() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    // article.html detail page → highlight 'Articles' link
    const isArticleDetail = file === 'article.html' && href === 'articles.html';
    if (href === file || isArticleDetail) {
      a.classList.add('is-active');
    }
  });
})();

/* ── Global: re-render content on lang change ──────────────── */
document.addEventListener('langchange', async () => {
  /* Wait for JSON content to be ready before re-rendering */
  if (window.ContentReady) await window.ContentReady;
  Render.refresh();
});

/* ============================================================
   Page modules
   Each module has init() and optionally render().
   The data-page attribute on <body> routes to the right one.
   ============================================================ */

const Pages = {

  /* ── Home ────────────────────────────────────────────────── */
  home: {
    init() { this.render(); },
    render() {
      Render.list(VIDEOS.slice(0, 2),   '#homeVideos',   v    => Render.videoCard(v));
      Render.list(ARTICLES.slice(0, 2), '#homeArticles', a    => Render.articleCard(a));
      Render.list(ART.slice(0, 3),      '#homeArt',      (p,i)=> Render.artTile(p, i));
      // Re-bind art tile clicks after re-render
      Pages.home._bindArtTiles();
    },
    _bindArtTiles() {
      document.querySelectorAll('#homeArt .art-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          // Navigate to art page for full gallery
          location.href = 'art.html';
        });
      });
    }
  },

  /* ── Videos ──────────────────────────────────────────────── */
  videos: {
    PAGE_SIZE: 10,
    shown: 0,
    init() {
      this.shown = 0;
      this.render(true);
      document.getElementById('videosLoadMore')
        ?.addEventListener('click', () => this.loadMore());
      document.addEventListener('langchange', () => {
        this.shown = 0;
        this.render(true);
      });
    },
    render() {
      const slice = VIDEOS.slice(0, this.shown + this.PAGE_SIZE);
      Render.list(slice, '#videosList', v => Render.videoCard(v));
      const btn = document.getElementById('videosLoadMore');
      if (btn) btn.hidden = (this.shown + this.PAGE_SIZE) >= VIDEOS.length;
    },
    loadMore() {
      this.shown += this.PAGE_SIZE;
      this.render();
    }
  },

  /* ── Articles ────────────────────────────────────────────── */
  articles: {
    PAGE_SIZE: 10,
    shown: 0,
    init() {
      this.shown = 0;
      this.render(true);
      document.getElementById('articlesLoadMore')
        ?.addEventListener('click', () => this.loadMore());
      document.addEventListener('langchange', () => {
        this.shown = 0;
        this.render(true);
      });
    },
    render() {
      const slice = ARTICLES.slice(0, this.shown + this.PAGE_SIZE);
      Render.list(slice, '#articlesList', a => Render.articleCard(a));
      const btn = document.getElementById('articlesLoadMore');
      if (btn) btn.hidden = (this.shown + this.PAGE_SIZE) >= ARTICLES.length;
    },
    loadMore() {
      this.shown += this.PAGE_SIZE;
      this.render();
    }
  },

  /* ── Article Detail ──────────────────────────────────────── */
  'article-detail': {
    article: null,
    init() {
      const id = new URLSearchParams(location.search).get('id');
      this.article = ARTICLES.find(a => a.id === id) || null;
      if (!this.article) {
        document.getElementById('articleTitle').textContent = I18n.t('article.notFound');
        return;
      }
      this.render();
      this._initShare();
      document.addEventListener('langchange', () => this.render());
    },
    render() {
      const lang = I18n.current();
      const a    = this.article;
      const titleEl = document.getElementById('articleTitle');
      const dateEl  = document.getElementById('articleDate');
      const bodyEl  = document.getElementById('articleBody');
      if (titleEl) titleEl.textContent = a[lang].title;
      if (dateEl)  dateEl.textContent  = Render.formatDate(a.date);
      if (bodyEl)  bodyEl.innerHTML    = marked.parse(a[lang].body);
      document.title = `${a[lang].title} — ZettaSort`;
    },
    _initShare() {
      document.getElementById('shareX')?.addEventListener('click', () => {
        const lang = I18n.current();
        const text = encodeURIComponent(this.article[lang].title);
        const url  = encodeURIComponent(location.href);
        window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      });
      const copyBtn = document.getElementById('copyLink');
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(location.href).then(() => {
          copyBtn.textContent = I18n.t('article.linkCopied');
          setTimeout(() => { copyBtn.textContent = I18n.t('article.copyLink'); }, 2000);
        });
      });
    }
  },

  /* ── AI Art ──────────────────────────────────────────────── */
  art: {
    currentIndex: 0,
    init() {
      this.render();
      this._initLightbox();
      document.addEventListener('langchange', () => {
        this.render();
        // Update lightbox caption if open
        if (!document.getElementById('lightbox').hidden) {
          this._updateLightboxContent();
        }
      });
    },
    render() {
      Render.list(ART, '#artGrid', (p, i) => Render.artTile(p, i));
      this._bindTiles();
    },
    _bindTiles() {
      document.querySelectorAll('.art-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          this._openLightbox(Number(tile.dataset.artIndex));
        });
        tile.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._openLightbox(Number(tile.dataset.artIndex));
          }
        });
      });
    },
    _openLightbox(index) {
      this.currentIndex = index;
      this._updateLightboxContent();
      document.getElementById('lightbox').hidden = false;
      document.body.style.overflow = 'hidden';
      document.getElementById('lightboxClose').focus();
    },
    _closeLightbox() {
      document.getElementById('lightbox').hidden = true;
      document.body.style.overflow = '';
    },
    _updateLightboxContent() {
      const piece = ART[this.currentIndex];
      const lang  = I18n.current();
      const img   = document.getElementById('lightboxImg');
      const src   = piece.src || squarePlaceholderSVG(piece[lang].title);
      if (img) { img.src = src; img.alt = piece[lang].title; }
      const titleEl = document.getElementById('lightboxTitle');
      const descEl  = document.getElementById('lightboxDesc');
      if (titleEl) titleEl.textContent = piece[lang].title;
      if (descEl)  descEl.textContent  = piece[lang].desc;
    },
    _initLightbox() {
      const lb = document.getElementById('lightbox');

      document.getElementById('lightboxClose')
        ?.addEventListener('click', () => this._closeLightbox());

      document.getElementById('lightboxPrev')
        ?.addEventListener('click', () => {
          this.currentIndex = (this.currentIndex - 1 + ART.length) % ART.length;
          this._updateLightboxContent();
        });

      document.getElementById('lightboxNext')
        ?.addEventListener('click', () => {
          this.currentIndex = (this.currentIndex + 1) % ART.length;
          this._updateLightboxContent();
        });

      // Close on backdrop click
      lb?.addEventListener('click', e => {
        if (e.target === lb) this._closeLightbox();
      });

      // Keyboard navigation
      document.addEventListener('keydown', e => {
        if (lb?.hidden) return;
        if (e.key === 'Escape')     this._closeLightbox();
        if (e.key === 'ArrowLeft')  {
          this.currentIndex = (this.currentIndex - 1 + ART.length) % ART.length;
          this._updateLightboxContent();
        }
        if (e.key === 'ArrowRight') {
          this.currentIndex = (this.currentIndex + 1) % ART.length;
          this._updateLightboxContent();
        }
      });
    }
  },

  /* ── Contact ─────────────────────────────────────────────── */
  contact: {
    init() { this._initForm(); },
    _initForm() {
      const form = document.getElementById('contactForm');
      if (!form) return;
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn     = form.querySelector('[type="submit"]');
        const success = document.getElementById('formSuccess');
        const error   = document.getElementById('formError');

        btn.disabled     = true;
        btn.textContent  = I18n.t('contact.form.submitting');
        if (success) success.hidden = true;
        if (error)   error.hidden   = true;

        try {
          const res = await fetch(form.action, {
            method:  'POST',
            body:    new FormData(form),
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            form.reset();
            if (success) success.hidden = false;
          } else {
            throw new Error('Non-OK response');
          }
        } catch (_) {
          if (error) error.hidden = false;
          btn.disabled    = false;
          btn.textContent = I18n.t('contact.form.submit');
        }
      });
    }
  }
};

/* ── Boot the current page ─────────────────────────────────── */
(async function boot() {
  /* Wait for JSON content files to load (content-loader.js) */
  if (window.ContentReady) await window.ContentReady;
  const page = document.body.getAttribute('data-page');
  if (page && Pages[page]) {
    Pages[page].init();
  }
})();
