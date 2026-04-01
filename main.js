/* ============================================
   SHRIGATII ADVISORY — main.js
   - Navbar scroll + mobile drawer
   - Scroll reveal
   - Contact form → Google Sheets
   ============================================ */

// ── 1. NAVBAR SCROLL ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── 2. MOBILE DRAWER ──────────────────────────
const toggle   = document.getElementById('navToggle');
const drawer   = document.getElementById('navDrawer');

if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      drawer.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── 3. SCROLL REVEAL ──────────────────────────
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // stagger siblings
  const parent = el.parentElement;
  const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 0.1}s`;
  ro.observe(el);
});

// ── 4. CONTACT FORM → GOOGLE SHEETS ───────────
// ⚠️ REPLACE THIS URL with your own Google Apps Script Web App URL
// Instructions are in contact.html comments
const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

const form = document.getElementById('leadForm');
const successBox = document.getElementById('formSuccess');
const submitBtn  = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather data
    const data = {
      timestamp:   new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      firstName:   form.querySelector('#fname').value.trim(),
      lastName:    form.querySelector('#lname').value.trim(),
      email:       form.querySelector('#femail').value.trim(),
      phone:       form.querySelector('#fphone').value.trim(),
      company:     form.querySelector('#fcompany').value.trim(),
      service:     form.querySelector('#fservice').value,
      message:     form.querySelector('#fmessage').value.trim(),
    };

    // Disable button
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    if (SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      // Demo mode — just show success
      showSuccess();
      return;
    }

    try {
      await fetch(SHEET_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      showSuccess();
    } catch (err) {
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try WhatsApp or email us directly.');
    }
  });
}

function showSuccess() {
  if (form) form.style.display = 'none';
  if (successBox) successBox.style.display = 'block';
}
