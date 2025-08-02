/*
 * main.js
 *
 * This script powers the interactive features of the portfolio:
 *  - dynamic starfield generation
 *  - typewriter text effect in the hero section
 *  - scroll reveal animations using IntersectionObserver
 *  - modal popups for project details
 *  - light/dark mode toggle with localStorage persistence
 *  - basic contact form handling
 *  - optional Easter egg using the Konami Code
 */

document.addEventListener('DOMContentLoaded', () => {
  // Starfield
  createStarField();

  // Typewriter Effect
  typeWriter();

  // Scroll Reveal
  initScrollReveal();

  // Modal Handling
  initModals();

  // Theme Toggle
  initThemeToggle();

  // Project Tabs filter
  initProjectTabs();

  // Skill bars animation
  initSkillBars();

  // Contact Form Handler (with real submission)
  initContactForm();

  // Footer Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Easter Egg: Konami Code
  initKonamiCode();

  // Hamburger menu toggle for mobile nav
  const hamburger = document.getElementById('hamburger-menu');
  const navbar = document.getElementById('navbar');
  if (hamburger && navbar) {
    const navList = navbar.querySelector('ul');
    hamburger.addEventListener('click', function () {
      navList.classList.toggle('open');
      // Update aria-expanded for accessibility
      hamburger.setAttribute('aria-expanded', navList.classList.contains('open'));
    });
    // Optional: Close nav when a link is clicked (mobile UX)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
          navList.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
});

/**
 * Create a star field by appending small divs to the #starfield element.
 * Each star has a random position, size, and animation speed.
 */
function createStarField() {
  const starContainer = document.getElementById('starfield');
  // Remove any existing stars to avoid duplicates when resizing
  starContainer.innerHTML = '';
  // Increase star count for a denser field across the entire page
  const numStars = 500;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    // Random position within the viewport
    const x = Math.random() * viewportWidth;
    const y = Math.random() * viewportHeight;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    // Random size (1–3px) and animation speed (5–15s)
    const size = Math.random() * 4 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    star.style.animation = `twinkle ${duration}s infinite ease-in-out ${delay}s`;
    // Add custom properties for movement
    star.dataset.x = x;
    star.dataset.y = y;
    star.dataset.dx = (Math.random() - 0.5) * 0.15; // -0.075 to 0.075 px/frame
    star.dataset.dy = (Math.random() - 0.5) * 0.15;
    starContainer.appendChild(star);
  }
  // Animate stars drifting
  function animateStars() {
    const stars = starContainer.querySelectorAll('.star');
    stars.forEach(star => {
      let x = parseFloat(star.dataset.x);
      let y = parseFloat(star.dataset.y);
      let dx = parseFloat(star.dataset.dx);
      let dy = parseFloat(star.dataset.dy);
      x += dx;
      y += dy;
      // Wrap around edges
      if (x < 0) x = viewportWidth;
      if (x > viewportWidth) x = 0;
      if (y < 0) y = viewportHeight;
      if (y > viewportHeight) y = 0;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.dataset.x = x;
      star.dataset.y = y;
    });
    requestAnimationFrame(animateStars);
  }
  animateStars();
  // Regenerate stars on window resize to adapt to new viewport dimensions
  window.addEventListener('resize', () => {
    createStarField();
  }, { once: true });
}

/**
 * Implements a simple typewriter effect on the hero subtitle.
 */
function typeWriter() {
  const text = "I\’m Adnan, a passionate Software Developer with an eye for elegant solutions. Whether architecting scalable APIs or crafting seamless user experiences, I thrive on turning complex problems into clean, maintainable code.";
  const typedText = document.getElementById('typed-text');
  let index = 0;
  function type() {
    if (index <= text.length) {
      typedText.textContent = text.substring(0, index);
      index++;
      // Vary typing speed for a more organic feel
      const delay = Math.random() * 100 + 50; // 50ms to 150ms
      setTimeout(type, delay);
    } else {
      setTimeout(() => {
        index = 0;
        type();
      }, 2000);
    }
  }
  type();
  // Add terminal actions at the bottom if not already present
  const terminalBody = document.getElementById('hero-terminal-body');
  if (terminalBody && !terminalBody.querySelector('.terminal-actions')) {
    const actions = document.createElement('div');
    actions.className = 'terminal-actions';
    actions.innerHTML = `
      <a href="#projects" class="btn primary">View Projects</a>
      <a href="resume.pdf" class="btn secondary" download>Download Resume</a>
    `;
    terminalBody.appendChild(actions);
  }
}

/**
 * Reveal elements on scroll using IntersectionObserver.
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const options = {
    threshold: 0.15,
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/**
 * Set up modal open/close interactions.
 */
function initModals() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      openModal(modalId);
    });
  });
  // Close buttons
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', event => {
      const modal = event.target.closest('.modal');
      closeModal(modal);
    });
  });
  // Close when clicking outside dialog
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * Handles theme switching between dark and light modes.
 */
function initThemeToggle() {
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  // Check localStorage for user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    setIcon('light');
  } else {
    body.classList.remove('light-mode');
    setIcon('dark');
  }
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    setIcon(isLight ? 'light' : 'dark');
  });

  function setIcon(mode) {
    // Replace icon path to reflect current theme (sun for dark, moon for light)
    if (mode === 'light') {
      // Show moon icon
      icon.innerHTML =
        '<path d="M21.64 13.34a1 1 0 00-1.09-.27 9 9 0 01-12.62-9.33 1 1 0 00-1.45-.94 10 10 0 1015.16 11.4 1 1 0 00-.01-1.15z" fill="currentColor"/>';
    } else {
      // Show sun icon
      icon.innerHTML =
        '<circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g>';
    }
  }
}

/**
 * Basic form submission handler. Displays a thank you message and resets the form.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    // Provide immediate feedback while sending
    if (statusEl) {
      statusEl.textContent = 'Sending…';
      statusEl.className = '';
    }
    try {
      /*
       * Use the Fetch API to submit the form. When sending to FormSubmit
       * from a JavaScript application you must disable CORS mode because
       * the service does not set the appropriate CORS headers. Without
       * `mode: "no-cors"` the request will be blocked by the browser and
       * will never reach the FormSubmit servers.  With `no-cors` the
       * response always has an opaque status, so `response.ok` will always
       * be false. Instead of inspecting `response.ok` we assume success
       * as long as no exception is thrown.
       */
      await fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form),
      });
      // We cannot read the response due to no-cors, but if the request
      // succeeded the FormSubmit service will handle sending the email.
      if (statusEl) {
        statusEl.textContent = 'Thank you! Your message has been sent.';
        statusEl.classList.add('success');
      }
      form.reset();
    } catch (error) {
      // If an exception occurred the network call failed
      if (statusEl) {
        statusEl.textContent = 'Oops! There was a problem sending your message.';
        statusEl.classList.add('error');
      }
    }
  });
}

/**
 * Initialise filtering for the Projects section. Clicking a tab will
 * show only the project cards matching the category. The 'all'
 * category reveals all cards.
 */
function initProjectTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.project-card');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state on tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          // Display as flex to preserve card layout; hidden cards are not displayed
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Animate the skill bars when they enter the viewport. Each skill bar
 * has a `data-level` attribute representing its percentage. The inner
 * bar's width is set once the bar is visible.
 */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.getAttribute('data-level');
        const inner = bar.querySelector('.progress-inner');
        if (inner) {
          inner.style.width = level + '%';
        }
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(bar => observer.observe(bar));
}

/**
 * Easter egg triggered by the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A).
 * When detected, a celebratory message pops up.
 */
function initKonamiCode() {
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let keyIndex = 0;
  window.addEventListener('keydown', event => {
    const key = event.key;
    if (key === secretCode[keyIndex]) {
      keyIndex++;
      if (keyIndex === secretCode.length) {
        keyIndex = 0;
        // Trigger Easter egg
        showEasterEgg();
      }
    } else {
      keyIndex = 0;
    }
  });
}

/**
 * Displays a fun confetti animation when the Easter egg is triggered.
 */
function showEasterEgg() {
  const colors = ['#00ffc3', '#ff4081', '#3f51b5', '#ffea00', '#00bcd4'];
  const confettiContainer = document.createElement('div');
  confettiContainer.classList.add('confetti-container');
  document.body.appendChild(confettiContainer);
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('span');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
    confettiContainer.appendChild(confetti);
  }
  // Remove confetti after animation
  setTimeout(() => {
    confettiContainer.remove();
  }, 6000);
}

// Matrix Rain Effect
function createMatrixRain() {
  const canvas = document.getElementById('matrix-rain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const fontSize = 18;
  const columns = Math.floor(width / fontSize);
  const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(16,19,26,0.18)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + "px 'Fira Code', monospace";
    ctx.fillStyle = '#00ff99';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
}

document.addEventListener('DOMContentLoaded', createMatrixRain);