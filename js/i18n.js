/* ===================================
   LANGUAGE SWITCHER — i18n Engine
   Marouane Radi Portfolio
   =================================== */

'use strict';

// ============================================
// LANGUAGE SWITCHER STATE
// ============================================

// Default language (falls back to saved preference or 'en')
let currentLang = localStorage.getItem('lang') || 'en';

// Languages that use RTL text direction
const RTL_LANGS = ['ar'];

// ============================================
// APPLY TRANSLATIONS TO THE DOM
// applyLang(lang) — iterates over all elements
// with [data-i18n] attribute and replaces their
// content with the correct translation.
// ============================================
function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;

  // --- 1. Set page direction & lang attribute ---
  const isRTL = RTL_LANGS.includes(lang);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Add/remove a body class so CSS can target RTL states
  document.body.classList.toggle('rtl', isRTL);

  // --- 2. Translate all [data-i18n] elements ---
  // data-i18n="key"         → sets innerHTML
  // data-i18n-placeholder   → sets placeholder attribute
  // data-i18n-options       → updates <select> options
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // --- 3. Update placeholder attributes ---
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  // --- 4. Update <select> options ---
  const subjectSelect = document.getElementById('subject');
  if (subjectSelect) {
    const opts = subjectSelect.querySelectorAll('option');
    const keys = ['form_opt1', 'form_opt2', 'form_opt3', 'form_opt4'];
    opts.forEach((opt, i) => {
      if (keys[i] && t[keys[i]]) {
        opt.textContent = t[keys[i]];
      }
    });
  }

  // --- 5. Update logo tooltip / aria if needed ---
  // (logo text stays as "MR." — brand mark, language-neutral)

  // --- 6. Sync the custom dropdown trigger display ---
  // (The item click handler updates it too, but this covers [L] keyboard shortcut)
  const flagEl  = document.getElementById('langDDFlag');
  const labelEl = document.getElementById('langDDLabel');
  const langMeta = { en:{flag:'EN',short:'EN'}, fr:{flag:'🇫🇷',short:'FR'}, ar:{flag:'🇲🇦',short:'AR'}, es:{flag:'🇪🇸',short:'ES'} };
  if (flagEl && labelEl && langMeta[lang]) {
    flagEl.textContent  = langMeta[lang].flag;
    labelEl.textContent = langMeta[lang].short;
  }

  // --- 7. Save to localStorage ---
  localStorage.setItem('lang', lang);
  currentLang = lang;

  // --- 8. Show toast notification ---
  const langNames = { en: 'EN English', fr: '🇫🇷 Français', ar: '🇲🇦 العربية', es: '🇪🇸 Español' };
  if (typeof showToast === 'function') {
    showToast(`${langNames[lang]} selected`);
  }
}

// ============================================
// BUILD THE LANGUAGE SWITCHER UI IN THE NAV
// Fully custom dropdown — no native <select>
// ============================================
function buildLangSwitcher() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  const langs = [
    { code: 'en', flag: 'EN', label: 'English',  short: 'EN' },
    { code: 'fr', flag: '🇫🇷', label: 'Français', short: 'FR' },
    { code: 'ar', flag: '🇲🇦', label: 'العربية',  short: 'AR' },
    { code: 'es', flag: '🇪🇸', label: 'Español',  short: 'ES' },
  ];

  const li = document.createElement('li');
  li.className = 'lang-switcher-wrap';

  // Find the current lang object for the trigger label
  const getActive = () => langs.find(l => l.code === currentLang) || langs[0];

  li.innerHTML = `
    <div class="lang-dd" id="langDD" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
      <!-- Trigger button -->
      <div class="lang-dd-trigger">
        <span class="lang-dd-globe">🌐</span>
        <span class="lang-dd-flag" id="langDDFlag">${getActive().flag}</span>
        <span class="lang-dd-label" id="langDDLabel">${getActive().short}</span>
        <svg class="lang-dd-arrow" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <!-- Dropdown panel -->
      <ul class="lang-dd-menu" id="langDDMenu" role="listbox">
        ${langs.map(l => `
          <li class="lang-dd-item${l.code === currentLang ? ' lang-dd-active' : ''}"
              data-lang="${l.code}" role="option"
              aria-selected="${l.code === currentLang}">
            <span class="lang-dd-item-flag">${l.flag}</span>
            <span class="lang-dd-item-label">${l.label}</span>
            ${l.code === currentLang ? '<span class="lang-dd-check">✓</span>' : ''}
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  // Insert before the last nav item (Contact CTA)
  const items = navMenu.querySelectorAll('li');
  navMenu.insertBefore(li, items[items.length - 1]);

  // ---- Behaviour ----
  const dd      = li.querySelector('#langDD');
  const menu    = li.querySelector('#langDDMenu');
  const flagEl  = li.querySelector('#langDDFlag');
  const labelEl = li.querySelector('#langDDLabel');

  // Toggle open/close
  function openDD() {
    dd.classList.add('lang-dd-open');
    dd.setAttribute('aria-expanded', 'true');
  }
  function closeDD() {
    dd.classList.remove('lang-dd-open');
    dd.setAttribute('aria-expanded', 'false');
  }
  function toggleDD() {
    dd.classList.contains('lang-dd-open') ? closeDD() : openDD();
  }

  dd.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDD();
  });

  // Close when clicking outside
  document.addEventListener('click', closeDD);

  // Select a language
  menu.querySelectorAll('.lang-dd-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = item.dataset.lang;
      const active = langs.find(l => l.code === lang);

      // Update trigger display
      flagEl.textContent  = active.flag;
      labelEl.textContent = active.short;

      // Update active state in list
      menu.querySelectorAll('.lang-dd-item').forEach(i => {
        i.classList.remove('lang-dd-active');
        i.setAttribute('aria-selected', 'false');
        i.querySelector('.lang-dd-check')?.remove();
      });
      item.classList.add('lang-dd-active');
      item.setAttribute('aria-selected', 'true');
      const check = document.createElement('span');
      check.className = 'lang-dd-check';
      check.textContent = '✓';
      item.appendChild(check);

      applyLang(lang);
      closeDD();
    });
  });

  // Keyboard navigation
  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDD(); }
    if (e.key === 'Escape') closeDD();
  });
}

// ============================================
// INIT — runs after DOM is ready
// ============================================
function initI18n() {
  buildLangSwitcher();
  applyLang(currentLang);
}

// Wait for DOM then initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
