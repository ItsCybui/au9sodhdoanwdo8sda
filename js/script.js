document.addEventListener('DOMContentLoaded', function () {
  // ========== MOBILE MENU TOGGLE ==========
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', function () {
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
    anchor.addEventListener('click', function (e) {
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
      button.addEventListener('click', function () {
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
    professionalToggle.addEventListener('change', function () {
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
    calculateBtn.addEventListener('click', function () {
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
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Reset errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
      });

      // Vérification reCAPTCHA
      let isValid = true;
      const recaptchaResponse = grecaptcha.getResponse();
      
      if (recaptchaResponse.length === 0) {
        document.getElementById('recaptcha-error').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('recaptcha-error').style.display = 'none';
      }

      // Get values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();
      const fileInput = document.getElementById('file');
      const fileError = document.getElementById('file-error');

      // Validation simple
      if (!name) {
        document.getElementById('name').parentElement.classList.add('error');
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        document.getElementById('email').parentElement.classList.add('error');
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
      }

      if (!subject) {
        document.getElementById('subject').parentElement.classList.add('error');
        document.getElementById('subject-error').style.display = 'block';
        isValid = false;
      }

      if (!message) {
        document.getElementById('message').parentElement.classList.add('error');
        document.getElementById('message-error').style.display = 'block';
        isValid = false;
      }

      // Validation fichier
      if (fileInput.files.length > 0) {
        const error = validateFile(fileInput.files[0]);
        if (error) {
          fileInput.parentElement.classList.add('error');
          fileError.textContent = error;
          fileError.style.display = 'block';
          isValid = false;
        }
      }

      if (!isValid) {
        document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Envoi du formulaire
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

      try {
        const formData = new FormData(this);
        formData.append('g-recaptcha-response', recaptchaResponse);

        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // Remove previous messages
        document.querySelectorAll('.form-message').forEach(el => el.remove());

        const messageDiv = document.createElement('div');
        messageDiv.style.textAlign = 'center';
        messageDiv.style.margin = '1rem 0';
        messageDiv.style.fontWeight = '600';
        messageDiv.classList.add('form-message');

        if (response.ok) {
          messageDiv.textContent = 'Message envoyé avec succès !';
          messageDiv.style.color = 'var(--success)';
          this.reset();
          grecaptcha.reset(); // Réinitialise le CAPTCHA après envoi réussi
        } else {
          const error = await response.json();
          throw new Error(error.error || "Erreur lors de l'envoi");
        }

        this.insertBefore(messageDiv, this.querySelector('.form-submit'));
      } catch (error) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Erreur: ${error.message}`;
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.margin = '1rem 0';
        errorDiv.style.fontWeight = '600';
        errorDiv.classList.add('form-message');
        this.insertBefore(errorDiv, this.querySelector('.form-submit'));

        console.error('Erreur:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });

    // Fonction pour valider les fichiers
    function validateFile(file) {
      if (!file) return null;

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        return "Seuls les JPG, PNG, GIF et PDF sont acceptés";
      }

      if (file.size > maxSize) {
        return "Le fichier est trop lourd (max 10MB)";
      }

      return null;
    }

    // Clear errors when typing
    document.getElementById('name').addEventListener('input', clearError);
    document.getElementById('email').addEventListener('input', clearError);
    document.getElementById('subject').addEventListener('change', clearError);
    document.getElementById('message').addEventListener('input', clearError);
    document.getElementById('file').addEventListener('change', clearError);

    function clearError(e) {
      const input = e.target;
      input.parentElement.classList.remove('error');
      const errorElement = document.getElementById(`${input.id}-error`);
      if (errorElement) errorElement.style.display = 'none';
    }
  }

  // ========== ANIMATIONS ON SCROLL ==========
  const animateOnScroll = function () {
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