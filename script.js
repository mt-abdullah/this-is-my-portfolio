document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM Elements ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('section');
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const themeToggle = document.getElementById('theme-toggle');
    const currentYearSpan = document.getElementById('current-year');
    
    // ========== Mobile Menu Functionality ==========
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger to X
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<span style="transform: translateY(8px) rotate(45deg);"></span><span style="opacity: 0;"></span><span style="transform: translateY(-8px) rotate(-45deg);"></span>'
            : '<span></span><span></span><span></span>';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
    }

    menuToggle.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ========== Smooth Scrolling ==========
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Adjust for fixed header height
                behavior: 'smooth'
            });
        }
    }

    scrollLinks.forEach(link => link.addEventListener('click', smoothScroll));

    // ========== Sticky Header ==========
    function handleHeaderScroll() {
        header.classList.toggle('header-scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ========== Active Link Highlighting ==========
    function setActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust offset for fixed header
            if (window.pageYOffset >= (sectionTop - 100)) { 
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ========== Enhanced Typewriter Effect ==========
    function initTypewriter() {
        const typingElements = document.querySelectorAll('.typing-text');
        const cursor = document.querySelector('.typewriter-cursor');
        
        if (!typingElements.length || !cursor) return;
        
        let currentIndex = 0;
        let isDeleting = false;
        let text = '';
        let typingSpeed = 150;
        const pauseBetween = 2000;
        
        function type() {
            const currentElement = typingElements[currentIndex];
            const fullText = currentElement.dataset.text || currentElement.textContent;
            
            text = isDeleting 
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1);
            
            typingSpeed = isDeleting ? 50 : 150;
            currentElement.textContent = text;
            currentElement.style.opacity = '1';
            
            // Position cursor dynamically
            const textWidth = currentElement.offsetWidth;
            cursor.style.left = `${15 + textWidth}px`; // 15px is the margin-left of .typewriter

            // Hide other elements
            typingElements.forEach((el, index) => {
                if (index !== currentIndex) {
                    el.style.opacity = '0';
                }
            });
            
            if (!isDeleting && text === fullText) {
                typingSpeed = pauseBetween;
                isDeleting = true;
                cursor.style.animation = 'none'; // Stop blinking during pause
                setTimeout(() => {
                    cursor.style.animation = 'blink 1s infinite'; // Resume blinking
                }, 10);
            } else if (isDeleting && text === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % typingElements.length;
                typingSpeed = 500; // Pause before typing next text
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Initialize first element
        typingElements[0].style.opacity = '1';
        typingElements[0].textContent = '';
        setTimeout(type, 1000);
    }

    // ========== Form Validation and Submission (EmailJS) ==========
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[name="user_name"]');
        const emailInput = contactForm.querySelector('input[name="user_email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        // Basic Validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }
        
        // EmailJS integration
        // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
        emailjs.sendForm('service_YOUR_SERVICE_ID', 'template_YOUR_TEMPLATE_ID', contactForm)
            .then(() => {
                showAlert('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            })
            .catch(err => {
                console.error('Form submission error:', err);
                showAlert('There was an error sending your message. Please try again later.', 'error');
            });
    }

    function showAlert(message, type = 'error') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            console.error('Alert container not found!');
            return;
        }

        // Remove existing alerts to prevent stacking
        while (alertContainer.firstChild) {
            alertContainer.removeChild(alertContainer.firstChild);
        }

        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        alertContainer.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            alertBox.addEventListener('transitionend', () => alertBox.remove(), { once: true });
        }, 3000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // ========== Scroll Animations (using Intersection Observer) ==========
    function animateOnScrollObserver() {
        const elements = document.querySelectorAll('.skill-card, .timeline-item, .project-card, .expertise-item, .education-item, .connection-card');
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease';
            observer.observe(element);
        });
    }

    // ========== Project Card Hover Effects ==========
    function setupProjectCards() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // ========== Dark Mode Toggle ==========
    function initTheme() {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        } else if (prefersDarkMode.matches) {
            document.body.classList.add('dark-mode');
        }
        updateThemeToggleIcon();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateThemeToggleIcon();
    }

    function updateThemeToggleIcon() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) { // Only auto-switch if no user preference is set
            document.body.classList.toggle('dark-mode', e.matches);
            updateThemeToggleIcon();
        }
    });

    // ========== Initialize Everything ==========
    function initPortfolio() {
        initTheme(); // Initialize theme first
        initTypewriter();
        animateOnScrollObserver(); // Use the observer-based animation
        setupProjectCards();
        
        // Update current year in footer
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        
        // Initialize EmailJS (replace with your actual user ID)
        emailjs.init('user_YOUR_USER_ID'); 
    }

    // Event Listeners
    window.addEventListener('load', initPortfolio);
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        setActiveLink();
        // animateOnScrollObserver is handled by IntersectionObserver
    });
});

// Custom Cursor Effect (Optional - consider disabling for touch devices)
document.addEventListener('DOMContentLoaded', () => {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    if (isTouchDevice) {
        document.documentElement.style.cursor = 'auto'; // Revert to default cursor
        return; // Exit if touch device
    }

    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursor.classList.add('cursor');
    cursorFollower.classList.add('cursor-follower');
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
  
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorFollower.style.left = `${e.clientX}px`;
      cursorFollower.style.top = `${e.clientY}px`;
    });
  
    // Click effect
    document.addEventListener('mousedown', () => {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
  
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  
    // Hide cursor on mouse out
    document.addEventListener('mouseout', () => {
      cursor.classList.add('hidden');
      cursorFollower.classList.add('hidden');
    });
  
    document.addEventListener('mouseover', () => {
      cursor.classList.remove('hidden');
      cursorFollower.classList.remove('hidden');
    });
  
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, [role="button"], input, textarea, select');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
});
