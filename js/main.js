/* ===================================
   MAROUANE RADI PORTFOLIO — JS
   =================================== */

'use strict';

// ============================================
// LOADING SCREEN
// ============================================
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');
let progress = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 8 + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = 'auto';
      startHeroAnimations();
    }, 600);
  }
  loaderBar.style.width = progress + '%';
  loaderPercent.textContent = Math.round(progress) + '%';
}, 80);

document.body.style.overflow = 'hidden';


// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();


// ============================================
// HERO PARTICLES CANVAS
// ============================================
const heroCanvas = document.getElementById('heroParticles');
const ctx = heroCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * heroCanvas.width;
    this.y = Math.random() * heroCanvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.targetX = this.x;
    this.targetY = this.y;
  }
  update(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      this.x -= dx * force * 0.03;
      this.y -= dy * force * 0.03;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 8), 150);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

let globalMX = heroCanvas.width / 2;
let globalMY = heroCanvas.height / 2;
document.addEventListener('mousemove', e => { globalMX = e.clientX; globalMY = e.clientY; });

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const alpha = (1 - dist / 90) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  particles.forEach(p => {
    p.update(globalMX, globalMY);
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ============================================
// NAV
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
}


// ============================================
// HERO TYPING EFFECT
// ============================================
function startHeroAnimations() {
  const roleEl = document.getElementById('heroRole');
  const roles = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Laravel Developer', 'React Developer'];
  let currentRole = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeRole() {
    const current = roles[currentRole];
    if (isDeleting) {
      roleEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, 50);
    } else {
      roleEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        setTimeout(typeRole, 2200);
        return;
      }
      setTimeout(typeRole, 80);
    }
  }
  setTimeout(typeRole, 1000);

  // Count up stats
  document.querySelectorAll('.hero-stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(count);
    }, 40);
  });
}


// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));


// ============================================
// SKILL BARS (animate on scroll)
// ============================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.w + '%';
        }, i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);


// ============================================
// PARALLAX SCROLLING
// ============================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  const heroGrid = document.querySelector('.hero-grid-overlay');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.3;
  }
  if (heroGrid) {
    heroGrid.style.transform = `translateY(${scrolled * 0.05}px)`;
  }
});


// ============================================
// THEME SWITCHER [T]
// ============================================
const themeBtn = document.getElementById('themeBtn');
let currentTheme = 'dark';

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'light' : '');
  themeBtn.querySelector('.theme-icon').textContent = currentTheme === 'dark' ? '◐' : '●';
  showToast(currentTheme === 'light' ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  localStorage.setItem('theme', currentTheme);
}

themeBtn.addEventListener('click', toggleTheme);

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  currentTheme = 'light';
  document.documentElement.setAttribute('data-theme', 'light');
  themeBtn.querySelector('.theme-icon').textContent = '●';
}


// ============================================
// TOAST NOTIFICATIONS
// ============================================
const toast = document.getElementById('toast');
let toastTimeout;

function showToast(msg, duration = 2500) {
  clearTimeout(toastTimeout);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}


// ============================================
// KEYBOARD SHORTCUTS
// ============================================
const shortcuts = {
  't': () => toggleTheme(),
  'h': () => { document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }); showToast('🏠 Jumped to top'); },
  'p': () => { document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); showToast('📁 Projects section'); },
  'c': () => { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); showToast('📬 Contact section'); },
};

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'Escape') {
    deactivateMatrix();
    return;
  }
  if (shortcuts[e.key.toLowerCase()]) {
    shortcuts[e.key.toLowerCase()]();
  }
  // Konami Code handler
  konamiCheck(e.key);
  // Matrix exit
  if (matrixActive) deactivateMatrix();
});


// ============================================
// KONAMI CODE EASTER EGG
// ============================================
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
let matrixActive = false;

function konamiCheck(key) {
  if (key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      activateMatrix();
    }
  } else {
    konamiIndex = 0;
  }
}

// ============================================
// MATRIX RAIN EASTER EGG
// ============================================
const matrixCanvas = document.getElementById('matrixCanvas');
const mCtx = matrixCanvas.getContext('2d');
const konamiMsg = document.getElementById('konamiMsg');
let matrixInterval;

function activateMatrix() {
  matrixActive = true;
  matrixCanvas.classList.remove('hidden');
  matrixCanvas.classList.add('active');
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  konamiMsg.classList.add('show');
  setTimeout(() => konamiMsg.classList.remove('show'), 3000);

  const cols = Math.floor(matrixCanvas.width / 16);
  const drops = Array(cols).fill(1);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]';

  matrixInterval = setInterval(() => {
    mCtx.fillStyle = 'rgba(0,0,0,0.05)';
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.fillStyle = '#00d4ff';
    mCtx.font = '14px Space Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      mCtx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00d4ff';
      mCtx.fillText(char, i * 16, drops[i] * 16);
      if (drops[i] * 16 > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 33);

  showToast('🔓 Matrix mode — press any key to exit', 5000);
}

function deactivateMatrix() {
  if (!matrixActive) return;
  matrixActive = false;
  clearInterval(matrixInterval);
  mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixCanvas.classList.remove('active');
  matrixCanvas.classList.add('hidden');
  konamiMsg.classList.remove('show');
  showToast('👾 Welcome back, developer.');
}


// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"] span');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';

    setTimeout(() => {
      btn.textContent = '✓ Sent!';
      showToast('📨 Message sent! Marouane will reply soon.');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }, 1200);
  });
}


// ============================================
// SKILL CARD HOVER INTERACTION
// ============================================
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 12;
    const tiltY = (x - 0.5) * -12;
    card.style.transform = `translateY(-6px) perspective(400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ============================================
// PROJECT CARD TILT
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 8;
    const tiltY = (x - 0.5) * -8;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
  });
});


// ============================================
// CERT CARD HOVER GLOW
// ============================================
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    card.querySelector('.cert-glow').style.background =
      `linear-gradient(90deg, transparent ${x - 20}%, var(--accent) ${x}%, transparent ${x + 20}%)`;
  });
});


// ============================================
// SMOOTH ANCHOR SCROLLING WITH OFFSET
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ============================================
// HIDDEN MESSAGE IN CONSOLE
// ============================================
console.log(`
%c
███╗   ███╗ █████╗ ██████╗  ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗███████╗
████╗ ████║██╔══██╗██╔══██╗██╔═══██╗██║   ██║██╔══██╗████╗  ██║██╔════╝
██╔████╔██║███████║██████╔╝██║   ██║██║   ██║███████║██╔██╗ ██║█████╗  
██║╚██╔╝██║██╔══██║██╔══██╗██║   ██║██║   ██║██╔══██║██║╚██╗██║██╔══╝  
██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║███████╗
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝

%c Hey you! 👋 Curious dev detected.

%c ✉  radimarouane05@gmail.com
%c 📱  +212 704 460 903
%c 🔗  github.com/marouaneradi

%c 🎮 Try the Konami Code: ↑↑↓↓←→←→BA
%c ⌨  Keyboard shortcuts: [T] theme | [H] home | [P] projects | [C] contact
`,
  'color: #00d4ff; font-size: 10px; font-family: monospace',
  'color: #f0f4f8; font-size: 14px; font-weight: bold',
  'color: #00d4ff',
  'color: #00d4ff',
  'color: #00d4ff',
  'color: #f59e0b; font-size: 12px',
  'color: #10b981; font-size: 12px'
);

console.log('%c 🔑 SECRET: This portfolio was crafted with passion and a lot of caffeine ☕', 'color: #7c3aed; font-style: italic; font-size: 11px');


// ============================================
// PAGE TRANSITION (smooth entry)
// ============================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});


// ============================================
// GLITCH EFFECT ON HERO NAME (random)
// ============================================
function triggerGlitch() {
  const names = document.querySelectorAll('.hero-name');
  names.forEach(name => {
    name.style.animation = 'none';
    name.offsetHeight; // reflow
    name.style.animation = '';
  });
  setTimeout(triggerGlitch, Math.random() * 8000 + 4000);
}
setTimeout(triggerGlitch, 5000);


// ============================================
// ACTIVE SECTION HIGHLIGHT IN NAV
// ============================================
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

document.querySelectorAll('section[id]').forEach(section => {
  sectionObserver.observe(section);
});


// ============================================
// CURSOR MAGNETISM ON BUTTONS
// ============================================
document.querySelectorAll('.btn, .proj-btn, .social-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
  });
});


// ============================================
// RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});
