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
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
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
    roleEl.style.opacity  = '1';
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
      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'cardIn .35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* Card animation keyframe */
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes cardIn {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(styleEl);

/* ── SCROLL REVEAL ────────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.tl-card, .skill-cat, .pcard, .edu-card, .cert-item, .ccard, .contact-form, .profile-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ────────────────────────── */
function animateCount(el, target, suffix) {
  const num  = parseInt(target);
  const step = Math.ceil(num / 45);
  let cur    = 0;
  const t    = setInterval(() => {
    cur = Math.min(cur + step, num);
    el.textContent = cur + suffix;
    if (cur >= num) clearInterval(t);
  }, 30);
}

const statEls = document.querySelectorAll('.hstat-n[data-target]');
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    statEls.forEach(el => {
      const raw    = el.dataset.target || el.textContent;
      const suffix = el.textContent.replace(/\d/g, '');
      animateCount(el, raw, suffix);
    });
    statsObs.disconnect();
  }
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

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

/* ── CONTACT FORM ─────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn    = document.getElementById('f-btn');
  const status = document.getElementById('f-status');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value;
  const msg     = document.getElementById('f-msg').value.trim();

  // mailto fallback — replace with Formspree or EmailJS for no-server form handling
  const mailto = `mailto:hasibju@gmail.com`
    + `?subject=${encodeURIComponent('Portfolio Enquiry — ' + (subject || 'General'))}`
    + `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${subject}\n\nMessage:\n${msg}`)}`;

  window.location.href = mailto;

  setTimeout(() => {
    status.className = 'form-status success';
    status.textContent = '✅ Your email client has opened with the message ready to send. Alternatively email hasibju@gmail.com directly.';
    btn.disabled = false;
    btn.textContent = 'Send Message →';
    e.target.reset();
    showToast('Message ready in your email client!');
  }, 900);
}

/* ── FORMSPREE UPGRADE (optional, uncomment to use) ─
   Sign up free at formspree.io, get your form ID,
   and replace the handleFormSubmit function above with:

async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('f-btn');
  const status = document.getElementById('f-status');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    const resp = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(e.target),
    });
    if (resp.ok) {
      status.className = 'form-status success';
      status.textContent = '✅ Message sent! I will reply within 24 hours.';
      e.target.reset();
      showToast('Message sent successfully!');
    } else { throw new Error(); }
  } catch {
    status.className = 'form-status error';
    status.textContent = '❌ Something went wrong. Please email hasibju@gmail.com directly.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
}
─────────────────────────────────────────────── */
