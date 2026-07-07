#!/usr/bin/env node
/*
 * build-portfolio.js
 * Regenerates the project sections and lightboxes in portfolio.html
 * from portfolio-data.json. The CMA section layout is the golden
 * template; this script stamps it out per project. It only rewrites
 * the regions between the PROJECTS:START/END and LIGHTBOXES:START/END
 * marker comments. All CSS is untouched.
 *
 * Usage: node build-portfolio.js [--check]
 *   --check  report what would change without writing.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HTML_FILE = path.join(ROOT, 'portfolio.html');
const DATA_FILE = path.join(ROOT, 'portfolio-data.json');
const IMG_PREFIX = 'images/shaynesdesigns-shaynes-designs-portfolio-';

const EXPAND_SVG = '<svg viewBox="0 0 24 24" stroke-width="2" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
const VISIT_SVG = '<svg viewBox="0 0 24 24" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';
const ARROW_SVG = '<svg viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const OPEN_SVG = '<svg viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" style="width:11px;height:11px"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';
const OPEN_SVG_LG = '<svg viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" style="width:12px;height:12px"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';

function img(p, slot, ext) {
  // Explicit override in JSON wins, else naming convention.
  if (p.images && p.images[slot]) return p.images[slot];
  return IMG_PREFIX + p.slug + '-' + slot + '.' + ext;
}

function checkImages(p) {
  const missing = [];
  const wanted = [
    img(p, 'hero', 'webp'),
    img(p, 'fullpage-top', 'jpg'),
    img(p, 'fullpage-bottom', 'jpg'),
    img(p, 'fullpage', 'jpg'),
    img(p, 'shot-hero', 'jpg'),
    img(p, 'shot-content', 'jpg')
  ];
  for (const w of wanted) {
    if (!fs.existsSync(path.join(ROOT, w))) missing.push(w);
  }
  return missing;
}

function projectHtml(p, index) {
  const num = String(index + 1).padStart(2, '0');
  const shotW = (p.shotDims || [1440, 900])[0];
  const shotH = (p.shotDims || [1440, 900])[1];
  const ftDims = p.fullTopDims || [1440, 3574];
  const fbDims = p.fullBottomDims || ftDims;
  return `
    <!-- =============================================
         PROJECT ${num} — ${p.ariaName.toUpperCase()}  (generated)
         ============================================= -->
    <article class="project" id="proj-${p.slug}" aria-label="${p.ariaName} project">

      <div class="project-bg" aria-hidden="true"></div>
      <div class="project-bg-img" style="background-image:url('${img(p, 'hero', 'webp')}')" aria-hidden="true"></div>
      <div class="project-bg-overlay" style="background:${p.overlay}" aria-hidden="true"></div>

      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right, ${p.accent}, ${hexAlpha(p.accent, 0.2)}, transparent);z-index:10" aria-hidden="true"></div>

      <div class="project-inner">
        <div class="panel-top" role="button" tabindex="0" aria-label="View full page" data-lightbox="${p.slug}-full" data-lightbox-mobile="${p.slug}-full-top" data-cursor-label="EXPAND">
          <img src="${img(p, 'fullpage-top', 'jpg')}" alt="${p.ariaName} — top half" width="${ftDims[0]}" height="${ftDims[1]}" loading="${index === 0 ? 'eager' : 'lazy'}">
        </div>
        <div class="panel-bottom" role="button" tabindex="0" aria-label="View full page" data-lightbox="${p.slug}-full" data-lightbox-mobile="${p.slug}-full-bottom" data-cursor-label="EXPAND">
          <img src="${img(p, 'fullpage-bottom', 'jpg')}" alt="${p.ariaName} — bottom half" width="${fbDims[0]}" height="${fbDims[1]}" loading="${index === 0 ? 'eager' : 'lazy'}">
        </div>

        <div class="shot shot-above" role="button" tabindex="0" aria-label="Expand hero screenshot" data-lightbox="${p.slug}-hero" data-lightbox-mobile="none" data-cursor-label="EXPAND">
          <img src="${img(p, 'shot-hero', 'jpg')}" alt="${p.ariaName} — hero" width="${shotW}" height="${shotH}" loading="${index === 0 ? 'eager' : 'lazy'}">
          <div class="shot-overlay" aria-hidden="true"><div class="shot-expand">${EXPAND_SVG}Expand</div></div>
        </div>

        <div class="shot shot-below" role="button" tabindex="0" aria-label="Expand content screenshot" data-lightbox="${p.slug}-content" data-lightbox-mobile="none" data-cursor-label="EXPAND">
          <img src="${img(p, 'shot-content', 'jpg')}" alt="${p.ariaName} — content" width="${shotW}" height="${shotH}" loading="${index === 0 ? 'eager' : 'lazy'}">
          <div class="shot-overlay" aria-hidden="true"><div class="shot-expand">${EXPAND_SVG}Expand</div></div>
        </div>

        <div class="project-layout">
          <div class="project-info">
            <div class="project-num reveal" aria-hidden="true">${num}</div>

            <div class="project-category reveal reveal-delay-1" style="color:${p.accent}">
              <span style="background:${p.accent};display:inline-block;width:1.5rem;height:1px"></span>
              ${p.category}
            </div>

            <h2 class="project-name reveal reveal-delay-1">${p.nameHtml}</h2>

            <p class="project-desc reveal reveal-delay-2">
              ${p.desc}
            </p>

            <div class="project-tags reveal reveal-delay-2">
${p.tags.map(t => '              <span class="project-tag">' + t + '</span>').join('\n')}
            </div>

            <div class="project-actions reveal reveal-delay-3">
              <a href="${p.url}" target="_blank" rel="noopener" class="btn-visit" style="background:${p.accent};color:${p.accentText}">
                Visit Site
                ${VISIT_SVG}
              </a>
              <a href="${p.url}" target="_blank" rel="noopener" class="btn-ghost">
                Full Page Preview
                ${ARROW_SVG}
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
`;
}

function lightboxHtml(p) {
  const shotW = (p.shotDims || [1440, 900])[0];
  const shotH = (p.shotDims || [1440, 900])[1];
  const fullDims = p.fullDims || [1440, 7479];
  const visitBtn = `<a href="${p.url}" target="_blank" rel="noopener" class="btn-visit" style="background:${p.accent};color:${p.accentText};font-size:.7rem;padding:.5rem 1.25rem">Open live site ${OPEN_SVG}</a>`;
  const visitBtnLg = `<a href="${p.url}" target="_blank" rel="noopener" class="btn-visit" style="background:${p.accent};color:${p.accentText};font-size:.7rem;padding:.625rem 1.25rem"> Open live site ${OPEN_SVG_LG}</a>`;
  function box(id, label, body, footer) {
    const closeLabel = label === 'full page' ? 'Close preview' : 'Close';
    return `
  <div class="lightbox" id="lightbox-${id}" role="dialog" aria-modal="true" aria-label="${p.ariaName} — ${label}" hidden>
    <div class="lightbox-backdrop" aria-hidden="true"></div>
    <div class="lightbox-panel">
      <div class="lightbox-header">
        <span class="lightbox-header-title">${p.displayUrl}${label === 'full page' ? ' — Full page' : ''}</span>
        <button class="lightbox-close" aria-label="${closeLabel}">&#x2715;</button>
      </div>
      <div class="lightbox-body">${body}</div>
      <div class="lightbox-footer">${footer}</div>
    </div>
  </div>
`;
  }
  return (
    box(p.slug + '-hero', 'hero',
      `<img src="${img(p, 'shot-hero', 'jpg')}" alt="${p.ariaName} — hero" width="${shotW}" height="${shotH}" loading="lazy">`,
      visitBtn) +
    box(p.slug + '-content', 'content',
      `<img src="${img(p, 'shot-content', 'jpg')}" alt="${p.ariaName} — content" width="${shotW}" height="${shotH}" loading="lazy">`,
      visitBtn) +
    box(p.slug + '-full', 'full page',
      `<img src="${img(p, 'fullpage', 'jpg')}" alt="${p.ariaName} — full website from hero to footer" width="${fullDims[0]}" height="${fullDims[1]}" loading="lazy">`,
      `<span class="lightbox-footer-label">Scroll to explore the full page</span>${visitBtnLg}`) +
    box(p.slug + '-full-top', 'page top',
      `<img src="${img(p, 'fullpage-top', 'jpg')}" alt="${p.ariaName} — top half of full page" width="${(p.fullTopDims || [1440, 3574])[0]}" height="${(p.fullTopDims || [1440, 3574])[1]}" loading="lazy">`,
      `<span class="lightbox-footer-label">Scroll to explore</span>${visitBtnLg}`) +
    box(p.slug + '-full-bottom', 'page bottom',
      `<img src="${img(p, 'fullpage-bottom', 'jpg')}" alt="${p.ariaName} — bottom half of full page" width="${(p.fullBottomDims || p.fullTopDims || [1440, 3574])[0]}" height="${(p.fullBottomDims || p.fullTopDims || [1440, 3574])[1]}" loading="lazy">`,
      `<span class="lightbox-footer-label">Scroll to explore</span>${visitBtnLg}`)
  );
}

function hexAlpha(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function replaceRegion(html, startMark, endMark, replacement) {
  const s = html.indexOf(startMark);
  const e = html.indexOf(endMark);
  if (s === -1 || e === -1 || e < s) {
    throw new Error('Marker not found or malformed: ' + startMark + ' / ' + endMark);
  }
  return html.slice(0, s + startMark.length) + '\n' + replacement + '\n    ' + html.slice(e);
}

function main() {
  const check = process.argv.includes('--check');
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let html = fs.readFileSync(HTML_FILE, 'utf8');

  let warnings = 0;
  for (const p of data.projects) {
    const missing = checkImages(p);
    for (const m of missing) {
      console.warn('WARN [' + p.slug + '] missing image: ' + m);
      warnings++;
    }
  }

  const projects = data.projects.map((p, i) =>
    projectHtml(p, i) + '\n    <div class="project-divider" aria-hidden="true"></div>\n'
  ).join('');
  const lightboxes = data.projects.map(p => lightboxHtml(p)).join('');

  html = replaceRegion(html, '<!-- PROJECTS:START -->', '<!-- PROJECTS:END -->', projects);
  html = replaceRegion(html, '<!-- LIGHTBOXES:START -->', '<!-- LIGHTBOXES:END -->', lightboxes);

  // Keep the hero project count honest.
  html = html.replace(/(<div class="pf-hero-count-num">)\d+(<\/div>)/, '$1' + data.projects.length + '$2');

  if (check) {
    const current = fs.readFileSync(HTML_FILE, 'utf8');
    console.log(current === html ? 'No changes.' : 'portfolio.html WOULD change.');
  } else {
    fs.writeFileSync(HTML_FILE, html);
    console.log('portfolio.html rebuilt: ' + data.projects.length + ' project(s), ' + (data.projects.length * 5) + ' lightboxes.' + (warnings ? ' (' + warnings + ' image warnings)' : ''));
  }
}

main();
