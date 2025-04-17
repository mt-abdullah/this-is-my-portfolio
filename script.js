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
                top: target.offsetTop - 70,
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
            currentElement.dataset.text = fullText;
            
            text = isDeleting 
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1);
            
            typingSpeed = isDeleting ? 50 : 150;
            currentElement.textContent = text;
            currentElement.style.opacity = '1';
            
            // Hide other elements
            typingElements.forEach((el, index) => {
                el.style.opacity = index === currentIndex ? '1' : '0';
            });
            
            if (!isDeleting && text === fullText) {
                typingSpeed = pauseBetween;
                isDeleting = true;
                cursor.style.animation = 'none';
                setTimeout(() => {
                    cursor.style.animation = 'blink 1s infinite';
                }, 10);
            } else if (isDeleting && text === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % typingElements.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Initialize first element
        typingElements[0].style.opacity = '1';
        typingElements[0].textContent = '';
        setTimeout(type, 1000);
    }

    // ========== Form Validation and Submission ==========
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]');
        const email = contactForm.querySelector('input[type="email"]');
        const message = contactForm.querySelector('textarea');
        
        // Validation
        if (!name.value || !email.value || !message.value) {
            showAlert('Please fill in all required fields');
            return;
        }
        
        if (!/^\S+@\S+\.\S+$/.test(email.value)) {
            showAlert('Please enter a valid email address');
            return;
        }
        
        // Form submission with EmailJS
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
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
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // ========== Scroll Animations ==========
    function animateOnScroll() {
        const elements = document.querySelectorAll('.skill-category, .timeline-item, .project-card');
        const screenPosition = window.innerHeight / 1.2;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize animation states
    function initAnimations() {
        document.querySelectorAll('.skill-category, .timeline-item, .project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease';
        });
        animateOnScroll();
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

    // ========== Initialize Everything ==========
    function initPortfolio() {
        initTypewriter();
        initAnimations();
        setupProjectCards();
        
        // Update current year in footer
        const yearElement = document.querySelector('footer p:last-child');
        if (yearElement) {
            yearElement.textContent = `© ${new Date().getFullYear()} Abdullah. All rights reserved.`;
        }
        
        // Initialize EmailJS
        emailjs.init('YOUR_USER_ID');
    }

    // Event Listeners
    window.addEventListener('load', initPortfolio);
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        setActiveLink();
        animateOnScroll();
    });
});

// Custom Cursor Effect
document.addEventListener('DOMContentLoaded', () => {
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