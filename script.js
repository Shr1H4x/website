/* ============================================
   SHRIJESH POKHAREL — PORTFOLIO
   script.js
   ============================================ */

'use strict';

/* ── LUCIDE ICONS ────────────────────────── */
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

/* ── CUSTOM CURSOR ───────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll('a, button, .skill-tag, .project-card, .project-featured, .platform-card, .contact-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});


/* ── NAVBAR ──────────────────────────────── */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ── ACTIVE NAV LINK ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('[data-nav]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ── REVEAL ON SCROLL ────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.08) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


/* ── SKILL BAR ANIMATION ─────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-domain').forEach(d => skillObserver.observe(d));


/* ── TYPEWRITER ROLE ─────────────────────── */
const roles = [
  'Ethical Hacker',
  'Security Researcher',
  'Malware Analyst',
  'Tool Builder',
  'Penetration Tester',
];

const roleEl = document.getElementById('roleText');
let roleIdx  = 0;
let charIdx  = 0;
let deleting = false;

function typeRole() {
  if (!roleEl) return;
  const current = roles[roleIdx];

  if (!deleting) {
    charIdx++;
    roleEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      setTimeout(() => { deleting = true; typeRole(); }, 2000);
      return;
    }
  } else {
    charIdx--;
    roleEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }

  setTimeout(typeRole, deleting ? 50 : 90);
}

typeRole();


/* ── SMOOTH ANCHOR SCROLL ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── GLITCH LOGO + INJECTED CSS ──────────── */
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch-main {
    0%,100% { transform: translate(0); clip-path: none; }
    10%  { transform: translate(-2px, 1px) skewX(-2deg); clip-path: inset(10% 0 80% 0); }
    20%  { transform: translate(2px, -1px) skewX(2deg);  clip-path: inset(60% 0 20% 0); }
    30%  { transform: translate(-1px, 2px);               clip-path: inset(30% 0 50% 0); }
    40%  { transform: translate(1px, -2px) skewX(-1deg);  clip-path: inset(80% 0 5%  0); }
    50%  { transform: translate(0);                       clip-path: none; }
    60%  { transform: translate(-3px, 0) skewX(3deg);     clip-path: inset(45% 0 40% 0); }
    70%  { transform: translate(3px, 1px);                clip-path: inset(5%  0 70% 0); }
    80%  { transform: translate(-1px,-1px) skewX(-2deg);  clip-path: inset(70% 0 15% 0); }
    90%  { transform: translate(0);                       clip-path: none; }
  }
  @keyframes glitch-red {
    0%,100% { transform: translate(0); opacity: 0; }
    15%  { transform: translate(-3px, 1px); opacity: 0.7; clip-path: inset(20% 0 60% 0); }
    35%  { transform: translate(3px,-1px);  opacity: 0.5; clip-path: inset(55% 0 25% 0); }
    55%  { transform: translate(-2px, 2px); opacity: 0.6; clip-path: inset(75% 0 10% 0); }
    75%  { transform: translate(2px,-2px);  opacity: 0.4; clip-path: inset(10% 0 75% 0); }
    90%  { opacity: 0; }
  }
  @keyframes glitch-cyan {
    0%,100% { transform: translate(0); opacity: 0; }
    20%  { transform: translate(3px,-1px);  opacity: 0.6; clip-path: inset(50% 0 30% 0); }
    40%  { transform: translate(-3px, 1px); opacity: 0.5; clip-path: inset(15% 0 65% 0); }
    60%  { transform: translate(2px, 2px);  opacity: 0.7; clip-path: inset(80% 0 5%  0); }
    80%  { transform: translate(-2px,-2px); opacity: 0.4; clip-path: inset(35% 0 45% 0); }
    95%  { opacity: 0; }
  }
  .nav-logo { position: relative; }
  .nav-logo.glitching         { animation: glitch-main 0.5s steps(1) 1; }
  .nav-logo.glitching::before { content: attr(data-text); position: absolute; left: 0; top: 0; color: #ff0055; animation: glitch-red  0.5s steps(1) 1; pointer-events: none; }
  .nav-logo.glitching::after  { content: attr(data-text); position: absolute; left: 0; top: 0; color: #00ffff; animation: glitch-cyan 0.5s steps(1) 1; pointer-events: none; }

  /* Function tags — plain, zero color */
  .tag-plain {
    color: #666 !important;
    border-color: #2a2a2a !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  /* Language monogram badge — green, top left */
  .lang-badge-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #00ff87;
    border: 1px solid rgba(0, 255, 135, 0.4);
    background: rgba(0, 255, 135, 0.06);
    border-radius: 4px;
    padding: 0.2rem 0.45rem;
    min-width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  /* Left side of pc-header — emoji + badge side by side */
  .pc-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  /* Tool emoji */
  .pc-emoji {
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }

  /* Tags on right — no wrap, single line */
  .pc-header .pc-tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    justify-content: flex-end;
    overflow: hidden;
  }

  .pc-header .pc-tags .proj-tag {
    white-space: nowrap;
    font-size: 0.56rem;
    padding: 2px 6px;
  }

  .github-loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #666;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(glitchStyle);

const logo = document.querySelector('.nav-logo');
if (logo) {
  const triggerGlitch = () => {
    logo.classList.add('glitching');
    logo.addEventListener('animationend', () => {
      logo.classList.remove('glitching');
    }, { once: true });
  };
  setTimeout(() => {
    triggerGlitch();
    setInterval(triggerGlitch, 5000);
  }, 1500);
}


/* ── LABS TABLE ROW HIGHLIGHT ────────────── */
document.querySelectorAll('.labs-table tbody tr').forEach(row => {
  row.addEventListener('mouseenter', () => { row.style.background = 'rgba(0,255,135,0.03)'; });
  row.addEventListener('mouseleave', () => { row.style.background = ''; });
});


/* ── PARALLAX HERO GLOW ──────────────────── */
document.addEventListener('mousemove', (e) => {
  const glow = document.querySelector('.hero-img-glow');
  if (!glow) return;
  const rect = glow.closest('.hero-img-wrap').getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = (e.clientX - cx) / window.innerWidth  * 20;
  const dy   = (e.clientY - cy) / window.innerHeight * 20;
  glow.style.transform = `translate(${dx}px, ${dy}px)`;
}, { passive: true });


/* ── CURRENT YEAR IN FOOTER ──────────────── */
const copyEl = document.querySelector('.footer-copy');
if (copyEl) {
  copyEl.textContent = copyEl.textContent.replace('2026', new Date().getFullYear());
}


/* ── REDUCED MOTION RESPECT ──────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity   = '1';
    el.style.transform = 'none';
    el.classList.add('visible');
  });
}


/* ============================================================
   GITHUB AUTO-RENDER — fully automated, zero hardcoding
   Control everything from GitHub:
     - Add topic "featured"              → shows in featured section
     - Add topic "hidden-from-portfolio" → hidden from site
     - Set repo description              → shows as card text
     - Set repo topics                   → function tags
   ============================================================ */

// Repos to always hide regardless of topics (profile readmes etc)
const HIDDEN_REPOS = [
  'Shr1H4x',
  'ShriHax-21',
  'website',
];

// Language → monogram badge
const LANG_BADGES = {
  Python:     'PY',
  Bash:       'SH',
  Shell:      'SH',
  C:          'C',
  'C++':      'C++',
  PHP:        'PHP',
  JavaScript: 'JS',
  TypeScript: 'TS',
  HTML:       'HTML',
  CSS:        'CSS',
  Ruby:       'RB',
  Go:         'GO',
  Rust:       'RS',
  Java:       'JAVA',
  default:    '?',
};

// Tool emoji per repo name
const REPO_EMOJI = {
  'sysmaint':                      '🔧',
  'NCPD':                          '🐚',
  'port_scanner_GUI':              '🌐',
  'port_scanner':                  '🌐',
  'port-scanner':                  '🌐',
  'web_crawler_GUI':               '🕷️',
  'web-crawler-GUI':               '🕷️',
  'URL-Defanger':                  '🔗',
  'URL_Defanger':                  '🔗',
  'cryptography':                  '🔒',
  'cryptography-in-linux':         '🔒',
  'Image_downloader':              '🖼️',
  'Image-downloader':              '🖼️',
  'YouTube-Downloader':            '📥',
  'YouTube_Downloader':            '📥',
  'Student-Management-System':     '🎓',
  'Student_Management_System':     '🎓',
  'Python-project':                '🐍',
  'Python_project':                '🐍',
  'PwnScout':                      '🎯',
  'NetToss-Wireless_File_Transfer': '📡',
  'Cryptex-Rolling-file-vault':    '🔐',
  'X_Change':                      '🎭',
  'X-Change':                      '🎭',
  'default':                       '📁',
};

// Hardcoded function tags — fallback if GitHub topics not set
const REPO_TAGS = {
  'sysmaint':                      ['Automation', 'Linux'],
  'NCPD':                          ['Recon', 'Port Scan'],
  'port_scanner_GUI':              ['Recon', 'Network'],
  'port_scanner':                  ['Recon', 'Network'],
  'port-scanner':                  ['Recon', 'Network'],
  'web_crawler_GUI':               ['OSINT', 'Crawler'],
  'web-crawler-GUI':               ['OSINT', 'Crawler'],
  'URL-Defanger':                  ['Threat Intel', 'Blue Team'],
  'URL_Defanger':                  ['Threat Intel', 'Blue Team'],
  'cryptography':                  ['Encryption', 'Low Level'],
  'cryptography-in-linux':         ['Encryption', 'Bash'],
  'Image_downloader':              ['Automation', 'Scraping'],
  'Image-downloader':              ['Automation', 'Scraping'],
  'YouTube-Downloader':            ['Automation', 'Scraping'],
  'YouTube_Downloader':            ['Automation', 'Scraping'],
  'Student-Management-System':     ['Full Stack', 'Database'],
  'Student_Management_System':     ['Full Stack', 'Database'],
  'Python-project':                ['Scripting', 'Academic'],
  'Python_project':                ['Scripting', 'Academic'],
  'PwnScout':                      ['Recon', 'Exploitation'],
  'NetToss-Wireless_File_Transfer': ['File Transfer', 'Wireless'],
  'Cryptex-Rolling-file-vault':    ['Encryption', 'File Vault'],
  'X_Change':                      ['IP Spoof', 'OPSEC'],
  'X-Change':                      ['IP Spoof', 'OPSEC'],
};

// Topic slug → clean display label
function formatTopic(topic) {
  const MAP = {
    'featured':           null,   // never display this as a tag
    'hidden-from-portfolio': null,
    'ctf':                'CTF',
    'hackthebox':         'HackTheBox',
    'tryhackme':          'TryHackMe',
    'pentest':            'Pentest',
    'cybersecurity':      'CyberSec',
    'ethical-hacking':    'Ethical Hacking',
    'malware':            'Malware',
    'malware-analysis':   'Malware Analysis',
    'osint':              'OSINT',
    'recon':              'Recon',
    'kali-linux':         'Kali',
    'linux':              'Linux',
    'networking':         'Network',
    'encryption':         'Encryption',
    'cryptography':       'Crypto',
    'automation':         'Automation',
    'tool':               'Tool',
    'reverse-engineering':'Rev Eng',
    'bash':               'Bash',
    'python':             'Python',
    'web':                'Web',
    'gui':                'GUI',
    'security':           'Security',
    'scripting':          'Scripting',
    'exploitation':       'Exploitation',
    'spoofing':           'Spoofing',
    'opsec':              'OPSEC',
    'file-transfer':      'File Transfer',
  };
  if (topic in MAP) return MAP[topic]; // null = skip
  return topic.replace(/-/g, ' ');
}

// Build a small project card (used in all-projects grid)
function buildCard(repo) {
  const lang  = repo.language || null;
  const badge = LANG_BADGES[lang] || LANG_BADGES.default;
  const desc  = repo.description || 'No description provided.';
  const date  = new Date(repo.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const emoji = REPO_EMOJI[repo.name] || REPO_EMOJI['default'];

  const hardcodedTags = REPO_TAGS[repo.name] || [];
  const githubTopics  = (repo.topics || [])
    .map(t => formatTopic(t))
    .filter(t => t !== null);
  let allTags = [...new Set([...hardcodedTags, ...githubTopics])];
  if (allTags.length === 0) allTags = [lang || 'Tool', 'Open Source'];

  const funcTags = allTags.slice(0, 2)
    .map(t => `<span class="proj-tag sm tag-plain">${t}</span>`).join('');

  return `
    <div class="project-card">
      <div class="pc-header">
        <div class="pc-left">
          <span class="pc-emoji">${emoji}</span>
          <span class="lang-badge-icon">${badge}</span>
        </div>
        <div class="pc-tags">${funcTags}</div>
      </div>
      <h4 class="pc-title">${repo.name.replace(/[-_]/g, ' ')}</h4>
      <p class="pc-desc">${desc}</p>
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="pc-link">View →</a>
      <span class="pc-date mono">${date}</span>
    </div>
  `;
}

// Build a featured card (used in featured section)
function buildFeaturedCard(repo, index) {
  const lang  = repo.language || null;
  const desc  = repo.description || 'No description provided.';
  const date  = new Date(repo.pushed_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const hardcodedTags = REPO_TAGS[repo.name] || [];
  const githubTopics  = (repo.topics || [])
    .map(t => formatTopic(t))
    .filter(t => t !== null);
  let allTags = [...new Set([...hardcodedTags, ...githubTopics])];
  if (allTags.length === 0) allTags = [lang || 'Tool'];

  const tags = allTags.slice(0, 2)
    .map(t => `<span class="proj-tag">${t}</span>`).join('');

  const num = String(index + 1).padStart(2, '0');

  return `
    <div class="project-featured">
      <div class="project-featured-meta">
        <span class="proj-num mono accent">${num}</span>
        <div class="proj-tags">
          ${tags}
          <span class="proj-tag accent-tag">Featured</span>
        </div>
      </div>
      <h3 class="proj-title">${repo.name.replace(/[-_]/g, ' ')}</h3>
      <p class="proj-desc">${desc}</p>
      <div class="proj-links">
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="proj-link">
          View Code <i data-lucide="arrow-up-right"></i>
        </a>
      </div>
      <span class="proj-date mono">${date}</span>
    </div>
  `;
}

async function loadGithubProjects() {
  const featuredGrid = document.getElementById('featuredProjectsGrid');
  const allGrid      = document.getElementById('githubProjectsGrid');
  const cta          = document.getElementById('githubRepoCount');

  try {
    const res = await fetch(
      'https://api.github.com/users/Shr1H4x/repos?sort=pushed&per_page=50',
      { headers: { 'Accept': 'application/vnd.github.mercy-preview+json' } }
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error('Unexpected response format');

    // Base filter — no forks, no hidden
    const visible = repos.filter(r =>
      !r.fork &&
      !HIDDEN_REPOS.includes(r.name) &&
      !(r.topics && r.topics.includes('hidden-from-portfolio'))
    );

    // Split: featured vs all-projects
    const featuredRepos = visible.filter(r => r.topics && r.topics.includes('featured'));
    const allRepos      = visible.filter(r => !(r.topics && r.topics.includes('featured')));

    // ── Render featured section
    if (featuredGrid) {
      if (featuredRepos.length === 0) {
        featuredGrid.innerHTML = `
          <p class="mono dim" style="grid-column:1/-1;text-align:center;padding:1rem 0;font-size:0.8rem;">
            No featured repos yet — add topic <span class="accent">featured</span> on GitHub.
          </p>`;
      } else {
        featuredGrid.innerHTML = featuredRepos
          .map((repo, i) => buildFeaturedCard(repo, i))
          .join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }

    // ── Render all-projects grid
    if (allGrid) {
      if (allRepos.length === 0) {
        allGrid.innerHTML = '<p class="mono dim" style="grid-column:1/-1;text-align:center;padding:2rem 0;">No additional repos found.</p>';
      } else {
        allGrid.innerHTML = allRepos.map(repo => buildCard(repo)).join('');
      }
    }

    // ── CTA count
    if (cta) {
      cta.innerHTML = `View all ${visible.length} repos on GitHub <i data-lucide="arrow-up-right"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Re-apply cursor hover
    document.querySelectorAll('.project-card, .project-featured').forEach(el => {
      el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovered'));
    });

  } catch (err) {
    console.error('GitHub fetch failed:', err);
    const errMsg = `
      <p class="mono dim" style="grid-column:1/-1;text-align:center;padding:2rem 0;">
        <span class="accent">!</span> Could not load repos —
        <a href="https://github.com/Shr1H4x" target="_blank" rel="noopener" class="accent">view on GitHub directly</a>.
      </p>`;
    if (featuredGrid) featuredGrid.innerHTML = errMsg;
    if (allGrid) allGrid.innerHTML = errMsg;
  }
}

loadGithubProjects();