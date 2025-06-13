// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Animated Counter for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let count = 0;
        
        const updateCounter = () => {
            if (count < target) {
                count += increment;
                if (target >= 1000) {
                    counter.innerText = formatNumber(Math.ceil(count));
                } else {
                    counter.innerText = Math.ceil(count);
                }
                setTimeout(updateCounter, 20);
            } else {
                if (target >= 1000) {
                    counter.innerText = formatNumber(target);
                } else {
                    counter.innerText = target;
                }
            }
        };
        
        updateCounter();
    });
}

// Format numbers with K, M suffixes
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.classList.contains('stats-section')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .stats-section');
    animatedElements.forEach(el => observer.observe(el));
});

// Smooth scrolling for anchor links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('.email-input').value;
        
        if (validateEmail(email)) {
            // Simulate form submission
            showNotification('Thank you for subscribing!', 'success');
            e.target.querySelector('.email-input').value = '';
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #22c55e;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero::before');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Chart animation on page load
document.addEventListener('DOMContentLoaded', () => {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = `growUp 1.5s ease-out forwards`;
        }, index * 200);
    });
});

// Add hover effects to article cards
document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        setTimeout(() => {
            typeWriter(subtitle, originalText, 80);
        }, 1000);
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll-to-top functionality
const scrollToTop = document.createElement('button');
scrollToTop.innerHTML = '↑';
scrollToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--bg-dark);
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTop.style.opacity = '1';
        scrollToTop.style.visibility = 'visible';
    } else {
        scrollToTop.style.opacity = '0';
        scrollToTop.style.visibility = 'hidden';
    }
});

scrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Story expansion functionality
function toggleStory(button) {
    const storyCard = button.closest('.story-card') || button.closest('.hero-story');
    const expandedContent = storyCard.querySelector('.story-expanded, .story-preview-more');
    const isExpanded = expandedContent.style.display === 'block';
    
    if (isExpanded) {
        expandedContent.style.display = 'none';
        button.textContent = button.textContent.replace('Show Less', 'Read Full Story').replace('Collapse Investigation', 'Read Full Investigation');
        button.classList.remove('expanded');
    } else {
        expandedContent.style.display = 'block';
        if (button.textContent.includes('Investigation')) {
            button.textContent = 'Collapse Investigation';
        } else {
            button.textContent = 'Show Less';
        }
        button.classList.add('expanded');
        
        // Smooth scroll to expanded content
        setTimeout(() => {
            expandedContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
}

// Load more stories functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            showNotification('Loading more stories...', 'success');
            // Simulate loading delay
            setTimeout(() => {
                showNotification('No more stories to load at this time.', 'error');
            }, 1500);
        });
    }
});

// Mobile optimization improvements
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on input focus for iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Improve touch interactions
    let isTouch = false;
    
    // Detect touch device
    window.addEventListener('touchstart', () => {
        isTouch = true;
        document.body.classList.add('touch-device');
    }, { once: true });
    
    // Improve mobile navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('touchstart', () => {
            link.style.backgroundColor = 'rgba(0, 255, 148, 0.1)';
        });
        
        link.addEventListener('touchend', () => {
            setTimeout(() => {
                link.style.backgroundColor = '';
            }, 150);
        });
    });
    
    // Improve story card touch interactions
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            if (isTouch) {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 15px 30px rgba(0, 255, 148, 0.15)';
            }
        });
        
        card.addEventListener('touchend', () => {
            if (isTouch) {
                setTimeout(() => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }, 150);
            }
        });
    });
    
    // Optimize scroll performance on mobile
    let ticking = false;
    
    function updateOnScroll() {
        // Reduce scroll event frequency on mobile
        if (!ticking) {
            requestAnimationFrame(() => {
                // Only run navbar background change on mobile
                if (window.innerWidth <= 768) {
                    const navbar = document.querySelector('.navbar');
                    if (window.scrollY > 50) {
                        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                        navbar.style.backdropFilter = 'blur(10px)';
                    } else {
                        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                        navbar.style.backdropFilter = 'blur(5px)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    
    // Improve button click areas on mobile
    const buttons = document.querySelectorAll('.expand-story-btn, .btn-primary, .btn-secondary, .load-more-btn');
    buttons.forEach(button => {
        button.style.minHeight = '48px';
        button.style.minWidth = '48px';
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('touchstart', (e) => {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Prevent scroll when mobile menu is open
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Restore scroll when nav links are clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.body.style.overflow = '';
        });
    });
    
    // Optimize story expansion for mobile
    const originalToggleStory = window.toggleStory;
    window.toggleStory = function(button) {
        originalToggleStory(button);
        
        // Add haptic feedback on mobile (if supported)
        if (navigator.vibrate && isTouch) {
            navigator.vibrate(50);
        }
        
        // Ensure button is visible after expansion on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                button.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        }
    };
}); 