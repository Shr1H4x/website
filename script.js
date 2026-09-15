/* ============================================
   SHRIJESH POKHAREL — PORTFOLIO
   script.js — Retro edition
   ============================================ */

'use strict';

/* ── THEME TOGGLE ────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('shrihax-theme');
if (savedTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
}
themeToggle.addEventListener('click', () => {
  const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('shrihax-theme', next);
});


/* ── YEAR ─────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


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
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  const href = anchor.getAttribute('href');
  if (href === '#') return;
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (prefersReduced) target.scrollIntoView();
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ── WEBRING RANDOM ───────────────────────── */
const webringRandom = document.getElementById('webringRandom');
if (webringRandom) {
  webringRandom.addEventListener('click', (e) => {
    e.preventDefault();
    const stops = ['about', 'skills', 'projects', 'labs', 'contact'];
    const pick  = stops[Math.floor(Math.random() * stops.length)];
    const target = document.querySelector('a[name="' + pick + '"]') || document.querySelector('#' + pick);
    if (!target) return;
    if (prefersReduced) target.scrollIntoView();
    else target.scrollIntoView({ behavior: 'smooth' });
  });
}