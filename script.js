/* ═══════════════════════════════════════════════════════════
   DENZIL FERNANDES · PORTFOLIO · script.js
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = window.matchMedia('(hover: hover)').matches;

  // ── 1. Lucide icons ──────────────────────────────────────
  if (window.lucide) lucide.createIcons();

  // ── 2. Theme toggle ──────────────────────────────────────
  const rootEl = document.documentElement;
  const themeToggles = document.querySelectorAll('.theme-toggle');

  const syncThemeUI = () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('aria-pressed', String(isLight));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight ? '#f6f3ec' : '#0a0a0c');
  };

  const applyTheme = () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    if (isLight) rootEl.removeAttribute('data-theme');
    else rootEl.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
    syncThemeUI();
  };

  themeToggles.forEach(btn => btn.addEventListener('click', applyTheme));
  syncThemeUI();

  // ── 3. Navbar scroll state ───────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const progressBar = document.getElementById('scrollProgress');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 40);

      // Back to top visibility
      if (backToTop) backToTop.classList.toggle('show', y > 600);

      // Scroll progress
      if (progressBar) {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
        progressBar.style.width = pct + '%';
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ── 4. Mobile hamburger ──────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const setMenu = (open) => {
    mobileMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    setMenu(!mobileMenu.classList.contains('open'));
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });

  // Close on Escape or when clicking outside the nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenu(false);
      hamburger.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !e.target.closest('#navbar')) {
      setMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && mobileMenu.classList.contains('open')) setMenu(false);
  });

  // ── 5. Scroll fade-up (IntersectionObserver) ─────────────
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── 6. Active nav link on scroll ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const setActive = (id) => {
    navAnchors.forEach(a => {
      const match = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.getAttribute('id'));
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  }

  // ── 7. Custom cursor glow (desktop only) ─────────────────
  if (hasHover && !reduceMotion) {
    const glow = document.querySelector('.cursor-glow');
    let gx = 0, gy = 0, tx = 0, ty = 0, raf = null;

    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(function loop() {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`;
        if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) raf = requestAnimationFrame(loop);
        else raf = null;
      });
      glow.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  // ── 8. Hero orb parallax (desktop) ──────────────────────
  if (hasHover && !reduceMotion) {
    const orbs = document.querySelectorAll('.hero .orb');
    let oRaf = null;
    window.addEventListener('mousemove', (e) => {
      if (oRaf) return;
      oRaf = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        orbs.forEach((orb, i) => {
          const factor = (i + 1) * 10;
          orb.style.translate = `${dx * factor}px ${dy * factor}px`;
        });
        oRaf = null;
      });
    }, { passive: true });
  }

  // ── 9. Metric counter animation ──────────────────────────
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const duration = 1300;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(eased * target);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.metric-num[data-count]').forEach(n => countObserver.observe(n));

});
