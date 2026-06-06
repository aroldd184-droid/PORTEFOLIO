/* ============================================
   SCRIPT.JS – Portfolio Dongmo Arold
   ============================================ */

// ──────────────────────────────────────────
// 1. EMAILJS – INITIALISATION
// ──────────────────────────────────────────
// ⚠️ Remplace "TON_PUBLIC_KEY" par ta vraie clé EmailJS
// Voir les étapes d'installation en bas de ce fichier
emailjs.init("TON_PUBLIC_KEY");

// ──────────────────────────────────────────
// 2. MENU MOBILE
// ──────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu au clic sur un lien
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ──────────────────────────────────────────
// 3. ACTIVE LINK AU SCROLL
// ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  allLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

// ──────────────────────────────────────────
// 4. BARRE DE COMPÉTENCES (INTERSECTION OBSERVER)
// ──────────────────────────────────────────
const fills = document.querySelectorAll('.skill-fill');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.dataset.w + '%';
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });

fills.forEach(f => observer.observe(f));

// ──────────────────────────────────────────
// 5. FORMULAIRE DE CONTACT (EMAILJS)
// ──────────────────────────────────────────
const form       = document.getElementById('contactForm');
const btnText    = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const formSuccess= document.getElementById('formSuccess');
const formError  = document.getElementById('formError');

// Validation
function validateForm() {
  let valid = true;
  const fields = [
    { id: 'prenom',  errId: 'errPrenom',  label: 'Prénom requis.'  },
    { id: 'nom',     errId: 'errNom',     label: 'Nom requis.'     },
    { id: 'sujet',   errId: 'errSujet',   label: 'Sujet requis.'   },
    { id: 'message', errId: 'errMessage', label: 'Message requis.' },
  ];

  fields.forEach(f => {
    const el  = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el.value.trim()) {
      err.textContent = f.label;
      valid = false;
    } else {
      err.textContent = '';
    }
  });

  // Email
  const emailEl  = document.getElementById('email');
  const emailErr = document.getElementById('errEmail');
  const emailReg = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/i;
  if (!emailReg.test(emailEl.value.trim())) {
    emailErr.textContent = 'Email invalide.';
    valid = false;
  } else {
    emailErr.textContent = '';
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formSuccess.style.display = 'none';
  formError.style.display   = 'none';

  if (!validateForm()) return;

  // Afficher le loader
  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline-flex';

  const templateParams = {
    from_name:  document.getElementById('prenom').value + ' ' + document.getElementById('nom').value,
    from_email: document.getElementById('email').value,
    subject:    document.getElementById('sujet').value,
    message:    document.getElementById('message').value,
    to_name:    'Arold',
  };

  try {
    // ⚠️ Remplace "SERVICE_ID" et "TEMPLATE_ID" par tes vraies valeurs EmailJS
    await emailjs.send("SERVICE_ID", "TEMPLATE_ID", templateParams);
    formSuccess.style.display = 'flex';
    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    formError.style.display = 'flex';
  } finally {
    btnText.style.display    = 'inline-flex';
    btnLoading.style.display = 'none';
  }
});

// ──────────────────────────────────────────
// 6. ANIMATION ENTRÉE DES CARTES PROJETS
// ──────────────────────────────────────────
const cards = document.querySelectorAll('.projet-card, .skills-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
      }, entry.target.dataset.index * 100 || 0);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach((c, i) => {
  c.style.opacity   = '0';
  c.style.transform = 'translateY(30px)';
  c.style.transition = 'opacity .5s ease, transform .5s ease';
  c.dataset.index   = i;
  cardObserver.observe(c);
});