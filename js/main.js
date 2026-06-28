/* ============================================================
   Alec's Dating Profile — interactions
   Scroll-spy nav · accessible accordion · lightbox
   ============================================================ */

/* ── Scroll-spy: highlight active nav link ── */
function initializeScrollSpy() {
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
  const accItems = document.querySelectorAll('.acc-item');
  accItems.forEach((item) => {
    const header = item.querySelector('.acc-header');
    if (!header) return;

    // Collapse all by default once JS is available.
    item.classList.remove('open');
    header.setAttribute('aria-expanded', 'false');

    // Remove existing listeners to prevent duplication
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);

    newHeader.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      newHeader.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

/* ── Lightbox for every gallery / zoomable image ── */
function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-zoom], .mosaic-strip img, .poster-grid img, .photo-grid img, .feature img, .date-card img, .place-card img, .logo-tile img, .moments-photos img, .dislike-image, .photo-modal-item img').forEach((img) => {
      // Remove existing listeners to prevent duplication
      const newImg = img.cloneNode(true);
      img.parentNode.replaceChild(newImg, img);

      newImg.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.src = newImg.currentSrc || newImg.src;
        lightboxImg.alt = newImg.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    // Remove existing close listener
    const newLightbox = lightbox.cloneNode(true);
    lightbox.parentNode.replaceChild(newLightbox, lightbox);

    newLightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeScrollSpy();
  initializeAccordion();
  initializeLightbox();
});
