import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');

const HIDDEN_REPOS = new Set(['Shr1H4x', 'ShriHax-21', 'website']);

const LANG_BADGES = {
  Python: 'PY',
  Bash: 'SH',
  Shell: 'SH',
  C: 'C',
  'C++': 'C++',
  PHP: 'PHP',
  JavaScript: 'JS',
  TypeScript: 'TS',
  HTML: 'HTML',
  CSS: 'CSS',
  Ruby: 'RB',
  Go: 'GO',
  Rust: 'RS',
  Java: 'JAVA',
  default: '?',
};

const REPO_EMOJI = {
  sysmaint: '🔧',
  NCPD: '🐚',
  port_scanner_GUI: '🌐',
  'port_scanner': '🌐',
  'port-scanner': '🌐',
  web_crawler_GUI: '🕷️',
  'web-crawler-GUI': '🕷️',
  'URL-Defanger': '🔗',
  URL_Defanger: '🔗',
  cryptography: '🔒',
  'cryptography-in-linux': '🔒',
  Image_downloader: '🖼️',
  'Image-downloader': '🖼️',
  'YouTube-Downloader': '📥',
  YouTube_Downloader: '📥',
  'Student-Management-System': '🎓',
  Student_Management_System: '🎓',
  'Python-project': '🐍',
  Python_project: '🐍',
  PwnScout: '🎯',
  'NetToss-Wireless_File_Transfer': '📡',
  'Cryptex-Rolling-file-vault': '🔐',
  X_Change: '🎭',
  'X-Change': '🎭',
  default: '📁',
};

const REPO_TAGS = {
  sysmaint: ['Automation', 'Linux'],
  NCPD: ['Recon', 'Port Scan'],
  port_scanner_GUI: ['Recon', 'Network'],
  port_scanner: ['Recon', 'Network'],
  'port-scanner': ['Recon', 'Network'],
  web_crawler_GUI: ['OSINT', 'Crawler'],
  'web-crawler-GUI': ['OSINT', 'Crawler'],
  'URL-Defanger': ['Threat Intel', 'Blue Team'],
  URL_Defanger: ['Threat Intel', 'Blue Team'],
  cryptography: ['Encryption', 'Low Level'],
  'cryptography-in-linux': ['Encryption', 'Bash'],
  Image_downloader: ['Automation', 'Scraping'],
  'Image-downloader': ['Automation', 'Scraping'],
  'YouTube-Downloader': ['Automation', 'Scraping'],
  YouTube_Downloader: ['Automation', 'Scraping'],
  'Student-Management-System': ['Full Stack', 'Database'],
  Student_Management_System: ['Full Stack', 'Database'],
  'Python-project': ['Scripting', 'Academic'],
  Python_project: ['Scripting', 'Academic'],
  PwnScout: ['Recon', 'Exploitation'],
  'NetToss-Wireless_File_Transfer': ['File Transfer', 'Wireless'],
  'Cryptex-Rolling-file-vault': ['Encryption', 'File Vault'],
  X_Change: ['IP Spoof', 'OPSEC'],
  'X-Change': ['IP Spoof', 'OPSEC'],
};

const TOPIC_LABELS = {
  featured: null,
  'hidden-from-portfolio': null,
  ctf: 'CTF',
  hackthebox: 'HackTheBox',
  tryhackme: 'TryHackMe',
  pentest: 'Pentest',
  cybersecurity: 'CyberSec',
  'ethical-hacking': 'Ethical Hacking',
  malware: 'Malware',
  'malware-analysis': 'Malware Analysis',
  osint: 'OSINT',
  recon: 'Recon',
  'kali-linux': 'Kali',
  linux: 'Linux',
  networking: 'Network',
  encryption: 'Encryption',
  cryptography: 'Crypto',
  automation: 'Automation',
  tool: 'Tool',
  'reverse-engineering': 'Rev Eng',
  bash: 'Bash',
  python: 'Python',
  web: 'Web',
  gui: 'GUI',
  security: 'Security',
  scripting: 'Scripting',
  exploitation: 'Exploitation',
  spoofing: 'Spoofing',
  opsec: 'OPSEC',
  'file-transfer': 'File Transfer',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function formatTopic(topic) {
  if (topic in TOPIC_LABELS) return TOPIC_LABELS[topic];
  return topic.replace(/-/g, ' ');
}

function buildTags(repo, limit, includeFeatured = false) {
  const hardcodedTags = REPO_TAGS[repo.name] || [];
  const githubTopics = (repo.topics || [])
    .map((topic) => formatTopic(topic))
    .filter((topic) => topic !== null);

  let allTags = [...new Set([...hardcodedTags, ...githubTopics])];
  if (allTags.length === 0) allTags = [repo.language || 'Tool', 'Open Source'];

  const tags = allTags.slice(0, limit).map((tag) => `<span class="proj-tag${limit === 2 ? ' sm tag-plain' : ''}">${escapeHtml(tag)}</span>`).join('');
  return includeFeatured ? `${tags}<span class="proj-tag accent-tag">Featured</span>` : tags;
}

function buildCard(repo) {
  const lang = repo.language || null;
  const badge = LANG_BADGES[lang] || LANG_BADGES.default;
  const desc = repo.description || 'No description provided.';
  const date = new Date(repo.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const emoji = REPO_EMOJI[repo.name] || REPO_EMOJI.default;
  const funcTags = buildTags(repo, 2);

  return `
        <div class="project-card">
          <div class="pc-header">
            <div class="pc-left">
              <span class="pc-emoji">${emoji}</span>
              <span class="lang-badge-icon">${badge}</span>
            </div>
            <div class="pc-tags">${funcTags}</div>
          </div>
          <h4 class="pc-title">${escapeHtml(repo.name.replace(/[-_]/g, ' '))}</h4>
          <p class="pc-desc">${escapeHtml(desc)}</p>
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener" class="pc-link">View →</a>
          <span class="pc-date mono">${date}</span>
        </div>`;
}

function buildFeaturedCard(repo, index) {
  const desc = repo.description || 'No description provided.';
  const date = new Date(repo.pushed_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const tags = buildTags(repo, 2, true);
  const number = String(index + 1).padStart(2, '0');

  return `
        <div class="project-featured">
          <div class="project-featured-meta">
            <span class="proj-num mono accent">${number}</span>
            <div class="proj-tags">
              ${tags}
            </div>
          </div>
          <h3 class="proj-title">${escapeHtml(repo.name.replace(/[-_]/g, ' '))}</h3>
          <p class="proj-desc">${escapeHtml(desc)}</p>
          <div class="proj-links">
            <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener" class="proj-link">
              View Code <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
          <span class="proj-date mono">${date}</span>
        </div>`;
}

async function fetchRepos() {
  const response = await fetch('https://api.github.com/users/Shr1H4x/repos?sort=pushed&per_page=100', {
    headers: {
      Accept: 'application/vnd.github.mercy-preview+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}`);
  }

  const repos = await response.json();
  if (!Array.isArray(repos)) {
    throw new Error('Unexpected response format');
  }

  return repos.filter((repo) =>
    !repo.fork &&
    !HIDDEN_REPOS.has(repo.name) &&
    !(repo.topics && repo.topics.includes('hidden-from-portfolio'))
  );
}

async function main() {
  const repos = await fetchRepos();
  const featuredRepos = repos.filter((repo) => repo.topics && repo.topics.includes('featured'));
  const allRepos = repos.filter((repo) => !(repo.topics && repo.topics.includes('featured')));

  const projectSection = `
      <!-- PROJECTS_STATIC_START -->
      <div class="featured-projects" id="featuredProjectsGrid" data-reveal>
${featuredRepos.map((repo, index) => buildFeaturedCard(repo, index)).join('\n')}
      </div>

      <div class="projects-divider" data-reveal>
        <span class="mono">all_projects</span>
        <div class="divider-line"></div>
      </div>

      <div class="projects-grid" id="githubProjectsGrid" data-reveal>
${allRepos.map((repo) => buildCard(repo)).join('\n')}
      </div>
      <!-- PROJECTS_STATIC_END -->`;

  const sourceIndex = await readFile(path.join(rootDir, 'index.html'), 'utf8');
  const renderedIndex = sourceIndex
    .replace(/<!-- PROJECTS_STATIC_START -->[\s\S]*?<!-- PROJECTS_STATIC_END -->/, projectSection)
    .replace('View all 15 repos on GitHub', `View all ${repos.length} repos on GitHub`);

  await mkdir(distDir, { recursive: true });
  await writeFile(path.join(distDir, 'index.html'), renderedIndex, 'utf8');

  for (const fileName of ['style.css', 'writeups.css', 'script.js', 'robots.txt', 'sitemap.xml', 'CNAME']) {
    try {
      await cp(path.join(rootDir, fileName), path.join(distDir, fileName));
    } catch {
      // Some files are optional during local generation.
    }
  }

  for (const folderName of ['image', 'writeups']) {
    try {
      await cp(path.join(rootDir, folderName), path.join(distDir, folderName), { recursive: true });
    } catch {
      // Optional during initial generation or if assets are missing.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});