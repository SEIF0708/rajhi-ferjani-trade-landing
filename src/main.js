import { certificates } from './data/certificates.js';
import { blogArticles } from './data/blogArticles.js';
import { translations } from './data/translations.js';

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  initCertificates();
  initBlogArticles();
  initModals();
  initLanguageSwitcher();
  initMobileNavigation();
});

// Mobile Navigation Toggle Controller
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');

    // Swap icon between bars and xmark
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    }
  });

  // Close nav drawer when clicking any link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  // Close nav drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });
}

// Render Certificates Vault Grid
function initCertificates() {
  const container = document.getElementById('certificatesContainer');
  if (!container) return;

  container.innerHTML = certificates.map(cert => `
    <div class="cert-card" data-cert-id="${cert.id}">
      <div class="cert-badge-tag" style="background-color: ${cert.color}">
        <i class="fa-solid ${cert.icon}"></i> ${cert.badge}
      </div>
      <div class="cert-header">
        <div class="cert-icon" style="background-color: ${cert.color}">
          <i class="fa-solid ${cert.icon}"></i>
        </div>
        <div class="cert-title-area">
          <h4>${cert.title}</h4>
          <span class="cert-org">${cert.organization}</span>
        </div>
      </div>
      <p class="cert-desc">${cert.detailsText.substring(0, 140)}...</p>
      <div class="cert-inspect-btn">
        <span><i class="fa-solid fa-magnifying-glass-plus"></i> Inspect Seal & Credentials</span>
        <i class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  `).join('');

  // Attach click events
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-cert-id');
      openCertificateModal(id);
    });
  });
}

// Open Certificate Inspection Lightbox
function openCertificateModal(id) {
  const cert = certificates.find(c => c.id === id);
  if (!cert) return;

  const modalBody = document.getElementById('certModalBody');
  const modal = document.getElementById('certModal');

  modalBody.innerHTML = `
    <div class="cert-detail-header">
      <span class="cert-badge-tag" style="background-color: ${cert.color}">${cert.badge}</span>
      <h2 class="cert-detail-title">${cert.title}</h2>
      <div class="cert-detail-org">${cert.organization}</div>
    </div>

    <div class="cert-metadata-grid">
      <div class="meta-field">
        <span class="meta-lbl">Holder / Operator</span>
        <span class="meta-val">${cert.holder}</span>
      </div>
      <div class="meta-field">
        <span class="meta-lbl">Category / Product</span>
        <span class="meta-val">${cert.product || cert.category || cert.brand}</span>
      </div>
      <div class="meta-field">
        <span class="meta-lbl">Certificate / Licence ID</span>
        <span class="meta-val">${cert.certNumber || cert.licenceNumber || cert.year}</span>
      </div>
      <div class="meta-field">
        <span class="meta-lbl">Validity & Inspection</span>
        <span class="meta-val">${cert.validity || cert.year}</span>
      </div>
      <div class="meta-field">
        <span class="meta-lbl">Accreditation / Signatory</span>
        <span class="meta-val">${cert.accreditation || cert.signatory}</span>
      </div>
      <div class="meta-field">
        <span class="meta-lbl">Verification Authority</span>
        <span class="meta-val">${cert.verificationUrl ? `<a href="${cert.verificationUrl}" target="_blank" style="color:${cert.color};text-decoration:underline;">Verified on Website</a>` : 'Official Certificate'}</span>
      </div>
    </div>

    <div class="cert-document-preview">
      <div><strong>OFFICIAL DOCUMENT SEAL & CREDENTIAL TRANSCRIPT:</strong></div>
      <div style="margin-top:8px;">${cert.detailsText}</div>
    </div>

    <div style="display:flex; gap:16px; flex-wrap:wrap;">
      <a href="https://wa.me/905442050779?text=I%20am%20inquiring%20about%20the%20${encodeURIComponent(cert.title)}" target="_blank" class="btn btn-gold btn-block">
        <i class="fa-brands fa-whatsapp"></i> Inquire About Wholesale Batch under this Certificate
      </a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Render Blog Articles (B2B Knowledge Hub)
function initBlogArticles() {
  const container = document.getElementById('blogCardsContainer');
  if (!container) return;

  container.innerHTML = blogArticles.map(art => `
    <div class="blog-card" data-article-id="${art.id}">
      <div class="blog-meta">
        <span><i class="fa-solid fa-folder-open"></i> ${art.category}</span>
        <span><i class="fa-solid fa-clock"></i> ${art.readTime}</span>
      </div>
      <h3>${art.title}</h3>
      <p>${art.summary}</p>
      <div class="blog-author">By ${art.author}</div>
      <button class="btn btn-outline btn-sm open-article-btn">
        <span data-i18n="blog.readArticleBtn">Read Interactive Article</span> <i class="fa-solid fa-book-open"></i>
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-article-id');
      openArticleModal(id);
    });
  });
}

// Open Article Modal Drawer
function openArticleModal(id) {
  const art = blogArticles.find(a => a.id === id);
  if (!art) return;

  const modalBody = document.getElementById('articleModalBody');
  const modal = document.getElementById('articleModal');

  let sectionsHtml = art.sections.map(sec => `
    <div style="margin-bottom:28px;">
      <h3 style="color:var(--primary-olive); font-size:1.3rem; margin-bottom:12px;">${sec.heading}</h3>
      ${sec.text ? `<p style="color:var(--text-muted); line-height:1.7;">${sec.text}</p>` : ''}
      ${sec.table ? `
        <div class="table-responsive">
          <table class="spec-table">
            <thead>
              <tr>${sec.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${sec.table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </div>
  `).join('');

  modalBody.innerHTML = `
    <div style="border-bottom:2px solid var(--border-gold); padding-bottom:16px; margin-bottom:24px;">
      <span class="section-tag">${art.category} • ${art.readTime}</span>
      <h2 style="font-size:2rem; color:var(--primary-olive); margin-top:8px;">${art.title}</h2>
      <div style="font-size:1rem; color:var(--gold-dark); font-weight:600; margin-top:6px;">${art.subtitle}</div>
      <div style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">Authors: ${art.author}</div>
    </div>
    
    <div class="article-content">
      ${sectionsHtml}
    </div>

    <div style="margin-top:40px; padding-top:20px; border-top:1px solid var(--border-light); text-align:center;">
      <a href="https://wa.me/905442050779?text=I%20read%20the%20article%20'${encodeURIComponent(art.title)}'%20and%20want%20to%20discuss" target="_blank" class="btn btn-gold btn-lg btn-block">
        <i class="fa-brands fa-whatsapp"></i> Discuss This Guide with Marketing Team
      </a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Modal Handlers
function initModals() {
  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const certModal = document.getElementById('certModal');
  const certClose = document.getElementById('certModalClose');
  if (certClose) certClose.onclick = () => closeModal(certModal);

  const articleModal = document.getElementById('articleModal');
  const articleClose = document.getElementById('articleModalClose');
  if (articleClose) articleClose.onclick = () => closeModal(articleModal);

  const wholesaleModal = document.getElementById('wholesaleModal');
  const wholesaleClose = document.getElementById('wholesaleModalClose');
  if (wholesaleClose) wholesaleClose.onclick = () => closeModal(wholesaleModal);

  const importModal = document.getElementById('importModal');
  const importClose = document.getElementById('importModalClose');
  if (importClose) importClose.onclick = () => closeModal(importModal);

  // Trigger modals from data-modal buttons
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.onclick = () => {
      const modalId = btn.getAttribute('data-modal');
      const target = document.getElementById(modalId);
      if (target) {
        target.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };
  });

  // Close overlay on background click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  // Close modal on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    }
  });
}

// Multi-Language Switcher
function initLanguageSwitcher() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.getAttribute('data-lang');
      applyTranslations(currentLang);
    });
  });
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // Set HTML dir attribute for Arabic (RTL support)
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedValue(t, key);
    if (val) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const val = getNestedValue(t, key);
    if (val) el.setAttribute('placeholder', val);
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Form Submission Handler
window.handleFormSubmit = function() {
  const type = document.getElementById('formInquiryType').value;
  const name = document.getElementById('formName').value;
  const phone = document.getElementById('formPhone').value;
  const email = document.getElementById('formEmail').value;
  const msg = document.getElementById('formMessage').value;

  const text = `New B2B Website Inquiry:\nType: ${type}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${msg}`;
  const whatsappUrl = `https://wa.me/905442050779?text=${encodeURIComponent(text)}`;

  const feedback = document.getElementById('formFeedback');
  feedback.style.color = '#25D366';
  feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Redirecting to WhatsApp with your inquiry details...';

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 1000);
};
