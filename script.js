// DOM Elements
const sidebar = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeContactForm();
    initializeScrollAnimations();
    initializeTypedName();
    initializeUrlHandling();
});

// Navigation Management
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active nav link
            updateActiveNavLink(targetId);
            
            // Close mobile menu on mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                updateMobileToggleIcon(false);
            }
        });
    });
}

// URL and State Management
function initializeUrlHandling() {
    // Check for hash in URL on page load
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        updateActiveNavLink(hash);
    } else {
        // Default to about section if no hash
        showSection('about');
        updateActiveNavLink('about');
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'about';
        showSection(hash);
        updateActiveNavLink(hash);
    });
}

function updateActiveNavLink(targetId) {
    navLinks.forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('href') === '#' + targetId) {
            navLink.classList.add('active');
        }
    });
}

function showSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
            section.classList.add('active');
            // Trigger animation
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 50);
        }
    });
    
    // Update URL hash without triggering scroll
    history.replaceState(null, null, '#' + targetId);
}

// Mobile Menu Management
function initializeMobileMenu() {
    mobileToggle.addEventListener('click', function() {
        const isActive = sidebar.classList.contains('active');
        sidebar.classList.toggle('active');
        updateMobileToggleIcon(!isActive);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024 && 
            !sidebar.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            updateMobileToggleIcon(false);
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
            updateMobileToggleIcon(false);
        }
    });
}

function updateMobileToggleIcon(isOpen) {
    const icon = mobileToggle.querySelector('i');
    if (isOpen) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// Contact Form Management
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (validateForm(data)) {
            // Simulate form submission
            submitForm(data);
        }
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject.trim()) {
        errors.push('Subject is required');
    }
    
    if (!data.message.trim()) {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        showFormMessage(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        showFormMessage('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
    }, 2000);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        ${type === 'success' 
            ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' 
            : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
        }
    `;
    
    // Insert message
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Scroll Animations
function initializeScrollAnimations() {
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Stagger animation for skill items
                if (entry.target.classList.contains('skill-item')) {
                    const skillItems = entry.target.parentNode.children;
                    Array.from(skillItems).forEach((item, index) => {
                        if (item === entry.target) {
                            item.style.animationDelay = `${index * 0.1}s`;
                        }
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe timeline items, project cards, and skill items
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .project-card, .skill-item, .cert-card, .stat-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize typed name effect with rotating titles
function initializeTypedName() {
    const nameElement = document.getElementById('typed-name');
    if (!nameElement) return;
    
    // Titles to rotate through
    const titles = [
        'Computer Engineer',
        'DevOps & Cloud Engineer',
    ];
    
    let currentIndex = 0;
    
    // Set the initial content with empty rotating title
    nameElement.innerHTML = `<span class="name-line">Hello, I'm <span class="highlight">Habibullah Jubair</span></span><span class="rotating-title"></span>`;
    
    // Add a subtle fade-in animation for the name
    nameElement.style.opacity = '0';
    nameElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        nameElement.style.transition = 'opacity 1s ease, transform 1s ease';
        nameElement.style.opacity = '1';
        nameElement.style.transform = 'translateY(0)';
        
        // Start rotating titles after name appears
        setTimeout(() => {
            startTitleRotation();
        }, 2000);
    }, 500);
    
    function startTitleRotation() {
        const titleElement = nameElement.querySelector('.rotating-title');
        if (!titleElement) return;
        
        let typingTimeout;
        let deletingTimeout;
        
        function typeText(text, index = 0) {
            if (index < text.length) {
                titleElement.textContent = text.substring(0, index + 1);
                typingTimeout = setTimeout(() => {
                    typeText(text, index + 1);
                }, 100); // Speed of typing (100ms per letter)
            } else {
                // Wait a bit before starting to delete
                setTimeout(() => {
                    deleteText(text);
                }, 2000); // Show full text for 2 seconds
            }
        }
        
        function deleteText(text, index = text.length) {
            if (index > 0) {
                titleElement.textContent = text.substring(0, index - 1);
                deletingTimeout = setTimeout(() => {
                    deleteText(text, index - 1);
                }, 50); // Speed of deleting (50ms per letter - faster than typing)
            } else {
                // Move to next title
                currentIndex = (currentIndex + 1) % titles.length;
                setTimeout(() => {
                    typeText(titles[currentIndex]);
                }, 500); // Small pause before next title
            }
        }
        
        // Start with first title
        typeText(titles[currentIndex]);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
    
    .timeline-item:nth-child(even) .timeline-content {
        animation-delay: 0.2s;
    }
    
    .project-card:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .project-card:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .cert-card:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .cert-card:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .skill-item {
        animation: skillFadeIn 0.6s ease forwards;
        animation-play-state: paused;
    }
    
    .skill-item.animate-in {
        animation-play-state: running;
    }
    
    @keyframes skillFadeIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add pulse effect to certification cards
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.cert-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.cert-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (!href || href === '#') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        updateMobileToggleIcon(false);
    }
    
    // Arrow keys for section navigation
    if (e.altKey) {
        const activeLink = document.querySelector('.nav-link.active');
        const links = Array.from(navLinks);
        const currentIndex = links.indexOf(activeLink);
        
        if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
            e.preventDefault();
            links[currentIndex + 1].click();
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            links[currentIndex - 1].click();
        }
    }
});

// Performance optimization - lazy load heavy animations
let isHighPerformance = true;

// Detect if device prefers reduced motion
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isHighPerformance = false;
}

// Disable heavy animations on slower devices
if (!isHighPerformance) {
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    
    // Remove particle effects and complex animations
    const style = document.createElement('style');
    style.textContent = `
        .skill-item:hover {
            transform: none !important;
        }
        .project-card:hover {
            transform: translateY(-2px) !important;
        }
        .floating-animation {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}