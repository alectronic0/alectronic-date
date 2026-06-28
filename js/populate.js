/**
 * populate.js - Render all page content from data.json
 * Generic, modular rendering based on section type
 */

class ContentRenderer {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    try {
      // Fetch data.json
      const response = await fetch('./data/content.json');
      if (!response.ok) throw new Error('Failed to load data.json');
      this.data = await response.json();

      // Render all sections
      if (this.data.sections) {
        this.data.sections.forEach(section => {
          this.renderSection(section);
        });
      }

      // Re-initialize interactions after rendering
      setTimeout(() => {
        if (window.initializeScrollSpy) window.initializeScrollSpy();
        if (window.initializeAccordion) window.initializeAccordion();
        if (window.initializeLightbox) window.initializeLightbox();
      }, 10);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  /**
   * Generic section renderer - routes to specific type handler
   */
  renderSection(section) {
    const target = document.querySelector(`[data-section="${section.id}"]`);
    if (!target) {
      console.warn(`No target found for section: ${section.id}`);
      return;
    }

    let html = '';

    // Add intro if exists
    if (section.content.intro) {
      html += `<p>${section.content.intro}</p>`;
    }

    // Route to type-specific renderer
    switch (section.type) {
      case 'facts-grid':
        html += this.renderFactsGrid(section.content);
        break;
      case 'filterable-grid':
        html += this.renderFilterableGrid(section.content);
        break;
      case 'grouped-grid':
        html += this.renderGroupedGrid(section.content);
        break;
      case 'button-grid':
        html += this.renderButtonGrid(section.content);
        break;
      default:
        console.warn(`Unknown section type: ${section.type}`);
    }

    // Add external link if exists
    if (section.content.externalLink) {
      html += this.renderExternalLink(section.content.externalLink);
    }

    target.innerHTML = html;
  }

  /**
   * Render facts grid (profile)
   */
  renderFactsGrid(content) {
    let html = '<div class="fact-grid">';

    content.facts.forEach(fact => {
      if (fact.values) {
        // Multi-line values
        html += `
          <div class="fact">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <div class="fact-value fact-multiline">
                ${fact.values.map(v => `<div>${v}</div>`).join('')}
              </div>
            </div>
          </div>
        `;
      } else if (fact.mapUrl) {
        // Location with map link
        html += `
          <div class="fact">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <a href="${fact.mapUrl}" target="_blank" rel="noopener" class="fact-link">View on Maps</a>
            </div>
          </div>
        `;
      } else {
        // Simple value
        html += `
          <div class="fact">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <div class="fact-value">${fact.value}</div>
            </div>
          </div>
        `;
      }
    });

    html += '</div>';
    return html;
  }

  /**
   * Render filterable grid (movies, games)
   */
  renderFilterableGrid(content) {
    let html = '';

    // Genre filters
    if (content.genres) {
      html += '<div class="genre-filters">';
      content.genres.forEach(genre => {
        html += `<button class="genre-filter-btn" data-genre="${genre}">${genre}</button>`;
      });
      html += '</div>';
    }

    // Item grid
    html += '<div class="poster-grid">';
    content.items.forEach(item => {
      const genreStr = item.genres.join(',');
      html += `<img src="${item.image}" alt="${item.title}" data-genres="${genreStr}" loading="lazy">`;
    });
    html += '</div>';

    return html;
  }

  /**
   * Render grouped grid (books with categories)
   */
  renderGroupedGrid(content) {
    let html = '';

    content.groups.forEach(group => {
      html += `
        <div class="grid-group">
          <h3>${group.title}</h3>
          <div class="poster-grid">
            ${group.items.map(item => `<img src="${item.image}" alt="${item.title}" loading="lazy">`).join('')}
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Render button grid (contact)
   */
  renderButtonGrid(content) {
    let html = '<div class="contact-buttons">';

    content.buttons.forEach(btn => {
      const isMailto = btn.url.startsWith('mailto:');
      const target = isMailto ? '' : 'target="_blank" rel="noopener"';
      html += `
        <a href="${btn.url}" ${target} class="contact-btn" title="${btn.name}" style="color: ${btn.color}">
          <i class="${btn.icon}"></i>
          <span>${btn.name}</span>
        </a>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Render external link (Letterboxd, Goodreads, etc.)
   */
  renderExternalLink(link) {
    return `
      <p style="margin-top: 20px; text-align: center;">
        <a href="${link.url}" target="_blank" rel="noopener" class="contact-btn" style="color: ${link.color}; display: inline-flex;">
          <i class="${link.icon}"></i>
          <span>${link.text}</span>
        </a>
      </p>
    `;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ContentRenderer();
});
