// Add your custom JavaScript here
// Smooth scrolling for navigation

document.addEventListener('DOMContentLoaded', function() {
  // Typing effect for hero section
  const typingElement = document.getElementById('typing');
  if (typingElement) {
    const text = "Turning bold ideas into digital reality.";
    let i = 0;
    function type() {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, 45);
      }
    }
    type();
  }

  const links = document.querySelectorAll('a[href^="#"]');
  for (const link of links) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip empty anchor links
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Scroll to Top Button Logic
  const scrollToTopBtn = document.querySelector('.scroll-to-top-btn');

  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });

    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Animation Logic
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Theme Toggle Logic
  const themeToggle = document.getElementById('checkbox');
  const currentTheme = localStorage.getItem('theme');

  // Apply saved theme on load, or check system preference
  if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'dark-mode') {
      themeToggle.checked = true;
    }
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
    localStorage.setItem('theme', 'dark-mode');
  }

  themeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light-mode');
    }
  });

  // Hamburger Menu Logic
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      // For accessibility
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Contact Form Submission Logic
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitButton = contactForm.querySelector('button');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://your-project-url.vercel.app/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        formStatus.textContent = result.message;
        formStatus.className = response.ok ? 'form-success' : 'form-error';
        formStatus.style.display = 'block';

        if (response.ok) {
          contactForm.reset();
        }
      } catch (error) {
        formStatus.textContent = 'A network error occurred. Please try again.';
        formStatus.className = 'form-error';
        formStatus.style.display = 'block';
      } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
