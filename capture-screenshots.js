#!/usr/bin/env node
/*
 * capture-screenshots.js
 * Captures the 6 portfolio images for a project directly from its live URL:
 * hero.webp, shot-hero.jpg, shot-content.jpg, fullpage.jpg, fullpage-top.jpg, fullpage-bottom.jpg.
 * Uses ImageMagick (magick) for crop/convert, so it must be on PATH.
 *
 * Usage: node capture-screenshots.js <slug> <url>
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, 'images');
const PREFIX = 'shaynesdesigns-shaynes-designs-portfolio-';
const VIEWPORT = { width: 1440, height: 900 };

function magick(args) {
  execFileSync('magick', args, { stdio: 'inherit' });
}

async function capture(slug, url) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(4000);

  const shotHero = path.join(IMG_DIR, `${PREFIX}${slug}-shot-hero.jpg`);
  await page.screenshot({ path: shotHero, type: 'jpeg', quality: 88 });

  await page.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.35)));
  await page.waitForTimeout(500);
  const shotContent = path.join(IMG_DIR, `${PREFIX}${slug}-shot-content.jpg`);
  await page.screenshot({ path: shotContent, type: 'jpeg', quality: 88 });

  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    const max = document.body.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 250));
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(4000);
  const fullpage = path.join(IMG_DIR, `${PREFIX}${slug}-fullpage.jpg`);
  await page.screenshot({ path: fullpage, type: 'jpeg', quality: 85, fullPage: true });

  await browser.close();

  const dims = execFileSync('magick', ['identify', '-format', '%w %h', fullpage]).toString().trim().split(' ').map(Number);
  const [w, h] = dims;
  const half = Math.round(h / 2);

  const fullTop = path.join(IMG_DIR, `${PREFIX}${slug}-fullpage-top.jpg`);
  const fullBottom = path.join(IMG_DIR, `${PREFIX}${slug}-fullpage-bottom.jpg`);
  magick([fullpage, '-crop', `${w}x${half}+0+0`, '+repage', fullTop]);
  magick([fullpage, '-crop', `${w}x${h - half}+0+${half}`, '+repage', fullBottom]);

  const heroWebp = path.join(IMG_DIR, `${PREFIX}${slug}-hero.webp`);
  magick([fullpage, '-crop', `${w}x${Math.round(w * 0.83)}+0+0`, '+repage', '-resize', '800x', heroWebp]);

  const bottomDims = execFileSync('magick', ['identify', '-format', '%h', fullBottom]).toString().trim();
  return { w, h, halfH: half, bottomH: Number(bottomDims) };
}

if (require.main === module) {
  const [slug, url] = process.argv.slice(2);
  if (!slug || !url) {
    console.error('Usage: node capture-screenshots.js <slug> <url>');
    process.exit(1);
  }
  capture(slug, url).then((dims) => {
    console.log(`Captured ${slug}: fullpage ${dims.w}x${dims.h}, top ${dims.w}x${dims.halfH}, bottom ${dims.w}x${dims.bottomH}`);
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { capture };
