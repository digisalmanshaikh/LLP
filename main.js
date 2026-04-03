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
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');

function closeDrawer() {
  drawer.classList.remove('open');
  toggle.classList.remove('open');
  document.body.style.overflow = '';
}

function openDrawer() {
  drawer.classList.add('open');
  toggle.classList.add('open');
  document.body.style.overflow = 'hidden';
}

if (toggle && drawer) {
  // Toggle on hamburger click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close when any nav link is clicked
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeDrawer());
  });

  // Close on outside tap/click (but not on the toggle itself)
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !toggle.contains(e.target)) {
      closeDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer when window resizes to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeDrawer();
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
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwDtwm4eXzv2xohCZS6Kkp3Aw51h4humcPyCtu1pDB9pVuiUgpWb2cG3INqGzhHaWQJ/exec';

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
