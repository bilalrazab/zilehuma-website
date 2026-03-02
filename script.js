// ===========================
// Theme Toggle
// ===========================

const initTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    
    const getTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return prefersDark.matches ? 'dark' : 'light';
    };
    
    setTheme(getTheme());
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
};

// ===========================
// Scroll Progress Bar
// ===========================

const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress');
    
    const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    };
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
};

// ===========================
// Navigation
// ===========================

const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavLink = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();
};

// ===========================
// Petals Animation (Canvas)
// ===========================

const initPetalsAnimation = () => {
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const petals = [];
    const petalCount = 15;
    
    class Petal {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.speed = 1 + Math.random() * 2;
            this.amplitude = 30 + Math.random() * 50;
            this.frequency = 0.01 + Math.random() * 0.03;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.size = 4 + Math.random() * 6;
            this.opacity = 0.3 + Math.random() * 0.4;
        }
        
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y * this.frequency) * 0.5;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.8, 0, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(168, 136, 181, 0.6)');
            gradient.addColorStop(0.5, 'rgba(122, 169, 154, 0.4)');
            gradient.addColorStop(1, 'rgba(159, 184, 173, 0.2)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }
    
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

// ===========================
// Scroll Reveal Animation
// ===========================

const initScrollReveal = () => {
    const reveals = document.querySelectorAll('[data-scroll-reveal]');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
};

// ===========================
// Booking Form
// ===========================

const initBookingForm = () => {
    const form = document.getElementById('booking-form');
    const timeSlots = document.querySelectorAll('.time-slot');
    const timeInput = document.getElementById('time');
    const dateInput = document.getElementById('date');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            e.preventDefault();
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            timeInput.value = slot.dataset.time;
            
            // Clear error if exists
            const formGroup = timeInput.closest('.form-group');
            formGroup.classList.remove('error');
        });
    });
    
    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Phone validation
    const validatePhone = (phone) => {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };
    
    // Form validation
    const validateForm = () => {
        let isValid = true;
        
        // Clear all errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Full Name
        const fullname = document.getElementById('fullname');
        if (fullname.value.trim().length < 3) {
            fullname.closest('.form-group').classList.add('error');
            fullname.closest('.form-group').querySelector('.error-message').textContent = 'Please enter your full name';
            isValid = false;
        }
        
        // Email
        const email = document.getElementById('email');
        if (!validateEmail(email.value.trim())) {
            email.closest('.form-group').classList.add('error');
            email.closest('.form-group').querySelector('.error-message').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Phone
        const phone = document.getElementById('phone');
        if (!validatePhone(phone.value.trim())) {
            phone.closest('.form-group').classList.add('error');
            phone.closest('.form-group').querySelector('.error-message').textContent = 'Please enter a valid phone number';
            isValid = false;
        }
        
        // Session Type
        const sessionType = document.getElementById('session-type');
        if (!sessionType.value) {
            sessionType.closest('.form-group').classList.add('error');
            sessionType.closest('.form-group').querySelector('.error-message').textContent = 'Please select a session type';
            isValid = false;
        }
        
        // Mode
        const mode = document.getElementById('mode');
        if (!mode.value) {
            mode.closest('.form-group').classList.add('error');
            mode.closest('.form-group').querySelector('.error-message').textContent = 'Please select a session mode';
            isValid = false;
        }
        
        // Date
        const date = document.getElementById('date');
        if (!date.value) {
            date.closest('.form-group').classList.add('error');
            date.closest('.form-group').querySelector('.error-message').textContent = 'Please select a date';
            isValid = false;
        }
        
        // Time
        if (!timeInput.value) {
            timeInput.closest('.form-group').classList.add('error');
            timeInput.closest('.form-group').querySelector('.error-message').textContent = 'Please select a time slot';
            isValid = false;
        }
        
        return isValid;
    };
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        
        // Get form data
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const sessionType = document.getElementById('session-type').value;
        const mode = document.getElementById('mode').value;
        const date = document.getElementById('date').value;
        const time = timeInput.value;
        const message = document.getElementById('message').value;
        
        // Format date for better readability
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Create WhatsApp message
        const whatsappMessage = `*New Session Booking Request*

*Name:* ${fullname}
*Email:* ${email}
*Phone:* ${phone}

*Session Details:*
• Type: ${sessionType}
• Mode: ${mode}
• Date: ${formattedDate}
• Time: ${time}

*Message:*
${message || 'No additional message'}

---
Looking forward to hearing from you!`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/923281022334?text=${encodedMessage}`;
        
        // Simulate loading
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            timeSlots.forEach(s => s.classList.remove('selected'));
        }, 1000);
    });
};

// Success message
const showSuccessMessage = () => {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #7aa99a, #a888b5);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
                <strong style="display: block; margin-bottom: 0.25rem;">Booking Request Sent!</strong>
                <span style="font-size: 0.9rem; opacity: 0.9;">Redirecting to WhatsApp...</span>
            </div>
        </div>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) reverse';
        setTimeout(() => successDiv.remove(), 500);
    }, 3000);
};

// ===========================
// Hero 3D Effect
// ===========================

const initHero3D = () => {
    const heroCard = document.querySelector('.hero-card');
    const hero3DWrapper = document.querySelector('.hero-3d-wrapper');
    
    if (!heroCard || !hero3DWrapper) return;
    
    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        hero3DWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    heroCard.addEventListener('mouseleave', () => {
        hero3DWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
};

// ===========================
// Smooth Scroll
// ===========================

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===========================
// Lazy Load Images
// ===========================

const initLazyLoad = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// ===========================
// Performance Optimization
// ===========================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===========================
// Initialize All
// ===========================

const init = () => {
    initTheme();
    initScrollProgress();
    initNavigation();
    initPetalsAnimation();
    initScrollReveal();
    initBookingForm();
    initHero3D();
    initSmoothScroll();
    initLazyLoad();
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===========================
// Additional Event Listeners
// ===========================

// Optimize scroll events
const optimizedScroll = debounce(() => {
    // Any additional scroll-based functionality
}, 100);

window.addEventListener('scroll', optimizedScroll);

// Handle resize
const handleResize = debounce(() => {
    // Any resize-based functionality
}, 250);

window.addEventListener('resize', handleResize);

// Prevent right-click on images (optional)
// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('contextmenu', e => e.preventDefault());
// });

// ===========================
// Service Worker (Optional)
// ===========================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===========================
// Analytics Integration Point
// ===========================

const trackEvent = (eventName, eventData) => {
    // Google Analytics example
    // gtag('event', eventName, eventData);
    
    // Custom analytics
    console.log('Event:', eventName, eventData);
};

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: btn.textContent.trim(),
            button_href: btn.getAttribute('href')
        });
    });
});

// ===========================
// Accessibility Enhancements
// ===========================

// Skip to main content
const addSkipLink = () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: fixed;
        top: -100px;
        left: 10px;
        z-index: 10001;
        padding: 1rem;
        background: var(--accent-primary);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '10px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
};

addSkipLink();

// Keyboard navigation for cards
document.querySelectorAll('.service-card, .timeline-item, .contact-card').forEach(card => {
    card.setAttribute('tabindex', '0');
});

// ===========================
// Console Message
// ===========================

console.log('%c👋 Hello! ', 'background: linear-gradient(135deg, #7aa99a, #a888b5); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px;');
console.log('%cWebsite designed and developed for Zil-e-Huma Suleman', 'color: #7aa99a; font-size: 14px;');
console.log('%cClinical Psychologist | Islamabad, Pakistan', 'color: #a888b5; font-size: 12px;');
