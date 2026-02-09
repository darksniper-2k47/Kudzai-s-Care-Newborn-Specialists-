/* ==========================================================================
   KUDZAI'S NEWBORN CARE AGENCY — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initStickyHeader();
  initFaqAccordion();
  initFormHandling();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const nav = document.querySelector('.header__nav');
  const body = document.body;

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', function () {
    nav.classList.toggle('header__nav--open');
    menuToggle.classList.toggle('header__menu-toggle--active');
    body.classList.toggle('nav-open');

    // Toggle aria-expanded
    const isOpen = nav.classList.contains('header__nav--open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when clicking a link
  nav.querySelectorAll('.header__nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('header__nav--open');
      menuToggle.classList.remove('header__menu-toggle--active');
      body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   Sticky Header Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq__question');

    if (!question) return;

    question.addEventListener('click', function () {
      // Close other items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('faq__item--open');
        }
      });

      // Toggle current item
      item.classList.toggle('faq__item--open');
    });
  });
}

/* --------------------------------------------------------------------------
   Form Handling
   -------------------------------------------------------------------------- */
function initFormHandling() {
  const forms = document.querySelectorAll('.form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('form__input--error');
        } else {
          field.classList.remove('form__input--error');
        }
      });

      if (!isValid) return;

      // Get form data
      const formData = new FormData(form);

      // Submit to Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Show success state
            const formContainer = form.closest('.form-container');
            const successMessage = formContainer?.querySelector('.form-success');

            if (successMessage) {
              form.style.display = 'none';
              successMessage.style.display = 'block';
            } else {
              // Fallback: show inline success
              showFormSuccess(form);
            }
          } else {
            alert('Something went wrong. Please try again or call us directly.');
          }
        })
        .catch(error => {
          console.error('Form submission error:', error);
          alert('Something went wrong. Please try again or call us directly.');
        });
    });
  });
}

function showFormSuccess(form) {
  const successHTML = `
    <div class="form-success">
      <div class="form-success__icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3>Your Sleep Starts Tonight!</h3>
      <p class="mb-4">We'll call you within 30 minutes to confirm your specialist.</p>
      <a href="tel:+27695556941" class="btn btn--primary">
        Can't Wait? Call Now
      </a>
    </div>
  `;

  form.innerHTML = successHTML;
}

/* --------------------------------------------------------------------------
   Smooth Scroll for Anchor Links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Utility Functions
   -------------------------------------------------------------------------- */

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = function () {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
