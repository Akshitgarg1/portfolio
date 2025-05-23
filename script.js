// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--card-bg)';
        navbar.style.boxShadow = '0 2px 10px var(--shadow-color)';
    } else {
        navbar.style.background = 'var(--card-bg)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const formGroups = contactForm.querySelectorAll('.form-group');

// Form validation functions
const validateName = (name) => {
    return name.trim().length >= 2;
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateSubject = (subject) => {
    return subject.trim().length >= 5;
};

const validateMessage = (message) => {
    return message.trim().length >= 10;
};

// Show error message
const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = message;
};

// Clear error message
const clearError = (input) => {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = '';
};

// Validate input on blur
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        switch(input.id) {
            case 'name':
                if (!validateName(value)) {
                    showError(input, 'Name must be at least 2 characters long');
                } else {
                    clearError(input);
                }
                break;
            case 'email':
                if (!validateEmail(value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
                break;
            case 'subject':
                if (!validateSubject(value)) {
                    showError(input, 'Subject must be at least 5 characters long');
                } else {
                    clearError(input);
                }
                break;
            case 'message':
                if (!validateMessage(value)) {
                    showError(input, 'Message must be at least 10 characters long');
                } else {
                    clearError(input);
                }
                break;
        }
    });
});

// Form submission handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    
    // Validate all fields
    let isValid = true;
    
    if (!validateName(name)) {
        showError(contactForm.querySelector('#name'), 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showError(contactForm.querySelector('#email'), 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!validateSubject(subject)) {
        showError(contactForm.querySelector('#subject'), 'Subject must be at least 5 characters long');
        isValid = false;
    }
    
    if (!validateMessage(message)) {
        showError(contactForm.querySelector('#message'), 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for your message! I will get back to you soon.</p>
            `;
            
            // Insert success message
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            successMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    }
});

// Video lazy loading
document.querySelectorAll('video').forEach(video => {
    video.setAttribute('preload', 'none');
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.classList.contains('no-loading')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 1000);
        }
    });
});

// Timeline Animation
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Project Cards Animation
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            projectObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

projectCards.forEach(card => {
    projectObserver.observe(card);
});

// Project Modal Functionality
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const projectButtons = document.querySelectorAll('.project-btn');

// Project data (you can move this to a separate file or fetch from an API)
const projectData = {
    project1: {
        title: 'E-Commerce Website',
        image: 'https://via.placeholder.com/800x400',
        description: 'A full-stack e-commerce platform with user authentication, product management, and payment integration. Built with modern web technologies and best practices.',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        features: [
            'User authentication and authorization',
            'Product catalog with search and filters',
            'Shopping cart and checkout process',
            'Payment integration with Stripe',
            'Admin dashboard for product management'
        ],
        github: '#',
        demo: '#'
    },
    project2: {
        title: 'Task Management App',
        image: 'https://via.placeholder.com/800x400',
        description: 'A collaborative task management application with real-time updates and team features. Designed to improve productivity and team collaboration.',
        tech: ['Vue.js', 'Firebase', 'Tailwind CSS'],
        features: [
            'Real-time task updates',
            'Team collaboration features',
            'Task categorization and priority levels',
            'Progress tracking and analytics',
            'Mobile-responsive design'
        ],
        github: '#',
        demo: '#'
    },
    project3: {
        title: 'AI Image Generator',
        image: 'https://via.placeholder.com/800x400',
        description: 'An AI-powered application that generates images based on text descriptions using machine learning. Leverages state-of-the-art AI models for image generation.',
        tech: ['Python', 'TensorFlow', 'Flask', 'OpenAI API'],
        features: [
            'Text-to-image generation',
            'Multiple AI model support',
            'Image customization options',
            'Batch processing capability',
            'API integration for external use'
        ],
        github: '#',
        demo: '#'
    }
};

// Open modal with project details
projectButtons.forEach(button => {
    button.addEventListener('click', () => {
        const projectId = button.dataset.project;
        const project = projectData[projectId];
        
        if (project) {
            document.querySelector('.modal-title').textContent = project.title;
            document.querySelector('.modal-image img').src = project.image;
            document.querySelector('.modal-description').textContent = project.description;
            
            const techContainer = document.querySelector('.modal-tech');
            techContainer.innerHTML = project.tech.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
            
            const featuresList = document.querySelector('.modal-features ul');
            featuresList.innerHTML = project.features.map(feature => 
                `<li>${feature}</li>`
            ).join('');
            
            const links = document.querySelector('.modal-links');
            links.querySelector('.primary-btn').href = project.github;
            links.querySelector('.secondary-btn').href = project.demo;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Video Player Functionality
const videoWrapper = document.querySelector('.video-wrapper');
const video = document.getElementById('introVideo');
const playButton = document.querySelector('.play-button');
const videoOverlay = document.querySelector('.video-overlay');

if (videoWrapper && video && playButton && videoOverlay) {
    // Play video when clicking the play button or overlay
    const playVideo = () => {
        video.play();
        videoWrapper.classList.add('playing');
    };

    playButton.addEventListener('click', playVideo);
    videoOverlay.addEventListener('click', playVideo);

    // Handle video end
    video.addEventListener('ended', () => {
        videoWrapper.classList.remove('playing');
    });

    // Handle video pause
    video.addEventListener('pause', () => {
        if (!video.ended) {
            videoWrapper.classList.remove('playing');
        }
    });

    // Handle video play
    video.addEventListener('play', () => {
        videoWrapper.classList.add('playing');
    });

    // Add loading animation to play button
    playButton.addEventListener('click', function() {
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
            this.innerHTML = originalHTML;
        }, 500);
    });
}

// Interview Videos Animation
const interviewCards = document.querySelectorAll('.interview-card');

const interviewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            interviewObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

interviewCards.forEach(card => {
    interviewObserver.observe(card);
});

// Interview Video Player Functionality
const interviewVideos = document.querySelectorAll('.interview-video');
const interviewPlayButtons = document.querySelectorAll('.interview-card .play-button');
const interviewOverlays = document.querySelectorAll('.interview-card .video-overlay');

interviewVideos.forEach((video, index) => {
    const wrapper = video.closest('.video-wrapper');
    const playButton = interviewPlayButtons[index];
    const overlay = interviewOverlays[index];

    // Play video when clicking the play button or overlay
    const playVideo = () => {
        video.play();
        wrapper.classList.add('playing');
    };

    playButton.addEventListener('click', playVideo);
    overlay.addEventListener('click', playVideo);

    // Handle video end
    video.addEventListener('ended', () => {
        wrapper.classList.remove('playing');
    });

    // Handle video pause
    video.addEventListener('pause', () => {
        if (!video.ended) {
            wrapper.classList.remove('playing');
        }
    });

    // Handle video play
    video.addEventListener('play', () => {
        wrapper.classList.add('playing');
    });

    // Add loading animation to play button
    playButton.addEventListener('click', function() {
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
            this.innerHTML = originalHTML;
        }, 500);
    });
});

// Journey Timeline Animation
const journeyItems = document.querySelectorAll('.journey-timeline .timeline-item');

const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            journeyObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

journeyItems.forEach(item => {
    journeyObserver.observe(item);
});

// Inspiration Cards Animation
const inspirationCards = document.querySelectorAll('.inspiration-card');

const inspirationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            inspirationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

inspirationCards.forEach(card => {
    inspirationObserver.observe(card);
});

// PESE Section Animations
const peseCards = document.querySelectorAll('.pese-card');
const peseReflection = document.querySelector('.pese-reflection');

const peseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

peseCards.forEach(card => {
    peseObserver.observe(card);
});

if (peseReflection) {
    peseObserver.observe(peseReflection);
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
} else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Add click event listener to theme toggle button
themeToggle.addEventListener('click', toggleTheme);

// Scroll to Top Functionality
const scrollTopButton = document.getElementById('scroll-top');

// Show/hide scroll-to-top button based on scroll position
function toggleScrollTopButton() {
    if (window.scrollY > 200) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add event listeners for scroll-to-top functionality
window.addEventListener('scroll', toggleScrollTopButton);
scrollTopButton.addEventListener('click', scrollToTop);

// Story cards visibility
const storyCards = document.querySelectorAll('.story-card');

const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-50px'
});

storyCards.forEach(card => {
    storyObserver.observe(card);
}); 