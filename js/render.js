/* ============================================================
   render.js — DOM rendering functions
   ============================================================ */

/* SVG placeholder shown when no thumbnail/image is provided   */
function placeholderSVG(label) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect fill='%23e0d8ce' width='400' height='225'/%3E%3Ctext fill='%237a6e65' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;
}

function squarePlaceholderSVG(label) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23e0d8ce' width='400' height='400'/%3E%3Ctext fill='%237a6e65' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;
}

const Render = {

  /* Format date for display */
  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (I18n.current() === 'zh') {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  /* ── Video card ──────────────────────────────────────────── */
  videoCard(video) {
    const lang = I18n.current();
    const thumb = video.thumb || placeholderSVG(video[lang].title);
    const platformLabel = I18n.t(`platform.${video.platform}`);
    return `
      <article class="card">
        <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="card__thumb"
           aria-label="${video[lang].title}">
          <img src="${thumb}" alt="${video[lang].title}" loading="lazy">
        </a>
        <div class="card__body">
          <p class="card__date">${Render.formatDate(video.date)}</p>
          <h3 class="card__title">
            <a href="${video.url}" target="_blank" rel="noopener noreferrer">
              ${video[lang].title}
            </a>
          </h3>
          <p class="card__desc">${video[lang].desc}</p>
          <span class="card__platform">${platformLabel}</span>
        </div>
      </article>`;
  },

  /* ── Article card ────────────────────────────────────────── */
  articleCard(article) {
    const lang  = I18n.current();
    const thumb = article.thumb;
    const thumbHTML = thumb
      ? `<a href="article.html?id=${article.id}" class="card__thumb" aria-label="${article[lang].title}">
           <img src="${thumb}" alt="${article[lang].title}" loading="lazy">
         </a>`
      : '';
    return `
      <article class="card${thumb ? '' : ' card--text'}">
        ${thumbHTML}
        <div class="card__body">
          <p class="card__date">${Render.formatDate(article.date)}</p>
          <h3 class="card__title">
            <a href="article.html?id=${article.id}">${article[lang].title}</a>
          </h3>
          <p class="card__desc">${article[lang].excerpt}</p>
        </div>
      </article>`;
  },

  /* ── Art tile ────────────────────────────────────────────── */
  artTile(piece, index) {
    const lang = I18n.current();
    const src = piece.src || squarePlaceholderSVG(piece[lang].title);
    return `
      <div class="art-item">
        <div class="art-tile" data-art-index="${index}" role="button"
             tabindex="0" aria-label="${piece[lang].title}">
          <img src="${src}" alt="${piece[lang].title}" loading="lazy">
          <div class="art-tile__overlay" aria-hidden="true">
            <span class="art-tile__title">${piece[lang].title}</span>
          </div>
        </div>
        <p class="art-item__caption">${piece[lang].title}</p>
      </div>`;
  },

  /* ── Render list into a container ───────────────────────── */
  list(items, selector, renderFn) {
    const el = document.querySelector(selector);
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = '<p class="empty-state">No content yet — check back soon!</p>';
      return;
    }
    el.innerHTML = items.map((item, i) => renderFn(item, i)).join('');
  },

  /* ── Re-render all dynamic content ──────────────────────── */
  refresh() {
    const page = document.body.getAttribute('data-page');
    if (page && Pages[page] && Pages[page].render) {
      Pages[page].render();
    }
  }
};
