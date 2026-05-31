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

    // Force About (#home) active when at top
    if (window.scrollY < 80) {
        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
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
let roles = [
    'Backend & Full-Stack Developer',
    'CSE Undergraduate',
    'Competitive Programmer',
    'ML Enthusiast'
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

let commands = {
    help: () => "Available commands: whoami, skills, projects, contact, clear, hello",
    whoami: () => "Akshit Garg | CSE Undergraduate & Backend & Full-Stack Developer.",
    skills: () => "Languages: C++, Python, JavaScript, SQL, C. \nWeb: React.js, Flask, HTML, CSS, Firebase. \nML: Scikit-learn, MobileNetV2, Random Forest.",
    projects: () => "Recent Work: \n1. TradeSmart (ML/Full-Stack) \n2. RoleGuard (Backend/Security) \n3. PagePulse (OS Visualizer)",
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
    initDynamicPortfolio();
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

// ==========================================
// DYNAMIC PORTFOLIO DATA BINDING ENGINE
// ==========================================

let portfolioData = null;

async function initDynamicPortfolio() {
    try {
        const response = await fetch('my_real_info.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        portfolioData = await response.json();
        
        // Overwrite global typing roles from JSON
        if (portfolioData.typing_roles) {
            roles = portfolioData.typing_roles;
        }

        // Render all elements
        renderHero(portfolioData);
        renderAbout(portfolioData);
        renderExperience(portfolioData);
        renderProjects(portfolioData);
        renderSkills(portfolioData);
        renderEducation(portfolioData);
        renderCodingProwess(portfolioData);
        renderCertifications(portfolioData);
        renderContactSection(portfolioData);

        // Update interactive terminal command engine
        updateTerminalCommands(portfolioData);

    } catch (error) {
        console.warn("Could not load portfolio data dynamically (CORS policy or file missing). Standard static fallback is active.", error);
        
        // If fetch fails (like file:// protocol), show custom CORS warning inside terminal output
        showTerminalCorsWarning();
    } finally {
        // Always start typing effect (either with JSON roles or hardcoded fallback roles)
        typeRoles();
    }
}

function renderHero(data) {
    const heroName = document.getElementById('hero-name');
    const heroTagline = document.getElementById('hero-tagline');
    const heroLocation = document.getElementById('hero-location');
    const heroResume = document.getElementById('hero-resume');
    const heroSocials = document.getElementById('hero-socials');
    const btnLinkedin = document.getElementById('btn-linkedin');
    const btnGithub = document.getElementById('btn-github');

    if (heroName && data.name) heroName.textContent = data.name;
    if (heroTagline && data.tagline) heroTagline.textContent = data.tagline;
    if (heroLocation && data.location) {
        heroLocation.innerHTML = `<i class="fas fa-location-dot"></i> ${data.location}`;
    }
    if (heroResume && data.resume_url) {
        heroResume.href = data.resume_url;
    }
    if (btnLinkedin && data.contact?.linkedin) {
        btnLinkedin.href = data.contact.linkedin;
    }
    if (btnGithub && data.contact?.github) {
        btnGithub.href = data.contact.github;
    }

    if (heroSocials && data.contact) {
        let socialsHtml = '';
        if (data.contact.linkedin) {
            socialsHtml += `<a href="${data.contact.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
        }
        if (data.contact.github) {
            socialsHtml += `<a href="${data.contact.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
        }
        if (data.contact.email) {
            socialsHtml += `<a href="mailto:${data.contact.email}" title="Email"><i class="fas fa-envelope"></i></a>`;
        }
        heroSocials.innerHTML = socialsHtml;
    }
}

function renderAbout(data) {
    const philosophy = document.getElementById('about-philosophy');
    const bullets = document.getElementById('about-bullets');

    if (philosophy && data.about?.philosophy) {
        philosophy.innerHTML = `"${data.about.philosophy}"`;
    }

    if (bullets && data.about?.bullets) {
        bullets.innerHTML = data.about.bullets.map(b => `
            <li>
                <i class="fas ${b.icon}"></i>
                <strong>${b.title}</strong> ${b.text}
            </li>
        `).join('');
    }
}

function renderExperience(data) {
    const container = document.getElementById('experience-container');
    if (!container || !data.experience) return;

    const totalExp = data.experience.length;

    container.innerHTML = data.experience.map((exp, idx) => {
        const badgeNum = totalExp - idx;
        
        let tagsHtml = '';
        if (exp.technologies) {
            tagsHtml = `
                <div class="exp-tags-row">
                    ${exp.technologies.map(tech => `<span class="exp-tag">${tech}</span>`).join('')}
                </div>
            `;
        }

        return `
            <div class="exp-item">
                <div class="exp-badge-num">${badgeNum}</div>
                <div class="exp-card">
                    <div class="exp-card-header">
                        <div class="exp-card-titles">
                            <h3>${exp.title}</h3>
                            <p class="exp-company-name">${exp.organization}</p>
                            ${exp.division ? `<p class="exp-division-name">${exp.division}</p>` : ''}
                        </div>
                        <span class="exp-date-pill">${exp.duration}</span>
                    </div>
                    ${tagsHtml}
                    <ul class="exp-bullets-list">
                        ${exp.responsibilities.map(resp => `<li class="exp-bullet-item">${resp}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
}
function renderProjects(data) {
    const container = document.getElementById('projects-container');
    if (!container || !data.projects) return;

    container.innerHTML = data.projects.map(proj => {
        let linksHtml = '';
        if (proj.links?.github) {
            linksHtml += `<a href="${proj.links.github}" target="_blank" class="code-link" title="Source Code"><i class="fab fa-github"></i></a>`;
        }
        if (proj.links?.demo) {
            linksHtml += `<a href="${proj.links.demo}" target="_blank" class="demo-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`;
        }

        let techTags = proj.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('');

        let bulletsHtml = '';
        if (proj.challenge || proj.solution || proj.impact) {
            bulletsHtml = `
                <div class="case-study">
                    ${proj.challenge ? `<p><strong>Challenge:</strong> ${proj.challenge}</p>` : ''}
                    ${proj.solution ? `<p><strong>Solution:</strong> ${proj.solution}</p>` : ''}
                    ${proj.impact ? `<p><strong>Impact:</strong> ${proj.impact}</p>` : ''}
                </div>
            `;
        } else if (proj.description) {
            bulletsHtml = `
                <div class="case-study">
                    ${proj.description.map(desc => `<p>${desc}</p>`).join('')}
                </div>
            `;
        }

        return `
            <div class="project-card">
                <div class="project-card-header">
                    <h3 class="project-card-title">${proj.title}</h3>
                    <div class="project-card-links">
                        ${linksHtml}
                    </div>
                </div>
                <div class="project-card-subtitle">${proj.category}</div>
                ${bulletsHtml}
                <div class="project-card-tags">
                    ${techTags}
                </div>
            </div>
        `;
    }).join('');
}

function getSkillIcon(skill) {
    const name = skill.toLowerCase().trim();
    
    // Devicon brand icons mapping
    if (name === 'c++') return '<i class="devicon-cplusplus-plain colored"></i>';
    if (name === 'python') return '<i class="devicon-python-plain colored"></i>';
    if (name === 'javascript') return '<i class="devicon-javascript-plain colored"></i>';
    if (name === 'c') return '<i class="devicon-c-plain colored"></i>';
    if (name === 'react.js' || name === 'react') return '<i class="devicon-react-original colored"></i>';
    if (name === 'flask') return '<i class="devicon-flask-original"></i>';
    if (name === 'html' || name === 'html5') return '<i class="devicon-html5-plain colored"></i>';
    if (name === 'css' || name === 'css3') return '<i class="devicon-css3-plain colored"></i>';
    if (name === 'firebase') return '<i class="devicon-firebase-plain colored"></i>';
    if (name === 'postgresql') return '<i class="devicon-postgresql-plain colored"></i>';
    if (name === 'mysql') return '<i class="devicon-mysql-plain colored"></i>';
    if (name === 'git') return '<i class="devicon-git-plain colored"></i>';
    if (name === 'github') return '<i class="devicon-github-original"></i>';
    if (name === 'docker') return '<i class="devicon-docker-plain colored"></i>';
    if (name === 'golang basics' || name === 'go' || name === 'golang') return '<i class="devicon-go-original-wordmark colored"></i>';
    if (name === 'pandas') return '<i class="devicon-pandas-plain colored"></i>';
    if (name === 'numpy') return '<i class="devicon-numpy-plain colored"></i>';
    if (name === 'sql') return '<i class="devicon-mysql-plain colored"></i>';
    
    // Font Awesome generic symbols mapping
    if (name.includes('data structures') || name.includes('dsa') || name.includes('algorithm')) return '<i class="fas fa-code-branch" style="color: #60a5fa;"></i>';
    if (name.includes('operating system') || name === 'os') return '<i class="fas fa-desktop" style="color: #f43f5e;"></i>';
    if (name.includes('dbms') || name.includes('database')) return '<i class="fas fa-database" style="color: #10b981;"></i>';
    if (name.includes('network') || name.includes('cn')) return '<i class="fas fa-network-wired" style="color: #a855f7;"></i>';
    if (name.includes('oops') || name.includes('object-oriented')) return '<i class="fas fa-cubes" style="color: #fbbf24;"></i>';
    if (name.includes('api') || name.includes('rest')) return '<i class="fas fa-gears" style="color: #f97316;"></i>';
    if (name.includes('scikit') || name.includes('machine learning') || name.includes('ml')) return '<i class="fas fa-brain" style="color: #6366f1;"></i>';
    if (name.includes('mobilenet') || name.includes('vision') || name.includes('image')) return '<i class="fas fa-eye" style="color: #14b8a6;"></i>';
    if (name.includes('random forest') || name.includes('tree')) return '<i class="fas fa-tree" style="color: #22c55e;"></i>';
    if (name.includes('postman')) return '<i class="fas fa-paper-plane" style="color: #ff6c37;"></i>';
    if (name.includes('latex')) return '<i class="fas fa-file-pdf" style="color: #9f1239;"></i>';
    if (name.includes('system design')) return '<i class="fas fa-sitemap" style="color: #3b82f6;"></i>';
    
    // Default fallback icon
    return '<i class="fas fa-check-circle" style="color: var(--accent);"></i>';
}

function renderSkills(data) {
    const grid = document.getElementById('skills-grid-new');
    if (!grid || !data.skills) return;

    let html = '';

    // Card 1: Languages
    if (data.skills.languages && data.skills.languages.length > 0) {
        html += `
        <div class="skill-group-card">
            <div class="skill-group-title">Languages</div>
            <div class="tags-flex">
                ${data.skills.languages.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
            </div>
        </div>`;
    }

    // Card 2: Web Development
    if (data.skills.web_development && data.skills.web_development.length > 0) {
        html += `
        <div class="skill-group-card">
            <div class="skill-group-title">Web Development</div>
            <div class="tags-flex">
                ${data.skills.web_development.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
            </div>
        </div>`;
    }

    // Card 3 & 6: Databases & Tools (Separated dynamically from databases_and_tools)
    if (data.skills.databases_and_tools && data.skills.databases_and_tools.length > 0) {
        const dbs = data.skills.databases_and_tools.filter(t => t.toLowerCase().includes('sql') || t.toLowerCase().includes('postgre'));
        const tools = data.skills.databases_and_tools.filter(t => !t.toLowerCase().includes('sql') && !t.toLowerCase().includes('postgre'));

        if (dbs.length > 0) {
            html += `
            <div class="skill-group-card">
                <div class="skill-group-title">Databases</div>
                <div class="tags-flex">
                    ${dbs.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
                </div>
            </div>`;
        }

        if (tools.length > 0) {
            html += `
            <div class="skill-group-card">
                <div class="skill-group-title">Tools</div>
                <div class="tags-flex">
                    ${tools.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
                </div>
            </div>`;
        }
    }

    // Card 4: Machine Learning
    if (data.skills.machine_learning && data.skills.machine_learning.length > 0) {
        html += `
        <div class="skill-group-card">
            <div class="skill-group-title">Machine Learning</div>
            <div class="tags-flex">
                ${data.skills.machine_learning.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
            </div>
        </div>`;
    }

    // Card 5: Core Subjects
    if (data.skills.core_subjects && data.skills.core_subjects.length > 0) {
        html += `
        <div class="skill-group-card">
            <div class="skill-group-title">Core Subjects</div>
            <div class="tags-flex">
                ${data.skills.core_subjects.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
            </div>
        </div>`;
    }

    // Card 7: Currently Exploring
    if (data.skills.currently_exploring && data.skills.currently_exploring.length > 0) {
        html += `
        <div class="skill-group-card">
            <div class="skill-group-title">Currently Exploring</div>
            <div class="tags-flex">
                ${data.skills.currently_exploring.map(s => `<span class="skill-tag">${getSkillIcon(s)} ${s}</span>`).join('')}
            </div>
        </div>`;
    }

    grid.innerHTML = html;
}

function renderEducation(data) {
    const container = document.getElementById('education-timeline');
    if (!container || !data.education) return;

    const uni = data.education.university;
    const school = data.education.school;

    let sgpaHtml = '';
    if (uni.semester_sgpa) {
        sgpaHtml = Object.entries(uni.semester_sgpa).map(([sem, val]) => {
            const isHighlight = val >= 9.0 ? ' highlight' : '';
            return `<div class="sgpa-pill${isHighlight}"><span>${sem}</span> ${val.toFixed(2)}</div>`;
        }).join('');
    }

    let courseworkHtml = '';
    if (uni.knowledge_domains) {
        const domainIcons = {
            "Systems & Security": "fa-shield-halved",
            "Algorithmic Foundations": "fa-layer-group",
            "Data & Development": "fa-code-branch"
        };

        courseworkHtml = Object.entries(uni.knowledge_domains).map(([domain, subjects]) => {
            const icon = domainIcons[domain] || "fa-book";
            const tagsHtml = subjects.map(sub => {
                const match = sub.match(/(.*)\s*\((.*)\)/);
                if (match) {
                    return `<span class="course-tag">${match[1]} <span>${match[2]}</span></span>`;
                }
                return `<span class="course-tag">${sub}</span>`;
            }).join('');

            return `
                <div class="subject-card">
                    <div class="subject-header">
                        <i class="fas ${icon}"></i>
                        <h5>${domain}</h5>
                    </div>
                    <div class="course-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    let schoolHtml = '';
    if (school) {
        schoolHtml = `
            <div class="school-grid">
                ${school.class_xii ? `
                    <div class="education-card school">
                        <div class="edu-header">
                            <div class="title-group">
                                <i class="fas fa-school"></i>
                                <div>
                                    <h4>Class XII (${school.class_xii.board})</h4>
                                    <p class="school-name">${school.class_xii.school}</p>
                                </div>
                            </div>
                            <span class="timeline-date">${school.class_xii.year}</span>
                        </div>
                        <div class="score-pill">${school.class_xii.stream} | ${school.class_xii.percentage}</div>
                    </div>
                ` : ''}

                ${school.class_x ? `
                    <div class="education-card school">
                        <div class="edu-header">
                            <div class="title-group">
                                <i class="fas fa-school"></i>
                                <div>
                                    <h4>Class X (${school.class_x.board})</h4>
                                    <p class="school-name">${school.class_x.school}</p>
                                </div>
                            </div>
                            <span class="timeline-date">${school.class_x.year}</span>
                        </div>
                        <div class="score-pill">Total: ${school.class_x.percentage}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    container.innerHTML = `
        <!-- University -->
        <div class="education-card primary">
            <div class="edu-header">
                <div class="title-group">
                    <i class="fas fa-graduation-cap university-icon"></i>
                    <div>
                        <h3>${uni.name}</h3>
                        <p class="degree">${uni.degree}</p>
                    </div>
                </div>
                <div class="edu-meta">
                    <span class="timeline-date">${uni.duration}</span>
                    <span class="edu-location">${uni.location || 'Dehradun, India'}</span>
                </div>
            </div>
            <div class="edu-body">
                <div class="performance-stats-grid">
                    <div class="score-card main-cgpa">
                        <span class="score-label">Overall CGPA</span>
                        <span class="score-value">${uni.cgpa}</span>
                    </div>
                    <div class="sgpa-summary">
                        <h5>Semester Performance (SGPA):</h5>
                        <div class="sgpa-grid-row">
                            ${sgpaHtml}
                        </div>
                    </div>
                </div>

                <div class="coursework-section">
                    <h4>Knowledge Domains:</h4>
                    <div class="coursework-bento">
                        ${courseworkHtml}
                    </div>
                </div>
            </div>
        </div>

        ${schoolHtml}
    `;
}

function renderCodingProwess(data) {
    const container = document.getElementById('coding-stats-container');
    if (!container || !data.achievements?.competitive_programming) return;

    const cp = data.achievements.competitive_programming;

    const config = {
        leetcode: {
            title: "LeetCode",
            icon: "fa-code",
            class: "leetcode",
            footerText: (item) => `Max Rating: ${item.max_rating} | DP, Graphs, System Design`,
            stats: (item) => `
                <div class="stat-box">
                    <span class="stat-value">${item.solved}</span>
                    <span class="stat-label">Solved</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${item.rating}</span>
                    <span class="stat-label">Rating</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${item.badges}</span>
                    <span class="stat-label">Badges</span>
                </div>
            `
        },
        geeksforgeeks: {
            title: "GeeksforGeeks",
            icon: "fa-laptop-code",
            class: "gfg",
            footerText: () => "Consistent Problem Solver via POTD",
            stats: (item) => `
                <div class="stat-box">
                    <span class="stat-value">${item.solved}</span>
                    <span class="stat-label">Solved</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${item.score}</span>
                    <span class="stat-label">Score</span>
                </div>
            `
        },
        code360: {
            title: "Code360",
            icon: "fa-user-ninja",
            class: "code360",
            footerText: () => "C++ Default Language | DSA Prep",
            stats: (item) => `
                <div class="stat-box">
                    <span class="stat-value">${item.solved}</span>
                    <span class="stat-label">Solved</span>
                </div>
            `
        },
        codeforces: {
            title: "Codeforces",
            icon: "fa-chart-bar",
            class: "codeforces",
            footerText: (item) => `Max Streak: ${item.max_streak} Days | Active Participant`,
            stats: (item) => `
                <div class="stat-box">
                    <span class="stat-value">${item.solved}</span>
                    <span class="stat-label">Solved</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${item.max_streak} <i class="fas fa-fire" style="color:#3b82f6;font-size:0.9rem;"></i></span>
                    <span class="stat-label">Streak</span>
                </div>
            `
        },
        codechef: {
            title: "CodeChef",
            icon: "fa-utensils",
            class: "codechef",
            footerText: (item) => `Global Rank: ${item.global_rank} | Country Rank: ${item.country_rank}`,
            stats: (item) => `
                <div class="stat-box">
                    <span class="stat-value">${item.rating}</span>
                    <span class="stat-label">Rating</span>
                </div>
                <div class="stat-box">
                    <span class="stat-value">${item.stars} <i class="fas fa-star" style="color:#a855f7;font-size:0.9rem;"></i></span>
                    <span class="stat-label">Stars</span>
                </div>
            `
        }
    };

    container.innerHTML = Object.entries(cp).map(([key, item]) => {
        const cfg = config[key];
        if (!cfg) return '';

        return `
            <div class="platform-card ${cfg.class}">
                <div class="platform-header">
                    <i class="fas ${cfg.icon}"></i>
                    <div class="platform-title-group">
                        <h3>${cfg.title}</h3>
                        <span class="rank-badge">${item.rank || item.platform || item.handle}</span>
                    </div>
                </div>
                <div class="platform-stats">
                    ${cfg.stats(item)}
                </div>
                <div class="platform-footer">
                    <p class="ask-me">${cfg.footerText(item)}</p>
                    <a href="${item.profile}" target="_blank" class="platform-btn">View Profile</a>
                </div>
            </div>
        `;
    }).join('');
}

function renderCertifications(data) {
    const container = document.getElementById('certifications-container');
    if (!container || !data.achievements?.certifications) return;

    container.innerHTML = data.achievements.certifications.map(cert => {
        let icon = "fa-award";
        const titleLower = cert.title.toLowerCase();
        const issuerLower = cert.issuer ? cert.issuer.toLowerCase() : '';

        if (titleLower.includes('hackathon') || titleLower.includes('challenge')) {
            icon = 'fa-trophy';
        } else if (titleLower.includes('postman') || issuerLower.includes('postman')) {
            icon = 'fa-rocket';
        } else if (titleLower.includes('aws') || issuerLower.includes('aws')) {
            icon = 'fab fa-aws';
        } else if (titleLower.includes('sql')) {
            icon = 'fa-database';
        } else if (titleLower.includes('neural') || titleLower.includes('google')) {
            icon = titleLower.includes('google') ? 'fab fa-google' : 'fa-brain';
        }

        const isStandout = titleLower.includes('hackathon') || titleLower.includes('postman') || titleLower.includes('aws');
        const standoutClass = isStandout ? ' standout' : '';

        return `
            <div class="mini-cert${standoutClass}">
                <i class="${icon}"></i>
                <div>
                    <h4>${cert.title}</h4>
                    <span>${cert.description || cert.issuer}${cert.date ? ` (${cert.date})` : ''}.</span>
                </div>
            </div>
        `;
    }).join('');
}
function renderContactSection(data) {
    const container = document.getElementById('contact-info-container');
    const form = document.getElementById('contactForm');

    if (container && data.contact) {
        let cardsHtml = '';
        if (data.contact.email) {
            cardsHtml += `
                <a href="mailto:${data.contact.email}" class="contact-card">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h4>Email</h4>
                        <span>${data.contact.email}</span>
                    </div>
                </a>
            `;
        }
        if (data.contact.linkedin) {
            const name = data.name || "Akshit Garg";
            cardsHtml += `
                <a href="${data.contact.linkedin}" target="_blank" class="contact-card">
                    <i class="fab fa-linkedin"></i>
                    <div>
                        <h4>LinkedIn</h4>
                        <span>${name}</span>
                    </div>
                </a>
            `;
        }
        if (data.location) {
            const shortLoc = data.location.replace(', Uttarakhand', '');
            cardsHtml += `
                <div class="contact-card">
                    <i class="fas fa-location-dot"></i>
                    <div>
                        <h4>Location</h4>
                        <span>${shortLoc}</span>
                    </div>
                </div>
            `;
        }
        container.innerHTML = cardsHtml;
    }

    if (form && data.formspree_url) {
        form.action = data.formspree_url;
    }
}

function updateTerminalCommands(data) {
    commands.whoami = () => `${data.name} | ${data.title}.`;
    
    commands.skills = () => {
        let skillsStr = '';
        if (data.skills.languages) skillsStr += `Languages: ${data.skills.languages.join(', ')}. \n`;
        if (data.skills.web_development) skillsStr += `Web: ${data.skills.web_development.join(', ')}. \n`;
        if (data.skills.machine_learning) skillsStr += `ML: ${data.skills.machine_learning.join(', ')}.`;
        return skillsStr;
    };

    commands.projects = () => {
        let projStr = "Recent Work: \n";
        projStr += data.projects.map((p, i) => `${i + 1}. ${p.title} (${p.category})`).join('\n');
        return projStr;
    };

    commands.contact = () => {
        let email = data.contact.email || "";
        let linkedinClean = data.contact.linkedin ? data.contact.linkedin.substring(data.contact.linkedin.indexOf('/in/')) : "";
        let githubClean = data.contact.github ? data.contact.github.substring(data.contact.github.indexOf('.com/') + 4) : "";
        return `Email: ${email} \nLinkedIn: ${linkedinClean} \nGitHub: ${githubClean}`;
    };
}

function showTerminalCorsWarning() {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    const lastLine = terminalOutput.querySelector('.last-line');
    const warningText = "System: Failed to load portfolio data dynamically. " +
                        "If you are opening index.html directly from your file system (file://), " +
                        "browser CORS restrictions block local JSON loads. " +
                        "Please run a local server (e.g. VS Code's Live Server or Python's HTTP server) " +
                        "to see dynamic updates from my_real_info.json. Traditional static fallback is active.";

    const warningLine = document.createElement('div');
    warningLine.className = 'terminal-line';
    warningLine.innerHTML = `<div class="t-output t-error" style="color: #ef4444; font-weight: bold; border-left: 2px solid #ef4444; padding-left: 8px; margin: 4px 0;">${warningText}</div>`;
    terminalOutput.insertBefore(warningLine, lastLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}