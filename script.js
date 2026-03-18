const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navbar = document.querySelector('.navbar');

// Scroll Progress Bar
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = progress + '%';

    // Navbar glassmorphism effect on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Simple Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');
const savedTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.querySelector('i').className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
});

// Smooth Scroll for navigation & Manual Active State
const navLinksArray = document.querySelectorAll('.nav-links a');

navLinksArray.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Update active class manually
        navLinksArray.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        }

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Observer (Active state logic removed)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "-20% 0px -20% 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

// Observe both sections and the main home container
document.querySelectorAll('.section, #home').forEach(el => {
    observer.observe(el);
});

// Scroll Spy Navigation Observer
const spyObserverOptions = {
    rootMargin: "-40% 0px -60% 0px"
};

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Update active nav link
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, spyObserverOptions);

// Observe sections for scroll spy
document.querySelectorAll('.section, #home').forEach(el => {
    spyObserver.observe(el);
});

// Dynamic Role Text Typing Effect
const roleText = document.getElementById('role-text');
const roles = [
    'System Architect',
    'Database Engineer',
    'Full Stack Engineer',
    'ML Enthusiast',
    'Competitive Programmer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeRoles() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        roleText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        roleText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(typeRoles, typingSpeed);
}

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: () => "Available commands: whoami, skills, projects, contact, clear, hello",
    whoami: () => "Akshit Garg | System Architect & Full-Stack Engineer. Currently architecting secure digital experiences and mastering PostgreSQL.",
    skills: () => "Languages: C++, Python, JavaScript, SQL. \nFrameworks: Flask, React.js, Node.js. \nExpertise: System Security, DBMS, ML.",
    projects: () => "Recent Work: \n1. Secure IAM (Flask/Security) \n2. PagePulse (JS/Systems) \n3. Quick Add (Chrome Ext)",
    contact: () => "Email: garg28966@gmail.com \nLinkedIn: /in/akshitgarg26 \nGitHub: /Akshitgarg1",
    clear: () => {
        const lastLine = terminalOutput.querySelector('.last-line');
        terminalOutput.innerHTML = '';
        terminalOutput.appendChild(lastLine);
        return null;
    },
    hello: () => "System: Connection established. Hello, visitor! Use 'help' to navigate."
};

function createTerminalLine(input, isCommand = true) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isCommand) {
        line.innerHTML = `<span class="t-prompt">akshit@portfolio:~$</span><span class="t-command">${input}</span>`;
    } else {
        line.innerHTML = `<div class="t-output">${input}</div>`;
    }
    return line;
}

if (terminalInput) {
    let commandHistory = [];
    let historyIndex = -1;

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawInput = terminalInput.value.trim();
            const input = rawInput.toLowerCase();
            const lastLine = terminalOutput.querySelector('.last-line');
            
            // Add the command line to output (before the input line)
            if (rawInput) {
                const commandLine = createTerminalLine(rawInput);
                terminalOutput.insertBefore(commandLine, lastLine);

                // Add to history
                if (commandHistory[commandHistory.length - 1] !== rawInput) {
                    commandHistory.push(rawInput);
                }
                historyIndex = commandHistory.length;
            }

            // Process command
            if (input in commands) {
                const output = commands[input]();
                if (output) {
                    const outputLine = createTerminalLine(output, false);
                    terminalOutput.insertBefore(outputLine, lastLine);
                }
            } else if (input) {
                const errorLine = createTerminalLine(`Command not found: ${input}. Type 'help' for options.`, false);
                errorLine.querySelector('.t-output').classList.add('t-error');
                terminalOutput.insertBefore(errorLine, lastLine);
            }

            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // Auto-focus terminal on click
    document.querySelector('.terminal-container').addEventListener('click', () => {
        terminalInput.focus();
    });

    // Welcome message
    window.addEventListener('load', () => {
        const welcome = createTerminalLine("Welcome to Akshit's System. Type 'help' to start.", false);
        terminalOutput.insertBefore(welcome, terminalOutput.querySelector('.last-line'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    typeRoles();
});

// Back to Top functionality
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Toast Notification System
const toastContainer = document.getElementById('toast-container');
const contactForm = document.getElementById('contactForm');

function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow for animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400); // Wait for transition to finish
    }, 3500);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic form animation / feedback
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'wait';
        
        try {
            // Send the form data to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset(); // Clear the form
            } else {
                // If the user hasn't replaced YOUR_FORMSPREE_ID yet
                if (contactForm.action.includes('YOUR_FORMSPREE_ID')) {
                    showToast('Please insert your Formspree ID in index.html!', 'error');
                } else {
                    showToast('Oops! There was a problem sending your message.', 'error');
                }
            }
        } catch (error) {
            showToast('Oops! There was a network error.', 'error');
        } finally {
            // Revert button state
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    });
}