/* ============================================================
   Alec's Dating Profile — interactions
   Scroll-spy nav · accessible accordion · lightbox
   ============================================================ */

let scrollSpyInitialized = false;
let accordionInitialized = false;
let lightboxInitialized = false;

/* ── Scroll-spy: highlight active nav link ── */
function initializeScrollSpy() {
  if (scrollSpyInitialized) return;
  scrollSpyInitialized = true;

  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove('active'));
            const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (active) {
              active.classList.add('active');
              active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }
}

/* ── Accordion (progressive disclosure) ──
   Cards render open by default (no-JS friendly); JS collapses them
   on load and wires up accessible toggle buttons. */
function initializeAccordion() {
  if (accordionInitialized) return;
  accordionInitialized = true;

  const accItems = document.querySelectorAll('.acc-item');
  accItems.forEach((item) => {
    const header = item.querySelector('.acc-header');
    if (!header) return;

    // Collapse all by default once JS is available
    item.classList.remove('open');
    header.setAttribute('aria-expanded', 'false');

    // Only add listener if not already present
    if (!header._listenerAttached) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      header._listenerAttached = true;
    }
  });
}

/* ── Lightbox for every gallery / zoomable image ── */
function initializeLightbox() {
  if (lightboxInitialized) return;
  lightboxInitialized = true;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (!lightbox || !lightboxImg) return;

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Attach listeners to lightbox itself
  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach listeners to all image types
  const imageSelectors = '[data-zoom], .mosaic-strip img, .poster-grid img, .photo-grid img, .feature img, .date-card img, .place-card img, .logo-tile img, .moments-photos img, .dislike-image, .photo-modal-img';

  document.addEventListener('click', (e) => {
    const img = e.target.closest(imageSelectors);
    if (img && e.target.tagName === 'IMG') {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeScrollSpy();
  initializeAccordion();
  initializeLightbox();
});
