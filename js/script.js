document.addEventListener('DOMContentLoaded', function() {
  // ========== MOBILE MENU TOGGLE ==========
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        navList.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });
  });

  // ========== SMOOTH SCROLLING ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== GALLERY FILTER ==========
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Active le bouton
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filtre les éléments
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ========== FAQ TOGGLE ==========
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== question) {
          q.classList.remove('active');
          q.nextElementSibling.style.maxHeight = null;
          const icon = q.querySelector('i');
          if (icon) {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
          }
        }
      });
      
      // Toggle current FAQ
      question.classList.toggle('active');
      const icon = question.querySelector('i');
      
      if (isOpen) {
        answer.style.maxHeight = null;
        if (icon) {
          icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) {
          icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
      }
    });
  });

  // ========== PRICING TOGGLE ==========
  const professionalToggle = document.getElementById('professionalToggle');
  if (professionalToggle) {
    professionalToggle.addEventListener('change', function() {
      const particuliers = document.getElementById('particuliers');
      const professionnels = document.getElementById('professionnels');
      
      if (this.checked) {
        particuliers.style.display = 'none';
        professionnels.style.display = 'block';
      } else {
        particuliers.style.display = 'block';
        professionnels.style.display = 'none';
      }
    });
  }

  // ========== PRICE CALCULATOR ==========
  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      const serviceCost = parseFloat(document.getElementById('serviceSelect').value) || 0;
      const componentsCost = parseFloat(document.getElementById('componentCost').value) || 0;
      const total = serviceCost + componentsCost;
      
      document.getElementById('totalAmount').textContent = total + '€';
      document.getElementById('calculatorResult').style.display = 'block';
    });
  }

  // ========== CONTACT FORM VALIDATION ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      
      // Simple validation
      if (!name || !email || !subject || !message) {
        alert('Veuillez remplir tous les champs obligatoires (*)');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
      }
      
      // If validation passes
      alert('Merci pour votre message ! Nous vous contacterons rapidement.');
      this.reset();
    });
  }

  // ========== TESTIMONIALS SLIDER ==========
  const testimonialsSlider = document.querySelector('.testimonials-slider');
  if (testimonialsSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsSlider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - testimonialsSlider.offsetLeft;
      scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
      isDown = false;
    });

    testimonialsSlider.addEventListener('mouseup', () => {
      isDown = false;
    });

    testimonialsSlider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsSlider.offsetLeft;
      const walk = (x - startX) * 2;
      testimonialsSlider.scrollLeft = scrollLeft - walk;
    });
  }

  // ========== ANIMATIONS ON SCROLL ==========
  const animateOnScroll = function() {
    const elements = document.querySelectorAll(
      '.service-card, .testimonial-card, .gallery-item, .pricing-table, .faq-item, .service-detail'
    );
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initialize animated elements
  const animatedElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .gallery-item, .pricing-table, .faq-item, .service-detail'
  );
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
});

// ========== SERVICE IMAGE HOVER EFFECT ==========
document.querySelectorAll('.service-image').forEach(image => {
  image.addEventListener('mouseenter', () => {
    const img = image.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1.05)';
    }
  });
  
  image.addEventListener('mouseleave', () => {
    const img = image.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  });
});