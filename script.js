// ================================================
// IMPORT SUPABASE FUNCTIONS
// ================================================
import { getProjects, getAboutInfo, getSocialLinks, getThemeColors, getCategories } from './supabase.js';

// ===== ANIMATED STATISTICS COUNTER =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');
    
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count);
                    animateCounter(stat, target, 2000);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ===== DYNAMIC PROJECTS LOADER FROM SUPABASE =====
// Note: getProjects() is now imported from supabase.js

async function loadProjectsFromSupabase() {
    const projectsContainer = document.getElementById('projectsContainer');
    if (!projectsContainer) return;

    // Show loading state
    projectsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-muted);">Loading projects...</div>';

    try {
        // Get projects from Supabase (imported from supabase.js)
        const projects = await getProjects();
        
        if (!projects || projects.length === 0) {
            projectsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No projects found</div>';
            return;
        }

        // Sort by display order
        projects.sort((a, b) => a.displayOrder - b.displayOrder);

        // Generate HTML for projects
        projectsContainer.innerHTML = projects.map(project => {
            const techTags = project.technologies.split(',')
                .map(tech => `<span class="tag">${escapeHtml(tech.trim())}</span>`)
                .join('');
            
            const liveLink = project.liveUrl ? 
                `<a href="${project.liveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : '';
            
            return `
                <div class="project-card">
                    <div class="project-image" style="background: ${project.gradientColors};">
                        <i class="${project.iconClass}"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${escapeHtml(project.title)}</h3>
                        <p class="project-description">${escapeHtml(project.description)}</p>
                        <div class="project-tags">
                            ${techTags}
                        </div>
                        <div class="project-links">
                            <a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i> Code</a>
                            ${liveLink}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-muted);">Error loading projects. Please refresh the page.</div>';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProjectsFromSupabase(); // Changed from loadProjectsFromLocalStorage
    initializeThemeSwitcher();
    initializeProjectFilters();
    initializeStatsCounter();
    initializeAccessibility();
    trackVisitor();
});

// ===== THEME SWITCHER =====
function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolioTheme') || 'purple';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update active theme option
    themeOptions.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        }
    });
    
    // Toggle dropdown
    themeSwitcher.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        themeDropdown.classList.remove('show');
    });
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = option.dataset.theme;
            
            // Update theme
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolioTheme', theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Close dropdown
            themeDropdown.classList.remove('show');
        });
    });
}

// ===== PROJECT FILTER & SEARCH =====
let allProjects = [];
let currentFilter = 'all';

async function initializeProjectFilters() {
    const searchInput = document.getElementById('projectSearch');
    const filterTags = document.getElementById('filterTags');
    
    // Get all unique technologies from projects
    const projects = await getProjects();
    allProjects = projects;
    
    const technologies = new Set();
    projects.forEach(project => {
        project.technologies.split(',').forEach(tech => {
            technologies.add(tech.trim());
        });
    });
    
    // Add event listener to "All Projects" button
    const allProjectsBtn = document.querySelector('[data-filter="all"]');
    if (allProjectsBtn) {
        allProjectsBtn.addEventListener('click', () => filterByTechnology('all'));
    }
    
    // Create filter tags
    const sortedTechs = Array.from(technologies).sort();
    sortedTechs.forEach(tech => {
        const button = document.createElement('button');
        button.className = 'filter-tag';
        button.dataset.filter = tech;
        button.innerHTML = `<i class="fas fa-tag"></i> ${tech}`;
        button.addEventListener('click', () => filterByTechnology(tech));
        filterTags.appendChild(button);
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProjects(e.target.value, currentFilter);
        });
    }
    
    // Make project tags clickable
    setTimeout(() => {
        const projectTags = document.querySelectorAll('.tag');
        projectTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const tech = tag.textContent.trim();
                filterByTechnology(tech);
                
                // Scroll to filters
                document.querySelector('.project-controls').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }, 100);
}

function filterByTechnology(tech) {
    const searchInput = document.getElementById('projectSearch');
    currentFilter = tech;
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-tag');
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === tech || (tech === 'all' && btn.dataset.filter === 'all')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Clear search and filter
    if (searchInput) {
        searchInput.value = '';
    }
    filterProjects('', tech);
}

function filterProjects(searchTerm, filterTech) {
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    let visibleCount = 0;
    
    searchTerm = searchTerm.toLowerCase();
    
    projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.trim().toLowerCase());
        
        const matchesSearch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = filterTech === 'all' || tags.some(tag => tag === filterTech.toLowerCase());
        
        if (matchesSearch && matchesFilter) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = visibleCount;
    }
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// Smooth Scrolling for Navigation Links
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

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Scroll Animation for Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Project Cards Hover Effect Enhancement
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Active Navigation Link Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add typing effect to hero subtitle (optional)
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing effect after page loads
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Scroll to top button (optional enhancement)
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.classList.add('scroll-to-top');
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initializeAccessibility() {
    // Add ARIA labels
    document.querySelector('.navbar')?.setAttribute('aria-label', 'Main navigation');
    document.querySelector('.hero')?.setAttribute('aria-label', 'Hero section');
    document.querySelector('.search-input')?.setAttribute('aria-label', 'Search projects');
    
    // Keyboard navigation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Project ${index + 1}`);
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = card.querySelector('.project-link');
                if (link) link.click();
            }
        });
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#projects';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // High contrast mode toggle (Ctrl + Alt + H)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isHighContrast);
            announce(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
        }
    });
    
    // Load high contrast preference
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Screen reader announcements
    function announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
    
    // Announce filter changes
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tech = tag.dataset.filter;
            announce(`Filtered by ${tech === 'all' ? 'all projects' : tech}`);
        });
    });
}

// ===== PRIVACY-FRIENDLY ANALYTICS =====
function trackVisitor() {
    // Simple visitor counter (no personal data)
    let visits = parseInt(localStorage.getItem('portfolioVisits') || '0');
    visits++;
    localStorage.setItem('portfolioVisits', visits);
    localStorage.setItem('lastVisit', new Date().toISOString());
    
    // Track total unique visitors (global count)
    let totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
    if (!localStorage.getItem('hasVisited')) {
        totalVisitors++;
        localStorage.setItem('totalVisitors', totalVisitors);
        localStorage.setItem('hasVisited', 'true');
    }
}

// ===== ADMIN SETTINGS LOADER =====
// Load customizations from Supabase database

async function loadAdminSettings() {
    // Load theme colors
    await loadCustomThemeColors();
    
    // Load about info
    await loadAboutInfoFromStorage();
    
    // Load social links
    await loadSocialLinksFromStorage();
}

async function loadCustomThemeColors() {
    const themeColors = await getThemeColors(); // From supabase.js
    
    if (themeColors) {
        // Apply custom colors to current theme
        const root = document.documentElement;
        const currentTheme = document.body.dataset.theme || 'purple';
        
        // Override CSS custom properties
        root.style.setProperty('--primary-color', themeColors.primary);
        root.style.setProperty('--secondary-color', themeColors.secondary);
        root.style.setProperty('--accent-color', themeColors.accent);
    }
}

async function loadAboutInfoFromStorage() {
    const aboutInfo = await getAboutInfo(); // From supabase.js
    
    if (aboutInfo) {
        // Update hero tagline
        const tagline = document.getElementById('heroTagline');
        if (tagline && aboutInfo.tagline) {
            tagline.textContent = aboutInfo.tagline;
        }
        
        // Update about bio
        const bioText = document.getElementById('aboutBioText');
        if (bioText && aboutInfo.bio) {
            // Split bio into paragraphs if it contains line breaks
            const paragraphs = aboutInfo.bio.split('\n').filter(p => p.trim());
            bioText.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
        
        // Update contact email
        const emailElement = document.getElementById('contactEmail');
        if (emailElement && aboutInfo.email) {
            emailElement.textContent = aboutInfo.email;
        }
        
        // Update contact phone
        const phoneElement = document.getElementById('contactPhone');
        if (phoneElement && aboutInfo.phone) {
            phoneElement.textContent = aboutInfo.phone;
        }
    }
}

async function loadSocialLinksFromStorage() {
    const socialLinks = await getSocialLinks(); // From supabase.js
    
    if (socialLinks) {
        // Update GitHub link
        const githubLink = document.querySelector('[data-social="github"]');
        if (githubLink && socialLinks.github) {
            githubLink.href = socialLinks.github;
        }
        
        // Update Instagram link
        const instagramLink = document.querySelector('[data-social="instagram"]');
        if (instagramLink && socialLinks.instagram) {
            instagramLink.href = socialLinks.instagram;
            instagramLink.style.display = socialLinks.instagram ? 'inline-flex' : 'none';
        }
        
        // Update Steam link
        const steamLink = document.querySelector('[data-social="steam"]');
        if (steamLink && socialLinks.steam) {
            steamLink.href = socialLinks.steam;
            steamLink.style.display = socialLinks.steam ? 'inline-flex' : 'none';
        }
        
        // Update Discord - Discord uses usernames not URLs
        const discordLink = document.querySelector('[data-social="discord"]');
        if (discordLink && socialLinks.discord) {
            // For Discord, we can show the tag in the title
            discordLink.title = `Discord: ${socialLinks.discord}`;
        }
    }
}

// Load admin settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAdminSettings();
});

