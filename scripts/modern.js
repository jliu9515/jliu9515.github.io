/* ============================================
   JACK LIU - MODERN PORTFOLIO JS
   Professional AI Researcher & ML Engineer
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTypingEffect();
  initScrollAnimations();
  initPortfolio();
  initModal();
  updateCopyrightYear();
});

/* ============================================
   UTILITY
   ============================================ */
function updateCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  const phrases = [
    'AI Researcher @ UPenn',
    'ML Engineer | LLM Systems',
    'Building Production GenAI',
    'LLM + BCI Research',
    'vLLM | TensorRT-LLM | RAG'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing new phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements (Added .cert-card here)
  const animateElements = document.querySelectorAll(
    '.about-track, .skill-category, .timeline-item, .project-card, .contact-item, .cert-card, .blog-card'
  );
  
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   PORTFOLIO
   ============================================ */
let projectsData = [];

async function initPortfolio() {
  try {
    const response = await fetch('projects.json');
    const data = await response.json();
    projectsData = data.projects;
    renderProjects();
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  
  projectsData.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.index = index;
    
    card.innerHTML = `
      <img src="${project.bgPic}" alt="${project.title}" class="project-image">
      <div class="project-overlay">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-caption">${project.caption}</p>
        <span class="project-btn">
          View Details <i class="fas fa-arrow-right"></i>
        </span>
      </div>
    `;
    
    card.addEventListener('click', () => openModal(index));
    grid.appendChild(card);
  });
}

/* ============================================
   MODAL
   ============================================ */
let currentSlideIndex = 0;
let currentProjectSlides = [];

function initModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const overlay = modal.querySelector('.modal-overlay');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  prevBtn.addEventListener('click', () => navigateSlide(-1));
  nextBtn.addEventListener('click', () => navigateSlide(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateSlide(-1);
    if (e.key === 'ArrowRight') navigateSlide(1);
  });
}

function openModal(projectIndex) {
  const modal = document.getElementById('projectModal');
  const project = projectsData[projectIndex];
  
  currentProjectSlides = project.detail.slides;
  currentSlideIndex = 0;

  document.getElementById('modalTitle').textContent = project.detail.title;
  document.getElementById('modalDate').textContent = project.detail.date;
  document.getElementById('modalDescription').innerHTML = project.detail.description;
  document.getElementById('modalLink').href = project.detail.link;

  updateSlide();
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateSlide() {
  const slider = document.getElementById('modalSlider');
  slider.innerHTML = `<img src="${currentProjectSlides[currentSlideIndex]}" alt="Project slide">`;
}

function navigateSlide(direction) {
  currentSlideIndex += direction;
  
  if (currentSlideIndex < 0) {
    currentSlideIndex = currentProjectSlides.length - 1;
  } else if (currentSlideIndex >= currentProjectSlides.length) {
    currentSlideIndex = 0;
  }
  
  updateSlide();
}
