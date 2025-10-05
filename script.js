// Initialize AOS (Animate On Scroll) library
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.transform = navMenu.classList.contains('active') 
            ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? 0 : index === 0 ? 5 : -5}px, ${index === 1 ? 0 : index === 0 ? 5 : -5}px)`
            : 'none';
    });
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navbarLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    
    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navbarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Navbar background on scroll
function updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Parallax effect for hero shapes
function updateParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    floatingElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.15);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Email form functionality (if needed)
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.innerHTML;
    const textWithoutSpan = heroTitle.textContent;
    let displayText = '';
    let i = 0;
    
    heroTitle.innerHTML = '';
    
    function typeWriter() {
        if (i < textWithoutSpan.length) {
            displayText += textWithoutSpan.charAt(i);
            
            // Check if we need to add the span for "BHOOMI AWHAD"
            if (displayText.includes('BHOOMI AWHAD')) {
                const beforeSpan = displayText.substring(0, displayText.indexOf('BHOOMI AWHAD'));
                const spanText = 'BHOOMI AWHAD';
                const afterSpan = displayText.substring(displayText.indexOf('BHOOMI AWHAD') + spanText.length);
                heroTitle.innerHTML = beforeSpan + '<span class="gradient-text">' + spanText + '</span>' + afterSpan + '<span class="cursor">|</span>';
            } else {
                heroTitle.innerHTML = displayText + '<span class="cursor">|</span>';
            }
            
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                const cursor = heroTitle.querySelector('.cursor');
                if (cursor) cursor.remove();
            }, 1000);
        }
    }
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger animation for project cards
                if (entry.target.classList.contains('projects-grid')) {
                    const cards = entry.target.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
                
                // Add stagger animation for skill categories
                if (entry.target.classList.contains('skills-grid')) {
                    const categories = entry.target.querySelectorAll('.skill-category');
                    categories.forEach((category, index) => {
                        setTimeout(() => {
                            category.style.opacity = '1';
                            category.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.projects-grid, .skills-grid, .about-content, .contact-content').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace('+', ''));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, 30);
                
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Particle background animation
function createParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);
    
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
}

// Add CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cursor {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .project-card, .skill-category {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate .project-card,
        .animate .skill-category {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-menu.active .nav-item {
            animation: slideInLeft 0.3s ease forwards;
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

// Email form functionality (if needed)
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message (you can integrate with a backend service)
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Message Sent!';
        button.style.background = 'var(--primary-green)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            form.reset();
        }, 3000);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    addAnimationStyles();
    initTypingAnimation();
    initScrollAnimations();
    animateCounters();
    initContactForm();
    
    // Initialize particle background
    createParticleBackground();
    
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        highlightActiveSection();
        updateNavbarOnScroll();
        updateParallax();
    });
    
    // Resize event listeners
    window.addEventListener('resize', () => {
        // Handle responsive updates
    });
});

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});