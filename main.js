/* ==========================================================================
   INTERACTION ENGINE FOR STACKLY AGRI-CLOUD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  initMobileMenu();

  // 2. Header Scroll Effect
  initHeaderScroll();

  // 3. Background Particle Network (Canvas)
  initCanvasParticles();

  // 4. Scroll Reveal Animations (Intersection Observer)
  initScrollReveal();

  // 5. General Interactive Elements (FAQ, Testimonials, Tabs, Pricing)
  initFaqAccordion();
  initTestimonialsSlider();
  initTechTabs();
  initPricingToggle();
  initGlobalMapPins();

  // 6. Global 404 Navigation Handler
  initUniversal404Router();
});

/* --- Mobile Navigation Drawer --- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();

      toggle.classList.toggle('active');
      menu.classList.toggle('active');

      // Lock background scroll
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {

        toggle.classList.remove('active');
        menu.classList.remove('active');

        // Unlock scroll
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu when clicking links
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {

        toggle.classList.remove('active');
        menu.classList.remove('active');

        // Unlock scroll
        document.body.classList.remove('menu-open');
      });
    });

  }
}

/* --- Smooth Shrinking Nav on Scroll --- */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* --- Animated Interactive Canvas Background --- */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 30000));
  const maxDistance = 120;

  // Particle Class representing a network telemetry packet
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      // Alternate green/blue color scheme
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 128, 0.4)' : 'rgba(0, 180, 255, 0.4)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw network connection lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.15;
          ctx.strokeStyle = `rgba(0, 240, 128, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Resize canvas responsively
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* --- Scroll Entrance Animation Revealer --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Trigger animations inside the element if it's the data center rack
          const dcBars = entry.target.querySelectorAll('.dc-bar-fill');
          if (dcBars.length > 0) {
            dcBars.forEach(bar => {
              const targetWidth = bar.getAttribute('data-width') || '70%';
              bar.style.width = targetWidth;
            });
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* --- Modern FAQ Collapsible Accordion --- */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --- Testimonials Carousel Slider --- */
function initTestimonialsSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dot');
  
  if (cards.length === 0 || dots.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = startAutoplay();

  function showSlide(index) {
    if(cards.length){
    cards.forEach(card => card.classList.remove('active'));
}

if(dots.length){
    dots.forEach(dot => dot.classList.remove('active'));
}

    if(cards[index]){
    cards[index].classList.add('active');
}

if(dots[index]){
    dots[index].classList.add('active');
}
    currentIndex = index;
  }

  function startAutoplay() {
    return setInterval(() => {
      let nextIndex = (currentIndex + 1) % cards.length;
      showSlide(nextIndex);
    }, 6000);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(autoplayTimer);
      showSlide(idx);
      autoplayTimer = startAutoplay();
    });
  });
}

/* --- Technology Showcase Tab Controller --- */
function initTechTabs() {
  const tabs = document.querySelectorAll('.tech-tab');
  const contents = document.querySelectorAll('.tech-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* --- Services & Pricing Toggle Switch --- */
function initPricingToggle() {
  const toggle = document.querySelector('.toggle-switch');
  const monthlyLabel = document.getElementById('toggle-monthly');
  const annualLabel = document.getElementById('toggle-annual');
  const priceValues = document.querySelectorAll('.price-val');
  const pricePeriods = document.querySelectorAll('.price-period');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isAnnual = toggle.classList.toggle('active');
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);

    priceValues.forEach(price => {
      const monthlyPrice = price.getAttribute('data-monthly');
      const annualPrice = price.getAttribute('data-annual');
      price.innerText = isAnnual ? annualPrice : monthlyPrice;
    });

    pricePeriods.forEach(period => {
      period.innerText = isAnnual ? '/yr' : '/mo';
    });
  });
}

/* --- Global Map Interactivity --- */
function initGlobalMapPins() {
  const pins = document.querySelectorAll('.map-pin');
  const tooltip = document.getElementById('map-tooltip');

  if (!tooltip) return;

  pins.forEach(pin => {
    pin.addEventListener('mouseenter', (e) => {
      const label = pin.getAttribute('data-label');
      const status = pin.getAttribute('data-status') || 'Operational';
      
      tooltip.innerHTML = `<strong>${label}</strong><br><span style="color:#00f080">●</span> ${status}`;
      tooltip.style.display = 'block';
    });

    pin.addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.closest('.map-container').getBoundingClientRect();
      const x = e.clientX - rect.left + 15;
      const y = e.clientY - rect.top + 15;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    pin.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/* --- Universal Click-to-404 Handler --- */
function initUniversal404Router() {
  // Check the current file name
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  // --- Rule 1: In index.html, if any button or CTA link is clicked, go to 404.html ---
  // (EXCLUDING navigation tabs in header/footer, and login/register links)
  if (pageName === 'index.html' || pageName === '') {
    document.querySelectorAll('a, button').forEach(el => {
      const href = el.getAttribute('href');
      
      // Check if it's a structural page navigation link in the header/footer
      const isNavigablePage = href && (
        href.includes('index.html') ||
        href.includes('about.html') ||
        href.includes('services.html') ||
        href.includes('blog.html') ||
        href.includes('contact.html') ||
        href.includes('login.html') ||
        href.includes('register.html')
      );

      // Check if it's a tab controls or slider interaction (doesn't change pages)
      const isTabOrDot = el.classList.contains('tech-tab') || 
                         el.classList.contains('slider-dot') || 
                         el.classList.contains('faq-header') ||
                         el.closest('.faq-header') ||
                         el.closest('.menu-toggle');

      // If it's a standard button or custom CTA inside the page, override its click
      if (!isNavigablePage && !isTabOrDot) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          if (pageName.includes('dashboard-user.html') || pageName.includes('dashboard-admin.html')) {
   return;
}
        });
      }
    });
  }

  // --- Rule 2: In user dashboard and admin dashboard, clicking any button redirects to 404.html (except logout) ---
  if (pageName.includes('dashboard-user.html') || pageName.includes('dashboard-admin.html')) {
    document.querySelectorAll('a, button').forEach(el => {
      const isLogout = el.classList.contains('dash-logout-btn') || 
                       el.id === 'logout-btn' || 
                       el.innerText.toLowerCase().includes('logout');

      // Don't intercept the Logout button, but intercept all other interactions
      if (!isLogout) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (pageName.includes('dashboard-user.html') || pageName.includes('dashboard-admin.html')) {
   return;
}
        });
      }
    });
  }
}
window.onload = function () {
    setTimeout(function () {
        const loader = document.getElementById("loader");

        if(loader){
            loader.style.display = "none";
        }
    }, 1500);
};

const nameField = document.getElementById("contact-name");
const mobileField = document.getElementById("contact-mobile");

if(nameField){
    nameField.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z ]/g, "");
    });
}

if(mobileField){
    mobileField.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
    });
}


function toggleMenu(){
    document.getElementById("sideMenu").classList.toggle("active");
}
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("active");

    if(sidebar.classList.contains("active")){
        document.body.classList.add("menu-open");
    }else{
        document.body.classList.remove("menu-open");
    }

});






