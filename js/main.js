// Load Header and Footer Dynamically
document.addEventListener('DOMContentLoaded', () => {
    
    // Function to load HTML partials
    const loadPartial = async (elementId, filePath) => {
        const element = document.getElementById(elementId);
        if (element) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const html = await response.text();
                    element.innerHTML = html;
                    
                    // Re-initialize any bootstrap components if needed after loading
                    // Mark active link in navbar
                    if (elementId === 'header-placeholder') {
                        setActiveNavLink();
                    }
                } else {
                    console.error(`Failed to load ${filePath}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
            }
        }
    };

    // Load Header and Footer
    loadPartial('header-placeholder', 'header.html');
    loadPartial('footer-placeholder', 'footer.html');

    // Function to set active nav link based on current page
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('text-primary-custom');
                link.style.fontWeight = '700';
                link.style.setProperty('--bs-nav-link-color', 'var(--primary-color)');
            }
        });
    };

    // Add scroll event listener for navbar styling on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar-custom');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }
        }
    });

    // Add AOS attributes to major elements automatically
    const aosElements = [
        '.hero-section h1', '.hero-section p', '.hero-section .btn',
        '.section-title', '.feature-card', '.card', '.step-card', 
        '.pricing-card', '.testimonial-card', 'img.img-fluid',
        'section > div.container > div.row > div', 'section:not(.hero-section)'
    ];
    
    document.querySelectorAll(aosElements.join(', ')).forEach((el, index) => {
        if (!el.hasAttribute('data-aos') && !el.classList.contains('fade-in-up')) {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (index % 4) * 100);
        }
    });

    // AOS Initialization moved to window load event

    // Initialize Swiper for Hero Section
    if (typeof Swiper !== 'undefined' && document.querySelector('.heroSwiper')) {
        const heroSwiper = new Swiper('.heroSwiper', {
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                slideChange: function () {
                    // Remove animation class from all slides immediately when slide starts changing
                    this.slides.forEach(slide => {
                        slide.querySelectorAll('[data-aos]').forEach(el => {
                            el.classList.remove('aos-animate');
                        });
                    });
                },
                slideChangeTransitionEnd: function () {
                    // Add animation class to the newly active slide when transition finishes
                    const activeSlide = this.slides[this.activeIndex];
                    const animatedElements = activeSlide.querySelectorAll('[data-aos]');
                    animatedElements.forEach(el => {
                        el.classList.add('aos-animate');
                    });
                }
            }
        });
    }

    // Initialize Swiper for Testimonials
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonialSwiper')) {
        const testimonialSwiper = new Swiper('.testimonialSwiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // when window width is >= 992px
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // Number Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // ~60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter); // Only animate once
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});

// Window Load Event for Preloader and Animations
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait for 2 seconds (2000ms) before starting the fade out
        setTimeout(() => {
            // Start fade out transition
            preloader.classList.add('preloader-hidden');
            
            // Wait for transition to finish before removing from DOM
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Initialize AOS after preloader is completely hidden
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 800,
                        once: true,
                        offset: 50
                    });
                }
            }, 600); // matches the CSS transition duration
        }, 2000); // 2 seconds delay
    } else {
        // Fallback if no preloader exists
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 50
            });
        }
    }
});
