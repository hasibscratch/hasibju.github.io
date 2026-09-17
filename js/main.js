/* ═══════════════════════════════════════════════
   Hasibul Islam Portfolio — Main JS
   ═══════════════════════════════════════════════ */

/* ── NAVBAR SCROLL ────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE NAV TOGGLE ────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── ACTIVE NAV ON SCROLL ─────────────────────── */
const sections    = document.querySelectorAll('section[id]');
const navAs       = document.querySelectorAll('.nav-links a');
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => secObserver.observe(s));

/* ── ROLE TYPER ───────────────────────────────── */
const roles = [
  'GIS & Geospatial Analytics Specialist',
  'Power BI Dashboard Developer',
  'Spatial Data Scientist',
  'KoboToolbox & Data Systems Expert',
  'Web & Full-Stack Developer',
  'AI-Augmented Analyst',
];
let roleIdx = 0;
const roleEl = document.getElementById('role-display');

function cycleRole() {
  if (!roleEl) return;
  roleEl.style.opacity = '0';
  roleEl.style.transform = 'translateY(10px)';
  setTimeout(() => {
    roleEl.textContent = roles[roleIdx % roles.length];
    roleEl.style.transition = 'opacity .4s ease, transform .4s ease';
    roleEl.style.opacity   = '1';
    roleEl.style.transform = 'translateY(0)';
    roleIdx++;
  }, 320);
}
cycleRole();
setInterval(cycleRole, 3200);

/* ── PROJECT FILTER ───────────────────────────── */
const ftabs  = document.querySelectorAll('.ftab');
const pcards = document.querySelectorAll('.pcard');

ftabs.forEach(tab => {
  tab.addEventListener('click', () => {
    ftabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    pcards.forEach(card => {
      const cats = card.dataset.cat || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ── SCROLL REVEAL ────────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.tl-card, .skill-cat, .pcard, .edu-card, .cert-item, .ccard, .contact-form, .profile-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(el => revealObs.observe(el));

/* ── SMOOTH SCROLL ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── TOAST ────────────────────────────────────── */
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ════════════════════════════════════════════════
   SCREENSHOT GALLERY LIGHTBOX
   ────────────────────────────────────────────────
   Supports single image OR multiple images per project.

   SINGLE image (simple):
     openScreenshot('img/foo.jpg', 'Project Title')

   MULTIPLE images (gallery):
     openScreenshot([
       { src: 'img/foo1.jpg', caption: 'Overview' },
       { src: 'img/foo2.jpg', caption: 'Detail view' },
       { src: 'img/foo3.jpg', caption: 'Mobile view' },
     ], 'Project Title')
   ════════════════════════════════════════════════ */

let _gallery  = [];  // [{ src, caption }]
let _galIdx   = 0;
let _galTitle = '';

function openScreenshot(images, title) {
  // Normalise: single string → array of one object
  if (typeof images === 'string') {
    _gallery  = [{ src: images, caption: '' }];
    _galTitle = title || '';
  } else {
    _gallery  = Array.isArray(images) ? images : [images];
    _galTitle = title || '';
  }
  _galIdx = 0;

  document.getElementById('lb-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  _renderGallery();
}

function _renderGallery() {
  const box     = document.getElementById('lb-box');
  const total   = _gallery.length;
  const current = _gallery[_galIdx];

  box.innerHTML = `
    <button class="lb-close" onclick="closeScreenshot()">✕</button>
    <div class="lb-stage">
      ${total > 1 ? `<div class="lb-counter">${_galIdx + 1} / ${total}</div>` : ''}
      <div id="lb-img-wrap">
        <div class="lb-loading"><div class="lb-spinner"></div><span>Loading…</span></div>
      </div>
      ${total > 1 ? `
        <button class="lb-arrow lb-prev ${_galIdx === 0 ? 'hidden' : ''}"
                onclick="galleryNav(-1)" aria-label="Previous">&#8249;</button>
        <button class="lb-arrow lb-next ${_galIdx === total - 1 ? 'hidden' : ''}"
                onclick="galleryNav(1)"  aria-label="Next">&#8250;</button>
      ` : ''}
    </div>
    <div class="lb-footer">
      <div class="lb-caption">${_galTitle}</div>
      ${current.caption ? `<div class="lb-sub-caption">${current.caption}</div>` : ''}
      ${total > 1 ? `
        <div class="lb-dots">
          ${_gallery.map((_, i) => `
            <button class="lb-dot ${i === _galIdx ? 'active' : ''}"
                    onclick="galleryGoto(${i})"
                    aria-label="Go to image ${i + 1}"></button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Load image
  const wrap = document.getElementById('lb-img-wrap');
  const img  = new Image();
  img.onload  = () => {
    wrap.innerHTML = `<img src="${current.src}" alt="${current.caption || _galTitle}" class="lb-img">`;
  };
  img.onerror = () => {
    wrap.innerHTML = `
      <div class="lb-no-img">
        <div class="lb-no-icon">📸</div>
        <h3>Screenshot not yet uploaded</h3>
        <p>Upload as <code>${current.src}</code> to your GitHub <code>img/</code> folder and it will appear here automatically.</p>
      </div>`;
  };
  img.src = current.src;
}

function galleryNav(dir) {
  const next = _galIdx + dir;
  if (next >= 0 && next < _gallery.length) {
    _galIdx = next;
    _renderGallery();
  }
}

function galleryGoto(idx) {
  _galIdx = idx;
  _renderGallery();
}

function closeScreenshot() {
  document.getElementById('lb-overlay').classList.remove('open');
  document.body.style.overflow = '';
  _gallery  = [];
  _galIdx   = 0;
  _galTitle = '';
}

// Close on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('lb-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeScreenshot();
    });
  }
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')     closeScreenshot();
  if (e.key === 'ArrowRight') galleryNav(1);
  if (e.key === 'ArrowLeft')  galleryNav(-1);
});

/* ── CONTACT FORM ─────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn    = document.getElementById('f-btn');
  const status = document.getElementById('f-status');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value;
  const msg     = document.getElementById('f-msg').value.trim();

  const mailto = `mailto:hasibju@gmail.com`
    + `?subject=${encodeURIComponent('Portfolio Enquiry — ' + (subject || 'General'))}`
    + `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${subject}\n\nMessage:\n${msg}`)}`;

  window.location.href = mailto;

  setTimeout(() => {
    status.className    = 'form-status success';
    status.textContent  = '✅ Your email client has opened. You can also email hasibju@gmail.com directly.';
    btn.disabled        = false;
    btn.textContent     = 'Send Message →';
    e.target.reset();
    showToast('Message ready in your email client!');
  }, 900);
}
