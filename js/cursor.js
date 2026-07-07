(function () {
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(max-width: 1024px)').matches) return;

  function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const label = document.getElementById('cursorLabel');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    function getBgColor(el) {
      while (el && el !== document.documentElement) {
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const m = bg.match(/[\d.]+/g);
          const alpha = m && m.length >= 4 ? parseFloat(m[3]) : 1;
          if (alpha > 0.5) return bg;
        }
        el = el.parentElement;
      }
      return 'rgb(11, 0, 79)';
    }

    function isDark(rgb) {
      const m = rgb.match(/[\d.]+/g);
      if (!m) return true;
      const r = parseInt(m[0]) / 255;
      const g = parseInt(m[1]) / 255;
      const b = parseInt(m[2]) / 255;
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 0.4;
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0)';
      if (label) {
        label.style.transform = 'translate3d(' + (mouseX + 22) + 'px,' + (mouseY - 14) + 'px,0)';
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el) {
          const onDark = isDark(getBgColor(el));
          label.classList.toggle('on-dark', !onDark);
        }
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = 'translate3d(' + (ringX - 18) + 'px,' + (ringY - 18) + 'px,0)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactables = document.querySelectorAll('a, button, input, select, textarea, .service-card, .portfolio-card');
    interactables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.style.width = '60px';
        ring.style.height = '60px';
        ring.style.borderColor = 'rgba(194, 170, 105, 0.8)';
      });
      el.addEventListener('mouseleave', function () {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(194, 170, 105, 0.5)';
      });
    });

    if (label) {
      document.querySelectorAll('[data-cursor-label]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          label.textContent = el.dataset.cursorLabel;
          label.style.opacity = '1';
        });
        el.addEventListener('mouseleave', function () {
          label.style.opacity = '0';
        });
      });
    }
  }

  if (window.requestIdleCallback) {
    requestIdleCallback(initCursor);
  } else {
    setTimeout(initCursor, 1);
  }
})();
