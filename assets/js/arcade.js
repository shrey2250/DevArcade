const GITHUB_USER = 'shrey2250';
let reposData = [];
let audioCtx = null;
let audioInterval = null;
let isPlaying = false;

// --- Language color map ---
function getLangStyle(lang) {
  const map = {
    'JavaScript':  { cls: 'lang-js',     hex: '#f7df1e' },
    'TypeScript':  { cls: 'lang-ts',     hex: '#3178c6' },
    'Python':      { cls: 'lang-python', hex: '#4a8fe7' },
    'PHP':         { cls: 'lang-php',    hex: '#9b59b6' },
    'C#':          { cls: 'lang-csharp', hex: '#06d6a0' },
    'HTML':        { cls: 'lang-html',   hex: '#e34c26' },
    'CSS':         { cls: 'lang-css',    hex: '#264de4' },
    'C++':         { cls: 'lang-cpp',    hex: '#f34b7d' },
    'C':           { cls: 'lang-c',      hex: '#555599' },
  };
  return map[lang] || { cls: 'lang-default', hex: '#00f5ff' };
}

// --- Fetch repos ---
async function fetchRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    const repos = await res.json();
    reposData = repos;
    updateScoreboard(repos);
    renderCabinets(repos);
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  } catch (err) {
    document.querySelector('.load-text').textContent = 'ERROR: ' + err.message;
  }
}

// --- Update scoreboard ---
function updateScoreboard(repos) {
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  document.getElementById('totalStars').textContent = totalStars;
  document.getElementById('totalRepos').textContent = repos.length;
}

// --- Render arcade cabinets ---
function renderCabinets(repos) {
  const floor = document.getElementById('arcadeFloor');
  floor.innerHTML = '';

  repos.forEach((repo, idx) => {
    const style = getLangStyle(repo.language);
    const lastPlayed = repo.pushed_at
      ? new Date(repo.pushed_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' })
      : 'N/A';

    const card = document.createElement('div');
    card.className = 'cabinet-card';
    card.style.setProperty('--accent', style.hex);
    card.innerHTML = `
      <div class="cabinet-top" style="background:${style.hex};box-shadow:0 0 12px ${style.hex};"></div>
      <div class="cabinet-screen">
        <div>
          <div class="cabinet-label ${style.cls}">GENRE: ${repo.language || 'UNKNOWN'}</div>
          <div class="cabinet-title">${repo.name.toUpperCase()}</div>
        </div>
        <div class="cabinet-stats">
          <span>⭐ HIGH SCORE: <b>${repo.stargazers_count}</b></span>
          <span>🍴 PLAYERS: <b>${repo.forks_count}</b></span>
          <span>👁 WATCHERS: <b>${repo.watchers_count}</b></span>
        </div>
      </div>
      <div class="cabinet-footer">
        <span>LAST PLAYED: ${lastPlayed}</span>
        <span class="insert-coin">INSERT COIN</span>
      </div>
    `;
    card.style.boxShadow = `0 0 0 2px #333, 4px 4px 0 2px #222, -4px 0 0 2px #222, 0 -4px 0 2px #222, 0 0 20px ${style.hex}33`;
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 0 0 2px ${style.hex}, 4px 4px 0 2px ${style.hex}88, -4px 0 0 2px ${style.hex}88, 0 -4px 0 2px ${style.hex}88, 0 0 30px ${style.hex}55`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = `0 0 0 2px #333, 4px 4px 0 2px #222, -4px 0 0 2px #222, 0 -4px 0 2px #222, 0 0 20px ${style.hex}33`;
    });
    card.addEventListener('click', () => openModal(repo));
    floor.appendChild(card);
  });
}

// --- Open modal ---
async function openModal(repo) {
  document.getElementById('modalTitle').textContent = repo.name.toUpperCase();
  document.getElementById('modalDesc').textContent = repo.description || 'No description provided.';
  document.getElementById('modalLink').href = repo.html_url;
  document.getElementById('modalCommits').innerHTML = '<li style="color:#666;">Loading commit history...</li>';
  document.getElementById('modalLangs').innerHTML = '';
  document.getElementById('gameModal').style.display = 'flex';

  // Fetch languages
  try {
    const langRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/languages`);
    const langs = await langRes.json();
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    const langsHtml = Object.entries(langs).map(([lang, bytes]) => {
      const pct = ((bytes / total) * 100).toFixed(1);
      const style = getLangStyle(lang);
      return `
        <div class="lang-bar-wrap">
          <div class="lang-bar-label"><span class="${style.cls}">${lang}</span><span>${pct}%</span></div>
          <div class="lang-bar-track"><div class="lang-bar-fill" style="width:${pct}%;background:${style.hex};"></div></div>
        </div>`;
    }).join('');
    document.getElementById('modalLangs').innerHTML = langsHtml || '<p style="color:#555;font-size:0.65rem;font-family:Inter,sans-serif;">No language data</p>';
  } catch (_) {}

  // Fetch commits
  try {
    const commitsRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=5`);
    const commits = await commitsRes.json();
    if (Array.isArray(commits) && commits.length > 0) {
      document.getElementById('modalCommits').innerHTML = commits.map(c => {
        const msg = c.commit.message.split('\n')[0].substring(0, 60);
        const date = new Date(c.commit.author.date).toLocaleDateString('en-GB', {day:'2-digit',month:'short'});
        return `<li style="padding:0.4rem 0;border-bottom:1px solid #1a1a1a;"><span style="color:#555;">[${date}]</span> ${msg}</li>`;
      }).join('');
    } else {
      document.getElementById('modalCommits').innerHTML = '<li style="color:#555;">No commits found</li>';
    }
  } catch (_) {
    document.getElementById('modalCommits').innerHTML = '<li style="color:#555;">Could not load commits</li>';
  }
}

// --- Close modal ---
function closeModal(e) {
  if (!e || e.target === document.getElementById('gameModal')) {
    document.getElementById('gameModal').style.display = 'none';
  }
}

// --- Particle Canvas ---
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#00f5ff', '#ff006e', '#ffbe0b', '#06d6a0', '#ffffff'];
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      p.y -= p.speed;
      if (p.y < -4) {
        p.y = canvas.height + 4;
        p.x = Math.random() * canvas.width;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// --- 8-bit Audio via Web Audio API ---
function initAudio() {
  const btn = document.getElementById('soundToggle');
  const freqs = [262, 330, 392, 523, 392, 330]; // C major arpeggio
  let freqIdx = 0;

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.value = 0.04;
      osc.start();
      audioInterval = setInterval(() => {
        osc.frequency.setValueAtTime(freqs[freqIdx % freqs.length], audioCtx.currentTime);
        freqIdx++;
      }, 280);
      isPlaying = true;
      btn.textContent = '🔇';
      btn.title = 'Mute 8-bit music';
    } else {
      clearInterval(audioInterval);
      if (audioCtx) audioCtx.close();
      isPlaying = false;
      btn.textContent = '🔊';
      btn.title = 'Toggle 8-bit music';
    }
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAudio();
  fetchRepos();
});
