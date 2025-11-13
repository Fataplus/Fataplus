// Fataplus Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    function createMobileMenu() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');

        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--dark-color);
        `;

        nav.insertBefore(mobileMenuBtn, navLinks);

        // Mobile menu toggle functionality
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Initialize mobile menu
    createMobileMenu();

    // Scroll animations
    function handleScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all fade-in-up elements
        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Initialize scroll animations
    handleScrollAnimations();

    // Header background on scroll
    function handleHeaderScroll() {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;

        if (scrolled > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        const speed = 200;

        const countUp = (counter, target) => {
            let count = 0;
            const increment = target / speed;

            const updateCounter = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        };

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const counter = entry.target;
                    const text = counter.textContent;

                    // Extract number from text (handles formats like "50+", "10,000+")
                    const match = text.match(/[\d,]+/);
                    if (match) {
                        const target = parseInt(match[0].replace(/,/g, ''));
                        countUp(counter, target);
                        counter.classList.add('animated');
                    }
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Initialize counter animations
    animateCounters();

    // Add hover effects to cards
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.service-card, .project-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addCardHoverEffects();

    // Form validation (for contact form)
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Basic validation
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.style.borderColor = 'var(--accent-color)';
                        isValid = false;
                    } else {
                        input.style.borderColor = '#ddd';
                    }
                });

                if (isValid) {
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                    successMsg.style.cssText = `
                        background: var(--primary-color);
                        color: white;
                        padding: 1rem;
                        border-radius: 8px;
                        margin-top: 1rem;
                        text-align: center;
                    `;

                    form.appendChild(successMsg);
                    form.reset();

                    setTimeout(() => {
                        successMsg.remove();
                    }, 5000);
                }
            });
        });
    }

    setupFormValidation();

    // Loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // Set initial opacity for loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    // Responsive adjustments
    function handleResponsive() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const ctaButton = document.querySelector('.cta-button');

        if (window.innerWidth <= 768) {
            if (mobileMenuBtn) {
                mobileMenuBtn.style.display = 'block';
            }
            if (navLinks) {
                navLinks.style.cssText = `
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                `;
            }
            if (ctaButton) {
                ctaButton.style.display = 'none';
            }
        } else {
            if (mobileMenuBtn) {
                mobileMenuBtn.style.display = 'none';
            }
            if (navLinks) {
                navLinks.style.cssText = `
                    display: flex;
                    position: static;
                    background: none;
                    flex-direction: row;
                    padding: 0;
                    box-shadow: none;
                `;
            }
            if (ctaButton) {
                ctaButton.style.display = 'block';
            }
        }
    }

    // Initial responsive setup
    handleResponsive();
    window.addEventListener('resize', handleResponsive);

    // Add CSS for mobile menu active state
    const style = document.createElement('style');
    style.textContent = `
        .nav-links.active {
            display: flex !important;
        }

        .mobile-menu-btn:hover {
            color: var(--primary-color);
        }

        @media (max-width: 768px) {
            .nav-links.active {
                display: flex !important;
                animation: slideDown 0.3s ease;
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('Fataplus website initialized successfully! 🌱');
});