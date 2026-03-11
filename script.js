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
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim().toLowerCase();
            const lastLine = terminalOutput.querySelector('.last-line');
            
            // Add the command line to output (before the input line)
            if (input) {
                const commandLine = createTerminalLine(input);
                terminalOutput.insertBefore(commandLine, lastLine);
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