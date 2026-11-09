/* ============================================================
   SHRIHAX / CYBER OBSIDIAN
   Interactions & animation engine. No dependencies.
   ============================================================ */

'use strict';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ── BOOT LOADER ─────────────────────────────────────────── */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const status = $('#loaderStatus');
  const messages = [
    'initialising secure shell…',
    'loading modules…',
    'mounting /dev/portfolio…',
  ];
  let i = 0;
  const cycle = setInterval(() => {
    if (i < messages.length - 1) i += 1;
    if (status) status.textContent = messages[i];
  }, 380);

  let pageLoaded = document.readyState === 'complete';
  let barFilled = false;
  let done = false;

  const finish = () => {
    if (done || !pageLoaded || !barFilled) return;
    done = true;
    clearInterval(cycle);
    if (status) status.textContent = 'handshake complete.';
    loader.classList.add('done');
    document.body.classList.add('loaded');
    window.dispatchEvent(new Event('site:ready'));
  };

  const markLoaded = () => {
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fonts.then(() => {
      pageLoaded = true;
      finish();
    });
  };

  // Stay up until the loader animation finishes and the page is actually ready.
  const bar = loader.querySelector('.loader-track span');
  if (bar && !prefersReduced) {
    bar.addEventListener('animationend', (event) => {
      if (event.animationName !== 'loaderFill') return;
      barFilled = true;
      finish();
    }, { once: true });
  } else {
    barFilled = true;
  }

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    window.addEventListener('load', markLoaded, { once: true });
  }
})();

/* ── HEADER, PROGRESS, MOBILE NAV ────────────────────────── */
(function initChrome() {
  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const nav = $('#primaryNav');
  const navToggle = $('#navToggle');
  const indicator = $('#navIndicator');

  /* custom animated scrollbar */
  const scrollbar = document.createElement('div');
  scrollbar.className = 'custom-scrollbar';
  scrollbar.setAttribute('aria-hidden', 'true');
  const scrollbarThumb = document.createElement('span');
  scrollbar.appendChild(scrollbarThumb);
  document.body.appendChild(scrollbar);

  const updateScrollbar = () => {
    const doc = document.documentElement;
    const viewport = window.innerHeight;
    const total = Math.max(doc.scrollHeight, viewport);
    const max = total - viewport;
    const thumbH = Math.max(42, Math.round((viewport / total) * viewport));
    const y = max > 0 ? (window.scrollY / max) * (viewport - thumbH) : 0;
    scrollbarThumb.style.height = Math.min(viewport, thumbH) + 'px';
    scrollbarThumb.style.transform = 'translateY(' + Math.max(0, Math.min(viewport - thumbH, y)) + 'px)';
    scrollbar.classList.toggle('is-idle', max < 2);
  };

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    updateScrollbar();
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', updateScrollbar, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateScrollbar).observe(document.body);
  }
  onScroll();

  /* mobile menu */
  if (nav && navToggle) {
    const close = () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach((a) => a.addEventListener('click', close));
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        navToggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) close();
    });
  }

  /* sliding nav indicator */
  const moveIndicator = (link) => {
    if (!indicator || !nav || !link || window.innerWidth <= 900) {
      indicator?.classList.remove('visible');
      return;
    }
    const navBox = nav.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    indicator.style.left = (box.left - navBox.left) + 'px';
    indicator.style.width = box.width + 'px';
    indicator.classList.add('visible');
  };

  /* active section highlighting */
  if (nav) {
    const links = $$('a[href^="#"], a[data-section]', nav);
    const sections = links
      .map((a) => {
        const id = a.dataset.section || a.getAttribute('href').slice(1);
        return { link: a, section: document.getElementById(id) };
      })
      .filter((item) => item.section);

    if (sections.length) {
      const setActive = (link) => {
        links.forEach((a) => a.classList.toggle('active', a === link));
        moveIndicator(link);
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sections.find((item) => item.section === entry.target);
          if (match) setActive(match.link);
        });
      }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

      sections.forEach((item) => observer.observe(item.section));

      const current = nav.querySelector('a.current');
      if (current) {
        links.forEach((a) => a.classList.toggle('active', a === current));
        moveIndicator(current);
      }

      window.addEventListener('resize', () => {
        const active = nav.querySelector('a.active');
        if (active) moveIndicator(active);
        else indicator?.classList.remove('visible');
      });
      window.addEventListener('site:ready', () => {
        const active = nav.querySelector('a.active') || nav.querySelector('a.current');
        if (active) moveIndicator(active);
      });
    } else {
      const current = nav.querySelector('a.current');
      if (current) moveIndicator(current);
      window.addEventListener('site:ready', () => moveIndicator(current));
      window.addEventListener('resize', () => moveIndicator(current));
    }
  }
})();

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
(function initReveal() {
  const items = $$('[data-reveal]');
  if (!items.length) return;

  if (prefersReduced) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  items.forEach((el) => observer.observe(el));
})();

/* ── COUNTERS ────────────────────────────────────────────── */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const suffixFor = (el) => (el.classList.contains('skill-pct') ? '%' : '');
  const settle = () => counters.forEach((el) => { el.textContent = el.dataset.count + suffixFor(el); });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    settle();
    return;
  }

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = suffixFor(el);
    if (Number.isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  // reset to zero only once JS is ready to animate them
  counters.forEach((el) => {
    el.textContent = '0' + suffixFor(el);
    observer.observe(el);
  });
})();

/* ── SKILL BARS ──────────────────────────────────────────── */
(function initSkillBars() {
  const bars = $$('.skill-fill');
  if (!bars.length) return;

  const settle = () => bars.forEach((bar) => { bar.style.width = (bar.dataset.w || 0) + '%'; });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    settle();
    return;
  }

  // start collapsed, without a reverse flicker from the inline fallback width
  bars.forEach((bar) => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
  });
  void document.body.offsetWidth;
  bars.forEach((bar) => { bar.style.transition = ''; });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const row = bar.closest('.skill-row');
      const siblings = row ? Array.from(row.parentElement.children) : [];
      const idx = Math.max(0, siblings.indexOf(row));
      setTimeout(() => { bar.style.width = (bar.dataset.w || 0) + '%'; }, idx * 55);
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
})();

/* ── TYPING HEADINGS & SUBHEADINGS ───────────────────────── */
(function initTyping() {
  const targets = $$('[data-type]');
  if (!targets.length) return;
  if (prefersReduced || !('IntersectionObserver' in window)) return;

  const type = (el) => {
    const nodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) nodes.push({ node, text: node.nodeValue });
    }
    if (!nodes.length) return;

    // Keep the block height stable while the text grows.
    el.style.minHeight = el.getBoundingClientRect().height + 'px';
    el.setAttribute('aria-busy', 'true');

    const caret = document.createElement('span');
    caret.className = 'type-caret';
    caret.setAttribute('aria-hidden', 'true');

    nodes.forEach(({ node }) => { node.nodeValue = ''; });
    nodes[0].node.after(caret);

    const speed = el.matches('h1, h2') ? 34 : 12;
    let index = 0;
    let char = 0;

    const step = () => {
      const item = nodes[index];
      char += 1;
      item.node.nodeValue = item.text.slice(0, char);

      if (char < item.text.length) {
        item.node.after(caret);
        setTimeout(step, speed);
        return;
      }

      index += 1;
      char = 0;

      if (index < nodes.length) {
        nodes[index].node.before(caret);
        setTimeout(step, speed);
        return;
      }

      nodes.forEach(({ node, text }) => { node.nodeValue = text; });
      caret.remove();
      el.style.minHeight = '';
      el.removeAttribute('aria-busy');
    };

    setTimeout(step, 120);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      type(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  targets.forEach((el) => observer.observe(el));
})();

/* ── TYPEWRITER ROLES ────────────────────────────────────── */
(function initTypewriter() {
  const el = $('#roleText');
  if (!el) return;

  const roles = [
    'Ethical Hacker',
    'Security Researcher',
    'Malware Analyst',
    'Tool Builder',
    'Penetration Tester',
  ];

  if (prefersReduced) {
    el.textContent = roles[0];
    return;
  }

  let role = 0;
  let char = 0;
  let deleting = false;

  const tick = () => {
    const word = roles[role];
    char += deleting ? -1 : 1;
    el.textContent = word.slice(0, char);

    let delay = deleting ? 42 : 82;
    if (!deleting && char === word.length) {
      deleting = true;
      delay = 2100;
    } else if (deleting && char === 0) {
      deleting = false;
      role = (role + 1) % roles.length;
      delay = 380;
    }
    setTimeout(tick, delay);
  };
  tick();
})();

/* ── TERMINAL TYPE-ALONG ─────────────────────────────────── */
(function initTerminal() {
  const el = $('#terminalTyping');
  if (!el) return;

  const commands = [
    'nmap -sV -T4 target.htb',
    'python3 port_scanner.py --fast',
    'yara -r rules/ sample.bin',
    'echo "stay curious"',
  ];

  if (prefersReduced) {
    el.textContent = commands[0];
    return;
  }

  let cmd = 0;
  let char = 0;
  let deleting = false;

  const tick = () => {
    const text = commands[cmd];
    char += deleting ? -1 : 1;
    el.textContent = text.slice(0, char);

    let delay = deleting ? 28 : 62;
    if (!deleting && char === text.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && char === 0) {
      deleting = false;
      cmd = (cmd + 1) % commands.length;
      delay = 500;
    }
    setTimeout(tick, delay);
  };
  tick();
})();

/* ── 3D TILT CARDS ───────────────────────────────────────── */
(function initTilt() {
  if (prefersReduced || !finePointer) return;
  const cards = $$('[data-tilt]');

  cards.forEach((card) => {
    let frame = null;

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rx = (0.5 - py) * 6;
        const ry = (px - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
(function initMagnetic() {
  if (prefersReduced || !finePointer) return;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
})();

/* ── HERO PARALLAX ───────────────────────────────────────── */
(function initParallax() {
  if (prefersReduced || !finePointer) return;
  const hero = $('.hero');
  const visual = $('#heroVisual');
  if (!hero || !visual) return;

  let frame = null;
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      visual.style.transform = `translate3d(${(nx * -18).toFixed(2)}px, ${(ny * -14).toFixed(2)}px, 0)`;
    });
  });
  hero.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    visual.style.transform = '';
  });
})();

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  if (prefersReduced || !finePointer) return;
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let visible = false;

  const render = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  document.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      document.body.classList.add('cursor-ready');
    }
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    if (e.target instanceof Element && e.target.closest('a, button, [data-tilt], .tag, .pill')) {
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('pointerleave', () => {
    visible = false;
    document.body.classList.remove('cursor-ready', 'cursor-hover');
  });
})();

/* ── PARTICLE NETWORK BACKGROUND ─────────────────────────── */
(function initCanvas() {
  const canvas = $('#bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let raf = null;
  let running = false;
  const mouse = { x: -9999, y: -9999 };

  const build = () => {
    const count = Math.max(30, Math.min(90, Math.round((width * height) / 21000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.4 + 0.6,
    }));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(58, 226, 255, 0.55)';
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 118) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(58, 226, 255, ${(1 - dist / 118) * 0.22})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      const mdx = a.x - mouse.x;
      const mdy = a.y - mouse.y;
      const mdist = Math.hypot(mdx, mdy);
      if (mdist < 170) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(125, 255, 155, ${(1 - mdist / 170) * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    raf = requestAnimationFrame(draw);
  };

  const start = () => {
    if (running) return;
    running = true;
    draw();
  };

  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (prefersReduced) {
    // static constellation, no motion
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(58, 226, 255, 0.4)';
      ctx.fill();
    }
    return;
  }

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
})();

/* ── COPY EMAIL + TOAST ──────────────────────────────────── */
(function initCopy() {
  const button = $('#copyEmail');
  const toast = $('#toast');
  if (!button) return;

  let timer = null;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  button.addEventListener('click', async () => {
    const email = 'shrijesh@proton.me';
    try {
      await navigator.clipboard.writeText(email);
      showToast('email copied, talk soon.');
      button.blur();
    } catch {
      const temp = document.createElement('textarea');
      temp.value = email;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        showToast('email copied, talk soon.');
      } catch {
        showToast(email);
      }
      temp.remove();
    }
  });
})();

/* ── KATHMANDU CLOCK ─────────────────────────────────────── */
(function initClock() {
  const el = $('#localTime');
  if (!el) return;

  const format = () => {
    try {
      const time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date());
      el.textContent = `Kathmandu ${time}`;
    } catch {
      el.textContent = 'Kathmandu';
    }
  };
  format();
  setInterval(format, 30000);
})();

/* ── YEAR ────────────────────────────────────────────────── */
(function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();
