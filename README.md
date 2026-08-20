# DevArcade 🎮

```
 ____  _____   __   __     _    ____   ____    _    ____  _____ 
|  _ \| ____| \ \ / /    / \  |  _ \ / ___|  / \  |  _ \| ____|
| | | |  _|    \ V /    / _ \ | |_) | |     / _ \ | | | |  _|  
| |_| | |___    | |    / ___ \|  _ <| |___ / ___ \| |_| | |___ 
|____/|_____|   |_|   /_/   \_\_| \_\\____/_/   \_\____/|_____|
```

[![Live Demo](https://img.shields.io/badge/Demo-Live_Preview-00f5ff?style=for-the-badge&logo=github&logoColor=black)](https://shrey2250.github.io/DevArcade/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/shrey2250/DevArcade)
[![GitHub API](https://img.shields.io/badge/GitHub-REST_API_v3-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Your GitHub repositories reimagined as a glowing retro pixel-art arcade hall.**

---

## ✨ Features

- 🕹️ **Arcade Cabinet Cards** — each repo rendered as a neon-glowing pixel-art cabinet
- 🎨 **Language-colored Borders** — cabinet glow color matches the repo's primary language
- 📊 **Live GitHub Data** — fetches real stars, forks, last commit, and language breakdown via GitHub API
- 📺 **CRT Scanline Overlay** — authentic retro phosphor screen feel across the entire app
- 🎵 **8-bit Chiptune Audio** — procedurally generated C major arpeggio via Web Audio API (no audio files needed)
- ✨ **Particle Canvas** — 60 drifting pixel particles in neon colors float behind the scene
- 🧩 **Game Modal** — click any cabinet to see repo description, language bars, and last 5 commits
- 📡 **Live Commit History** — fetches the latest 5 commit messages per repo on modal open
- 🔊 **Sound Toggle** — one-click mute/unmute with visual feedback
- 📱 **Responsive** — 1-column layout on mobile

---

## 🛠️ Tech Stack

```text
UI & Layout    :: HTML5, CSS3 (custom pixel border box-shadows, CRT scanlines)
Typography     :: Press Start 2P (Google Fonts), Inter
Animations     :: CSS keyframes (flicker, marquee, blink, spin)
Data           :: GitHub REST API v3 (repos, languages, commits)
Audio          :: Web Audio API (OscillatorNode + GainNode, no external files)
Canvas         :: HTML5 Canvas API (particle system)
Logic          :: Vanilla JavaScript ES6+ (no frameworks)
```

---

## 🚀 Quickstart

```bash
# Clone the repo
git clone https://github.com/shrey2250/DevArcade.git
cd DevArcade

# Open directly in browser (no build step needed)
# Option 1: VS Code Live Server extension
# Option 2: Python HTTP server
python -m http.server 3000
# Then visit http://localhost:3000
```

### Enable GitHub Pages (for live demo URL)
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch** → Branch: `main` → folder: `/ (root)`
3. Save → your site will be live at `https://shrey2250.github.io/DevArcade/`

---

## 📁 Structure

```text
DevArcade/
├── index.html              # Main HTML — scoreboard, cabinet grid, modal
├── assets/
│   ├── css/
│   │   └── arcade.css      # CRT effects, neon styles, cabinet pixel borders
│   └── js/
│       └── arcade.js       # GitHub API, particle canvas, Web Audio, modal logic
└── README.md
```

---

## 👤 Author

**Shrey Kariya**
- GitHub: [@shrey2250](https://github.com/shrey2250)
- LinkedIn: [shrey-kariya](https://www.linkedin.com/in/shrey-kariya-0764762b4/)
- Email: shrey.kariya22@gmail.com

---

<div align="center">
  <sub>DevArcade v1.0 · Built with Vanilla JS, Web Audio API & GitHub REST API · © 2026</sub>
</div>
