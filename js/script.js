/* ===============================
   PORTFOLIO — Simon Lau
   Features:
   1. Mobile hamburger menu (+ Escape to close)
   2. Smooth scroll with header offset
   3. Active nav link highlighting (aria-current)
   4. Fade-in on scroll (IntersectionObserver)
   5. Dark / light theme toggle (saved in localStorage)
   6. Scroll-to-top button
   7. Auto-updating footer year
   =============================== */

document.addEventListener('DOMContentLoaded', () => {

  const root   = document.documentElement;
  const header = document.querySelector('.site-header');

  // Respect users who prefer less motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reduceMotion.matches ? 'auto' : 'smooth');

  /* ---------- 1. MOBILE HAMBURGER MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  const closeMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Escape closes the menu and returns focus to the toggle button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- 2. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top: y, behavior: scrollBehavior() });

      // Move keyboard focus to the target so screen readers follow the jump
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- 3. ACTIVE NAV LINK HIGHLIGHTING ---------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const highlightNav = () => {
    let current = '';
    const offset = header.offsetHeight + 50;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.getAttribute('id');
      }
    });

    // At the very bottom of the page, force the last section (Contact)
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = 'contact';

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  /* ---------- 6. SCROLL TO TOP (visibility) ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  const toggleScrollTop = () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  };

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  // One throttled scroll listener (runs at most once per frame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      highlightNav();
      toggleScrollTop();
      ticking = false;
    });
  }, { passive: true });

  highlightNav();
  toggleScrollTop();

  /* ---------- 4. FADE-IN ON SCROLL ---------- */
  const revealTargets = document.querySelectorAll(
    '.section__header, .project-card, .process__step, .credential, .about__grid'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => observer.observe(el));
  }
  // If IntersectionObserver is unsupported, content simply stays visible.

  /* ---------- 5. DARK / LIGHT MODE TOGGLE ---------- */
  // The initial theme class is set by the inline script in <head>;
  // here we only sync the button and handle clicks.
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle.querySelector('.theme-toggle__icon');

  const syncThemeButton = () => {
    const isDark = root.classList.contains('dark');
    themeIcon.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  };

  themeToggle.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) { /* storage blocked: theme just won't persist */ }
    syncThemeButton();
  });

  syncThemeButton();

  /* ---------- 7. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});