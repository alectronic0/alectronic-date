/**
 * populate.js - Dynamically populate HTML from data/content.json
 * This script reads JSON content and renders components throughout the page
 */

class ContentPopulator {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    try {
      // Use CONTENT_DATA from data.js (works with file:// protocol)
      // Falls back to fetch if CONTENT_DATA not available
      if (typeof CONTENT_DATA !== 'undefined') {
        this.data = CONTENT_DATA;
      } else {
        const response = await fetch('./data/content.json');
        if (!response.ok) throw new Error('Failed to load content.json');
        this.data = await response.json();
      }

      // Populate sections in order
      this.populateProfile();
      this.populateAlecPhotos();
      this.populateMoviesTV();
      this.populateVideoGames();
      this.populateBooks();
      this.populatePodcasts();
      this.populateMusic();
      this.populateSports();
      this.populatePlaces();
      this.populateGentleDislikes();
      this.populateContact();

      // Re-initialize interactive elements after DOM updates
      // (Wait a tick to ensure all DOM updates are complete)
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
   * Populate profile section with facts and location map
   */
  populateProfile() {
    const factGrid = document.querySelector('.fact-grid');
    if (!factGrid || !this.data?.profile?.facts) return;

    factGrid.innerHTML = this.data.profile.facts.map(fact => {
      if (fact.multiLine && fact.values) {
        // Handle multi-line facts (pronouns, nationality)
        return `
          <div class="fact ${fact.wide ? 'wide' : ''}">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <div class="fact-value fact-multiline">
                ${fact.values.map(v => `<div>${v}</div>`).join('')}
              </div>
            </div>
          </div>
        `;
      } else if (fact.url) {
        // Handle location link - add map embed after facts grid
        setTimeout(() => this.addLocationMap(fact.url), 10);
        return `
          <div class="fact ${fact.wide ? 'wide' : ''}">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <a href="${fact.url}" target="_blank" rel="noopener" class="fact-link">View on Maps</a>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="fact ${fact.wide ? 'wide' : ''}">
            <span class="fact-icon">${fact.icon}</span>
            <div>
              <div class="fact-label">${fact.label}</div>
              <div class="fact-value">${fact.value}</div>
            </div>
          </div>
        `;
      }
    }).join('');
  }

  /**
   * Add embedded Google Maps to profile
   */
  addLocationMap(googleMapsUrl) {
    const factGrid = document.querySelector('.fact-grid');
    if (!factGrid) return;

    // Create embed URL from Google Maps share URL
    // Convert https://www.google.com/maps/place/Welwyn+Garden+City to embed format
    const mapContainer = document.createElement('div');
    mapContainer.className = 'location-map';
    mapContainer.innerHTML = `
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19097.40752999806!2d-0.20288!3d51.8066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d80d3b6d8d5d5d%3A0x1234567890!2sWelwyn%20Garden%20City!5e0!3m2!1sen!2suk!4v1234567890"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
    factGrid.parentNode.insertBefore(mapContainer, factGrid.nextSibling);
  }

  /**
   * Populate Alec photo section with "View all" modal trigger
   */
  populateAlecPhotos() {
    const heroMedia = document.querySelector('.hero-media');
    const mosaicTrack = document.querySelector('.mosaic-track');

    if (heroMedia && this.data?.alecPhotos?.heroImages) {
      // Add "View all" button after images
      const viewAllBtn = document.createElement('button');
      viewAllBtn.className = 'view-all-photos-btn';
      viewAllBtn.innerHTML = '👁️ View all photos';
      viewAllBtn.onclick = () => this.showAlecPhotoModal();
      heroMedia.appendChild(viewAllBtn);
    }

    if (mosaicTrack && this.data?.alecPhotos?.allPhotos) {
      // Update marquee with all photos (duplicated for seamless loop)
      const photos = this.data.alecPhotos.allPhotos;
      mosaicTrack.innerHTML = [
        ...photos,
        ...photos  // duplicate for seamless loop
      ].map(photo => `<img src="${photo.src}" alt="${photo.alt}" loading="lazy">`).join('');
    }
  }

  /**
   * Show modal with all Alec photos
   */
  showAlecPhotoModal() {
    const photos = this.data?.alecPhotos?.allPhotos || [];
    const modal = document.createElement('div');
    modal.className = 'photo-modal';

    const closeModal = () => modal.remove();

    modal.innerHTML = `
      <div class="photo-modal-overlay"></div>
      <div class="photo-modal-content">
        <button class="photo-modal-close">✕</button>
        <div class="photo-modal-grid">
          ${photos.map((photo, idx) => `
            <div class="photo-modal-item" data-idx="${idx}">
              <img src="${photo.src}" alt="${photo.alt}" loading="lazy" class="photo-modal-img">
              <div class="photo-modal-caption">${photo.alt}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add close handlers
    modal.querySelector('.photo-modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.photo-modal-close').addEventListener('click', closeModal);

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Populate Movies & TV section with genre grouping
   */
  populateMoviesTV() {
    const section = document.querySelector('[data-section="moviesTV"]');
    if (!section || !this.data?.deepDive?.moviesTV) return;

    const movies = this.data.deepDive.moviesTV.movies;
    const genres = this.data.deepDive.moviesTV.genres;

    // Group movies by genre
    const moviesByGenre = {};
    genres.forEach(genre => {
      moviesByGenre[genre] = movies.filter(m => m.genre.includes(genre));
    });

    let html = `<div class="genre-filters">`;
    genres.forEach(genre => {
      html += `<button class="genre-filter-btn" data-genre="${genre}">${genre}</button>`;
    });
    html += `</div><div class="poster-grid" id="moviesTV-grid">`;

    movies.forEach(movie => {
      html += `<img src="${movie.image}" alt="${movie.title}" data-genres="${movie.genre.join(',')}" loading="lazy">`;
    });
    html += `</div>`;

    section.innerHTML = html;

    // Add genre filter event listeners
    section.querySelectorAll('.genre-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const genre = e.target.dataset.genre;
        const images = section.querySelectorAll('#moviesTV-grid img');
        images.forEach(img => {
          const genres = img.dataset.genres.split(',');
          img.style.display = genres.includes(genre) ? '' : 'none';
        });
      });
    });
  }

  /**
   * Populate Video Games section with genre grouping
   */
  populateVideoGames() {
    const section = document.querySelector('[data-section="videoGames"]');
    if (!section || !this.data?.deepDive?.videoGames) return;

    const games = this.data.deepDive.videoGames.games;
    const genres = this.data.deepDive.videoGames.genres;

    let html = `<div class="genre-filters">`;
    genres.forEach(genre => {
      html += `<button class="genre-filter-btn" data-genre="${genre}">${genre}</button>`;
    });
    html += `</div><div class="poster-grid" id="videoGames-grid">`;

    games.forEach(game => {
      html += `<img src="${game.image}" alt="${game.title}" data-genres="${game.genre.join(',')}" loading="lazy">`;
    });
    html += `</div>`;

    section.innerHTML = html;

    section.querySelectorAll('.genre-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const genre = e.target.dataset.genre;
        const images = section.querySelectorAll('#videoGames-grid img');
        images.forEach(img => {
          const genres = img.dataset.genres.split(',');
          img.style.display = genres.includes(genre) ? '' : 'none';
        });
      });
    });
  }

  /**
   * Populate Books section with Love/Have vs TBR grouping
   */
  populateBooks() {
    const section = document.querySelector('[data-section="books"]');
    if (!section || !this.data?.deepDive?.books) return;

    const books = this.data.deepDive.books;
    let html = `
      <div class="books-group">
        <h3>📚 Love / Have</h3>
        <div class="poster-grid">
          ${books.love.map(book => `<img src="${book.image}" alt="${book.title}" loading="lazy">`).join('')}
        </div>
      </div>
      <div class="books-group">
        <h3>👀 TBR / Would Like to Read</h3>
        <div class="poster-grid">
          ${books.tbr.map(book => `<img src="${book.image}" alt="${book.title}" loading="lazy">`).join('')}
        </div>
      </div>
    `;

    section.innerHTML = html;
  }

  /**
   * Populate Podcasts section with description cards
   */
  populatePodcasts() {
    const section = document.querySelector('[data-section="podcasts"]');
    if (!section || !this.data?.deepDive?.podcasts) return;

    const podcasts = this.data.deepDive.podcasts;
    let html = `<div class="podcast-cards">`;

    podcasts.favorites.forEach(podcast => {
      html += `
        <div class="podcast-card">
          <img src="${podcast.logo}" alt="${podcast.title}" class="podcast-logo">
          <div>
            <strong>${podcast.title}</strong>
            <p>${podcast.description}</p>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    section.innerHTML = html;
  }

  /**
   * Populate Music section
   */
  populateMusic() {
    const section = document.querySelector('[data-section="music"]');
    if (!section || !this.data?.deepDive?.music) return;

    const music = this.data.deepDive.music;
    let html = `<p>${music.intro}</p>`;

    // Concert photos gallery
    if (music.concertPhotos?.length > 0) {
      html += `<div class="photo-grid">`;
      music.concertPhotos.forEach(photo => {
        html += `<img src="${photo.image}" alt="${photo.description}" loading="lazy">`;
      });
      html += `</div>`;
    }

    // Concert history
    if (music.concertHistory?.length > 0) {
      html += `<h3>I've Been To</h3><div class="list-block"><ul>`;
      music.concertHistory.forEach(event => {
        html += `<li>${event.event}</li>`;
      });
      html += `</ul></div>`;
    }

    // Favorite artists
    if (music.favoriteArtists?.length > 0) {
      html += `<h3>Favorite Artists</h3><div class="artist-grid">`;
      music.favoriteArtists.forEach(artist => {
        html += `<div class="artist-card"><img src="${artist.image}" alt="${artist.name}"><a href="${artist.spotifyLink}" target="_blank">${artist.name}</a></div>`;
      });
      html += `</div>`;
    }

    // Spotify link
    html += `<p><a class="inline-link" href="${music.spotifyLink}" target="_blank">🎵 Spotify: alec_game</a></p>`;
    section.innerHTML = html;
  }

  /**
   * Populate Sports section with Teams vs Activities
   */
  populateSports() {
    const section = document.querySelector('[data-section="sports"]');
    if (!section || !this.data?.deepDive?.sports) return;

    const sports = this.data.deepDive.sports;
    let html = `
      <div class="sports-group">
        <h3>🏆 Teams I Support</h3>
        <div class="team-list">
          ${sports.teamsSupported.map(team => `
            <div class="team-item">
              <span>${team.emoji}</span> ${team.name} <span class="team-sport">${team.sport}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="sports-group">
        <h3>🏃 Activities I Enjoy</h3>
        <div class="activity-list">
          ${sports.activitiesEnjoy.map(activity => `
            <div class="activity-item">
              <span>${activity.emoji}</span> ${activity.name}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    section.innerHTML = html;
  }

  /**
   * Populate Places sections
   */
  populatePlaces() {
    // Populate Places I've Been
    const beenSection = document.querySelector('[data-section="placesVisited"]');
    if (beenSection && this.data?.deepDive?.placesVisited) {
      const visitedPlaces = this.data.deepDive.placesVisited;
      let beenHtml = `<div class="places-grid">`;
      visitedPlaces.places.forEach(place => {
        beenHtml += `
          <div class="place-card">
            <img src="${place.image}" alt="${place.name}" loading="lazy">
            <div class="place-card-body">
              <strong>${place.country} ${place.name}</strong>
              <div class="place-detail">${place.detail}</div>
            </div>
          </div>
        `;
      });
      beenHtml += `</div>`;

      if (visitedPlaces.alsoVisited?.length > 0) {
        beenHtml += `<h3>Also Stamped My Passport In</h3><div class="tag-row">`;
        visitedPlaces.alsoVisited.forEach(place => {
          beenHtml += `<span class="tag-item">${place}</span>`;
        });
        beenHtml += `</div>`;
      }

      beenSection.innerHTML = beenHtml;
    }

    // Populate Places I Want to Visit
    const toVisitSection = document.querySelector('[data-section="placesToVisit"]');
    if (!toVisitSection || !this.data?.deepDive?.placesToVisit) return;

    const places = this.data.deepDive.placesToVisit;
    let html = `<div class="places-grid">`;
    places.places.forEach(place => {
      html += `
        <div class="place-card">
          <img src="${place.image}" alt="${place.name}" loading="lazy">
          <div class="place-card-body">
            <strong>${place.country} ${place.name}</strong>
            <div class="place-detail">${place.detail}</div>
          </div>
        </div>
      `;
    });
    html += `</div>`;

    // Add daydreaming section
    if (places.daydreaming?.length > 0) {
      html += `<h3>Daydreaming Of…</h3><div class="daydream-cards">`;
      places.daydreaming.forEach(dream => {
        html += `
          <div class="daydream-card">
            <img src="${dream.image}" alt="${dream.title}" loading="lazy">
            <div class="daydream-content">
              <span class="daydream-icon">${dream.icon}</span>
              <strong>${dream.title}</strong>
              <p>${dream.description}</p>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    toVisitSection.innerHTML = html;
  }

  /**
   * Populate Gentle Dislikes with image modal linking
   */
  populateGentleDislikes() {
    const section = document.querySelector('[data-section="gentleDislikes"]');
    if (!section || !this.data?.deepDive?.gentleDislikes) return;

    const dislikes = this.data.deepDive.gentleDislikes.dislikes;

    // Create detail list
    let detailHtml = '<div class="detail-list">';
    dislikes.forEach(dislike => {
      detailHtml += `
        <div class="detail-item">
          <span class="detail-icon">${dislike.icon}</span>
          <div class="detail-text">
            <strong>${dislike.title}</strong>
            ${dislike.description}
          </div>
        </div>
      `;
    });
    detailHtml += '</div>';

    // Create clickable photo grid
    let photoHtml = '<div class="photo-grid dislikes-grid">';
    dislikes.forEach((dislike, idx) => {
      photoHtml += `
        <img src="${dislike.image}" alt="${dislike.title}"
             data-dislike-idx="${idx}" class="dislike-image"
             loading="lazy" style="cursor: pointer;">
      `;
    });
    photoHtml += '</div>';

    section.innerHTML = detailHtml + photoHtml;

    // Add click handlers for images
    section.querySelectorAll('.dislike-image').forEach(img => {
      img.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.dislikeIdx);
        const dislike = dislikes[idx];
        this.showDislikeModal(dislike);
      });
    });
  }

  /**
   * Show modal for dislike detail
   */
  showDislikeModal(dislike) {
    const modal = document.createElement('div');
    modal.className = 'dislike-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.closest('.dislike-modal').remove()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.dislike-modal').remove()">✕</button>
        <img src="${dislike.image}" alt="${dislike.title}" class="modal-image">
        <div class="modal-caption">
          <span class="modal-icon">${dislike.icon}</span>
          <h3>${dislike.title}</h3>
          <p>${dislike.description}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  /**
   * Populate Contact section with platform icons
   */
  populateContact() {
    const contactContainer = document.querySelector('[data-section="contact"]');
    if (!contactContainer || !this.data?.contact?.channels) return;

    let html = '<div class="contact-buttons">';
    this.data.contact.channels.forEach(channel => {
      const isMailto = channel.link.startsWith('mailto:');
      const target = isMailto ? '' : 'target="_blank" rel="noopener"';
      const style = channel.color ? `style="color: ${channel.color}"` : '';
      html += `<a href="${channel.link}" ${target} class="contact-btn" title="${channel.name}" ${style}><i class="${channel.icon}"></i> <span>${channel.name}</span></a>`;
    });
    html += '</div>';

    contactContainer.innerHTML = html;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ContentPopulator();
});
