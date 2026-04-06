/* ═══════════════════════════════════════════════════════════
   DENZIL FERNANDES · PORTFOLIO · script.js
   ═══════════════════════════════════════════════════════════ */



document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Lucide icons ──────────────────────────────────────
  if (window.lucide) lucide.createIcons();

  // ── 2. Navbar scroll state ───────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 3. Mobile hamburger ──────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ── 4. Scroll fade-in (IntersectionObserver) ─────────────
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);   // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));

  // ── 5. Smooth active nav link on scroll ──────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── 6. Subtle parallax on orbs ───────────────────────────
  const orbs = document.querySelectorAll('#hero .orb');
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 14;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });

  // ── 7. Metric counter animation ──────────────────────────
  const metricNums = document.querySelectorAll('.metric-num');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const raw  = el.textContent.trim();
      // Extract digits
      const num  = parseInt(raw.replace(/\D/g, ''), 10);
      const prefix = raw.replace(/[\d.]/g, '').replace(/\d/g, '').split('')[0] ?? '';
      const suffix = raw.replace(/^[^0-9]*/, '').replace(/[0-9]/g, '');

      if (isNaN(num)) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * num);
        el.textContent = (prefix || '') + start + (suffix || '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = raw; // restore original (e.g. "#1")
      };

      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.8 });

  metricNums.forEach(n => countObserver.observe(n));

});
