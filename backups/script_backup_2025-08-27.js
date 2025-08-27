console.log('🚀 Script file loaded successfully!');

// Typing Animation Effect
function initializeTypingAnimation() {
    const typingText = document.getElementById('typing-text');
    const subtitleText = document.getElementById('subtitle-text');
    const cursor = document.getElementById('typing-cursor');
    
    if (!typingText || !subtitleText) return;
    
    const mainText = "Welcome to my digital space.";
    const subtitle = "Isaac Claude Camilleri - Student Developer";
    
    let mainIndex = 0;
    let subtitleIndex = 0;
    
    function typeMainText() {
        if (mainIndex < mainText.length) {
            typingText.textContent += mainText.charAt(mainIndex);
            mainIndex++;
            setTimeout(typeMainText, 80);
        } else {
            setTimeout(typeSubtitle, 500);
        }
    }
    
    function typeSubtitle() {
        cursor.style.display = 'none';
        if (subtitleIndex < subtitle.length) {
            subtitleText.textContent += subtitle.charAt(subtitleIndex);
            subtitleIndex++;
            setTimeout(typeSubtitle, 60);
        }
    }
    
    // Start typing animation
    setTimeout(typeMainText, 1000);
}

// Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercentage + '%';
        
        // Hide progress bar when at top
        if (scrollPercentage < 1) {
            progressBar.style.opacity = '0';
        } else {
            progressBar.style.opacity = '1';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call
}

// Particle Background System
function initializeParticles() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const homepage = document.getElementById('homepage');
    
    function createParticles(container, count = 50) {
        if (!container) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        container.appendChild(particlesContainer);
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    createParticles(welcomeScreen, 30);
    createParticles(homepage, 20);
}

// Interactive Skills Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkill = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width + '%';
                observer.unobserve(progressBar);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateSkill, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Enhanced Page Transitions
function initializePageTransitions() {
    const observeElements = document.querySelectorAll('.slide-in, .fade-in');
    
    const slideInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    observeElements.forEach(el => slideInObserver.observe(el));
}

// Enhanced Contact Functionality
function initializeContactFeatures() {
    const phoneBtn = document.getElementById('phone-btn');
    const emailBtn = document.getElementById('email-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    
    // Contact information
    const contactInfo = {
        phone: '+356 7943 5679',
        email: 'isaac.camilleri.05@um.edu.mt'
    };
    
    function showCopyFeedback() {
        copyFeedback.classList.remove('hidden');
        setTimeout(() => {
            copyFeedback.classList.add('hidden');
        }, 2000);
    }
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const textSpan = button.querySelector('.contact-text');
            const copyIcon = button.querySelector('.copy-icon');
            
            textSpan.textContent = 'Copied!';
            copyIcon.classList.remove('hidden');
            showCopyFeedback();
            
            setTimeout(() => {
                if (button === phoneBtn) textSpan.textContent = 'View Phone';
                if (button === emailBtn) textSpan.textContent = 'View Email';
                copyIcon.classList.add('hidden');
            }, 2000);
        });
    }
    
    phoneBtn?.addEventListener('click', () => copyToClipboard(contactInfo.phone, phoneBtn));
    emailBtn?.addEventListener('click', () => copyToClipboard(contactInfo.email, emailBtn));
}

// Enhanced Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = submitBtn?.querySelector('.submit-text');
    
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `mb-4 p-3 rounded-md text-center ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        formStatus.classList.remove('hidden');
    }
    
    function validateField(field, errorSpan) {
        if (!field.value.trim()) {
            errorSpan.textContent = 'This field is required';
            errorSpan.classList.remove('hidden');
            field.classList.add('border-red-500');
            return false;
        }
        
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
            errorSpan.textContent = 'Please enter a valid email';
            errorSpan.classList.remove('hidden');
            field.classList.add('border-red-500');
            return false;
        }
        
        errorSpan.classList.add('hidden');
        field.classList.remove('border-red-500');
        return true;
    }
    
    // Real-time validation
    const fields = form?.querySelectorAll('input, textarea');
    fields?.forEach(field => {
        field.addEventListener('input', () => {
            const errorSpan = field.parentElement.querySelector('.error-message');
            validateField(field, errorSpan);
        });
    });
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        fields.forEach(field => {
            const errorSpan = field.parentElement.querySelector('.error-message');
            if (!validateField(field, errorSpan)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Simulate form submission
        submitText.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            submitText.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Easter Egg - Konami Code
function initializeEasterEggs() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.code);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (JSON.stringify(userInput) === JSON.stringify(konamiCode)) {
            triggerEasterEgg();
            userInput = [];
        }
    });
    
    function triggerEasterEgg() {
        // Create rainbow effect
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Show easter egg message
        const message = document.createElement('div');
        message.innerHTML = '🎉 Konami Code Activated! 🎉<br>You found the secret!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
            padding: 20px;
            border-radius: 15px;
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: bounce 0.5s ease-in-out infinite alternate;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
            document.body.style.animation = '';
        }, 4000);
    }
}

// Enhanced Visitor Counter with Real Analytics
function initializeVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    if (!visitorCountElement) return;
    
    // Generate unique visitor ID
    let visitorId = localStorage.getItem('portfolioVisitorId');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('portfolioVisitorId', visitorId);
    }
    
    // Track session
    const sessionKey = 'portfolioSession_' + new Date().toDateString();
    let sessionCount = parseInt(localStorage.getItem(sessionKey) || '0');
    
    // Get all unique visitor sessions ever recorded
    const allSessions = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('portfolioSession_')) {
            allSessions.push(key);
        }
    }
    
    // If this is first visit today, increment
    if (sessionCount === 0) {
        sessionCount = 1;
        localStorage.setItem(sessionKey, sessionCount.toString());
        
        // Get global counter
        let globalCount = parseInt(localStorage.getItem('portfolioGlobalCount') || '0');
        globalCount++;
        localStorage.setItem('portfolioGlobalCount', globalCount.toString());
        
        // Use the global count as base + unique sessions
        const totalVisitors = Math.max(globalCount, allSessions.length);
        
        // Animate counter
        animateCounter(visitorCountElement, totalVisitors);
        
        // Track in analytics if available
        trackVisitorAnalytics(visitorId, totalVisitors);
    } else {
        // Return visitor - show existing count
        const globalCount = parseInt(localStorage.getItem('portfolioGlobalCount') || allSessions.length);
        animateCounter(visitorCountElement, globalCount);
    }
    
    // Clean old sessions (older than 30 days)
    cleanOldSessions();
}

function trackVisitorAnalytics(visitorId, count) {
    // Simple analytics tracking
    const analyticsData = {
        visitorId: visitorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        count: count,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language
    };
    
    // Store analytics locally (in real implementation, you'd send to server)
    const analytics = JSON.parse(localStorage.getItem('portfolioAnalytics') || '[]');
    analytics.push(analyticsData);
    
    // Keep only last 100 entries
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('portfolioAnalytics', JSON.stringify(analytics));
    console.log('📊 Visitor tracked:', analyticsData);
}

function cleanOldSessions() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('portfolioSession_')) {
            const dateStr = key.replace('portfolioSession_', '');
            const sessionDate = new Date(dateStr);
            
            if (sessionDate < thirtyDaysAgo) {
                localStorage.removeItem(key);
            }
        }
    }
}

// Counter Animation
function animateCounter(element, targetValue) {
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            element.textContent = targetValue.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString();
        }
    }, 30);
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Track performance for future optimization
            if (loadTime > 3000) {
                console.warn('Page load time is above 3 seconds. Consider optimization.');
            }
        }
    });
    
    // Monitor resource loading
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 1000) {
                    console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
                }
            }
        });
        observer.observe({ entryTypes: ['resource'] });
    }
}

// Keyboard Navigation and Accessibility
function initializeKeyboardNavigation() {
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
            openModals.forEach(modal => modal.classList.add('hidden'));
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse click
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Focus management for tech cards
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${card.querySelector('h3').textContent}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Enhanced skip navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-white px-4 py-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ARIA Live Regions for Screen Readers
function initializeAriaLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Function to announce messages
    window.announceToScreenReader = (message) => {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
    
    // Announce theme changes
    const themeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTimeout(() => {
                announceToScreenReader(`Switched to ${newTheme} theme`);
            }, 100);
        });
    });
}

// Service Worker Registration for PWA
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New update available
                                    showUpdateNotification();
                                }
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div class="fixed bottom-4 right-4 bg-cyan-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold">Update Available!</p>
                    <p class="text-sm opacity-90">A new version is ready.</p>
                </div>
                <button onclick="window.location.reload()" class="ml-4 bg-white text-cyan-500 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100">
                    Refresh
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// --- Reusable Mobile Menu Logic ---
const setupMobileMenu = (menuButtonId, mobileMenuId, closeMenuButtonId) => {
        const menuButton = document.getElementById(menuButtonId);
        const mobileMenu = document.getElementById(mobileMenuId);
        const closeMenuButton = document.getElementById(closeMenuButtonId);
        
        if (!menuButton || !mobileMenu || !closeMenuButton) {
            // If any of the menu elements don't exist on the page, stop this function.
            return;
        }

        const menuLinks = mobileMenu.querySelectorAll('a');

        // Function to open the menu
        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        };
        
        // Function to close the menu
        const closeMenu = () => {
            mobileMenu.classList.add('hidden');
            // Only re-enable scrolling if the main welcome screen isn't active
            const welcomeScreen = document.getElementById('welcome-screen');
            if (!welcomeScreen || welcomeScreen.style.display === 'none') {
                 document.body.style.overflow = 'auto';
            }
        };

        menuButton.addEventListener('click', openMenu);
        closeMenuButton.addEventListener('click', closeMenu);

        // Add event listeners to each link inside the mobile menu to close it on navigation
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    };

    // Setup menu for index.html
    setupMobileMenu('mobile-menu-button', 'mobile-menu', 'close-mobile-menu-button');
    // Setup menu for about.html
    setupMobileMenu('mobile-menu-button-about', 'mobile-menu-about', 'close-mobile-menu-button-about');

    // --- Tech Stack Modal Logic ---
    const techCards = document.querySelectorAll('.tech-card');
    const techModal = document.getElementById('tech-modal');
    const closeTechModalBtn = document.getElementById('close-tech-modal-btn');

    if (techModal && closeTechModalBtn && techCards.length > 0) {
        const techModalTitle = document.getElementById('tech-modal-title');
        const techModalSubtitle = document.getElementById('tech-modal-subtitle');
        const techModalIcon = document.getElementById('tech-modal-icon');
        const techModalContent = document.getElementById('tech-modal-content');
        const techSkillBar = document.getElementById('tech-skill-bar');
        const techSkillPercentage = document.getElementById('tech-skill-percentage');
        const techModalExperience = document.getElementById('tech-modal-experience');

        // Tech stack data
        const techData = {
            html5: {
                title: 'HTML5',
                subtitle: 'Markup Language',
                icon: 'fab fa-html5 text-orange-500',
                content: 'HTML5 is the latest evolution of the standard that defines HTML. It includes new semantic elements, form controls, multimedia elements, and APIs for creating more interactive web applications.',
                skillLevel: 90,
                experience: 'Advanced - 3+ years of experience building semantic, accessible web structures.'
            },
            css3: {
                title: 'CSS3',
                subtitle: 'Styling Language',
                icon: 'fab fa-css3-alt text-blue-500',
                content: 'CSS3 brings new features like animations, transitions, gradients, and flexbox/grid layouts. Essential for creating responsive and visually appealing web designs.',
                skillLevel: 85,
                experience: 'Advanced - Proficient in modern CSS features including Grid, Flexbox, and animations.'
            },
            javascript: {
                title: 'JavaScript',
                subtitle: 'Programming Language',
                icon: 'fab fa-js-square text-yellow-400',
                content: 'JavaScript is a versatile programming language that powers interactive web applications. From DOM manipulation to complex frameworks, it\'s essential for modern web development.',
                skillLevel: 80,
                experience: 'Intermediate-Advanced - Strong foundation in ES6+, DOM manipulation, and async programming.'
            },
            php: {
                title: 'PHP',
                subtitle: 'Server-Side Language',
                icon: 'fab fa-php text-indigo-400',
                content: 'PHP is a server-side scripting language designed for web development. Great for building dynamic websites and web applications with database integration.',
                skillLevel: 75,
                experience: 'Intermediate - Experience with MVC patterns, database integration, and API development.'
            },
            react: {
                title: 'React',
                subtitle: 'JavaScript Library',
                icon: 'fab fa-react text-cyan-400',
                content: 'React is a JavaScript library for building user interfaces. It uses component-based architecture and virtual DOM for efficient, maintainable applications.',
                skillLevel: 70,
                experience: 'Intermediate - Familiar with hooks, state management, and component lifecycle.'
            },
            nodejs: {
                title: 'Node.js',
                subtitle: 'JavaScript Runtime',
                icon: 'fab fa-node-js text-green-400',
                content: 'Node.js allows JavaScript to run on the server-side. Perfect for building scalable network applications and APIs.',
                skillLevel: 65,
                experience: 'Intermediate - Experience with Express.js, NPM, and building REST APIs.'
            },
            python: {
                title: 'Python',
                subtitle: 'Programming Language',
                icon: 'fab fa-python text-blue-400',
                content: 'Python is a versatile, high-level programming language known for its readability and extensive libraries. Great for web development, data analysis, and automation.',
                skillLevel: 85,
                experience: 'Advanced - Strong experience in web development, scripting, and data manipulation.'
            },
            java: {
                title: 'Java',
                subtitle: 'Programming Language',
                icon: 'fab fa-java text-red-500',
                content: 'Java is a robust, object-oriented programming language. Platform-independent and widely used for enterprise applications and Android development.',
                skillLevel: 70,
                experience: 'Intermediate - Solid understanding of OOP concepts and application development.'
            },
            sql: {
                title: 'SQL',
                subtitle: 'Database Language',
                icon: 'fas fa-database text-gray-400',
                content: 'SQL (Structured Query Language) is used for managing and querying relational databases. Essential for data storage and retrieval in applications.',
                skillLevel: 75,
                experience: 'Intermediate - Experience with complex queries, joins, and database design.'
            },
            csharp: {
                title: 'C#',
                subtitle: 'Programming Language',
                icon: 'fas fa-file-code text-purple-400',
                content: 'C# is a modern, object-oriented programming language developed by Microsoft. Used for desktop applications, web development, and game development.',
                skillLevel: 60,
                experience: 'Beginner-Intermediate - Learning .NET framework and desktop application development.'
            },
            c: {
                title: 'C',
                subtitle: 'Programming Language',
                icon: 'fas fa-file-code text-gray-500',
                content: 'C is a foundational programming language that provides low-level access to memory. Essential for system programming and understanding computer fundamentals.',
                skillLevel: 55,
                experience: 'Beginner-Intermediate - Understanding of memory management and system programming.'
            },
            lua: {
                title: 'Lua',
                subtitle: 'Scripting Language',
                icon: 'fas fa-file-code text-indigo-600',
                content: 'Lua is a lightweight, embeddable scripting language. Often used in game development and as a configuration language.',
                skillLevel: 50,
                experience: 'Beginner - Basic scripting and automation tasks.'
            },
            kotlin: {
                title: 'Kotlin',
                subtitle: 'Programming Language',
                icon: 'fas fa-file-code text-purple-600',
                content: 'Kotlin is a modern programming language that runs on the JVM. Fully interoperable with Java and preferred for Android development.',
                skillLevel: 45,
                experience: 'Beginner - Learning mobile development and modern language features.'
            },
            ionic: {
                title: 'Ionic',
                subtitle: 'Mobile Framework',
                icon: 'fas fa-bolt text-yellow-500',
                content: 'Ionic is a framework for building cross-platform mobile applications using web technologies like HTML, CSS, and JavaScript.',
                skillLevel: 40,
                experience: 'Beginner - Exploring mobile app development with web technologies.'
            }
        };

        techCards.forEach(card => {
            card.addEventListener('click', () => {
                const techKey = card.getAttribute('data-tech');
                const tech = techData[techKey];

                if (tech) {
                    techModalTitle.textContent = tech.title;
                    techModalSubtitle.textContent = tech.subtitle;
                    techModalIcon.className = tech.icon;
                    techModalContent.textContent = tech.content;
                    techSkillBar.style.width = tech.skillLevel + '%';
                    techSkillPercentage.textContent = tech.skillLevel + '%';
                    techModalExperience.textContent = tech.experience;

                    techModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        closeTechModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            techModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        // Enhanced close modal when clicking outside or pressing escape
        techModal.addEventListener('click', (e) => {
            if (e.target === techModal) {
                techModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !techModal.classList.contains('hidden')) {
                techModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Contact Modal Logic ---
    const phoneBtn = document.getElementById('phone-btn');
    const emailBtn = document.getElementById('email-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');

    if (phoneBtn && emailBtn && contactModal && closeModalBtn) {
        phoneBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Phone Number';
            modalText.textContent = '+356 9999 9999'; // Replace with actual number
            contactModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        emailBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Email Address';
            modalText.textContent = 'isaac@example.com'; // Replace with actual email
            contactModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        closeModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Back to Top Button Logic ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Thank you for your message! Your email client should open now. If not, please contact me directly.');
            
            // Reset form
            contactForm.reset();
        });
    }

// ==================== NEW ENHANCED FEATURES ====================

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    
    // Auto-detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        const color = theme === 'dark' ? 'text-yellow-400' : 'text-purple-400';
        
        if (themeIcon) {
            themeIcon.className = `fas ${icon} text-lg`;
            themeToggle.className = themeToggle.className.replace(/text-\w+-\d+/, color);
        }
        if (themeIconMobile) {
            themeIconMobile.className = `fas ${icon} text-lg`;
            themeToggleMobile.className = themeToggleMobile.className.replace(/text-\w+-\d+/, color);
        }
    }
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
}

// Loading Screen
// Scroll Progress Bar
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        });
    }
}

// Particle Background
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// Fade-in Animations
function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter Animations
function initializeCounters() {
    const counters = {
        'projects-count': { target: 8, suffix: '+' },
        'skills-count': { target: 14, suffix: '+' },
        'years-count': { target: 3, suffix: '+' },
        'commits-count': { target: 250, suffix: '+' }
    };
    
    Object.keys(counters).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            animateCounter(element, counters[id].target, counters[id].suffix);
        }
    });
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 20);
}

// Simple Welcome Screen (Original Style)
function initializeWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const quickPreview = document.getElementById('quick-preview');
    
    if (welcomeScreen) {
        // Lock scrolling while welcome screen is active
        document.body.style.overflow = 'hidden';
        
        // Enter button - hide welcome screen and show main content
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                welcomeScreen.style.opacity = '0';
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            });
        }
        
        // Quick preview button - jump to projects section
        if (quickPreview) {
            quickPreview.addEventListener('click', () => {
                welcomeScreen.style.opacity = '0';
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    const projectsSection = document.getElementById('projects');
                    if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            });
        }
    }
}

// Enhanced Back to Top with Progress Circle
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Add progress circle
        backToTopBtn.innerHTML = `
            <svg class="progress-ring" width="44" height="44">
                <circle class="progress-ring-circle" stroke="currentColor" stroke-width="2" fill="transparent" r="20" cx="22" cy="22"/>
            </svg>
            <i class="fas fa-arrow-up text-lg absolute"></i>
        `;
        
        const circle = backToTopBtn.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
            const offset = circumference - (scrolled * circumference);
            circle.style.strokeDashoffset = offset;
            
            if (window.scrollY > 100) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });
    }
}

// Discord username copy function
function copyDiscordHandle() {
    const discordUsername = 'itssleepyhead';
    copyToClipboard(discordUsername, 'Discord username copied to clipboard!', 'fab fa-discord');
}

// Spotify username copy function
function copySpotifyHandle() {
    const spotifyUsername = 'Isaac';
    copyToClipboard(spotifyUsername, 'Spotify username copied to clipboard!', 'fab fa-spotify');
}

// Generic copy to clipboard function
function copyToClipboard(text, message, iconClass) {
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification(message, iconClass);
        }).catch(() => {
            fallbackCopyToClipboard(text, message, iconClass);
        });
    } else {
        fallbackCopyToClipboard(text, message, iconClass);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text, message, iconClass) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(message, iconClass);
    } catch (err) {
        showCopyNotification('Could not copy. Username: ' + text, iconClass);
    }
    
    document.body.removeChild(textArea);
}

// Show copy notification
function showCopyNotification(message, iconClass = 'fab fa-discord') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Determine background color based on icon
    let bgColor = 'bg-indigo-500'; // Default Discord color
    if (iconClass.includes('spotify')) {
        bgColor = 'bg-green-500';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `copy-notification fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="${iconClass}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize copy to clipboard functionality
function initializeCopyToClipboard() {
    // The copy functions are already defined above and called directly from HTML
    console.log('✅ Copy to clipboard functionality initialized');
}

// CV Button functionality
function initializeCVButtons() {
    const downloadCVBtn = document.getElementById('download-cv-btn');
    const viewCVBtn = document.getElementById('view-cv-btn');
    
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', () => {
            // Check if CV.pdf exists in documents folder
            const cvPath = 'documents/CV.pdf';
            
            // Create a temporary link to download the CV
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'Isaac_Camilleri_CV.pdf';
            link.target = '_blank';
            
            // Try to download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show notification
            showCopyNotification('CV download started! Check your downloads folder.', 'fas fa-download');
        });
    }
    
    if (viewCVBtn) {
        viewCVBtn.addEventListener('click', () => {
            // Open CV in new tab for viewing
            const cvPath = 'documents/CV.pdf';
            window.open(cvPath, '_blank');
            
            // Show notification
            showCopyNotification('Opening CV in new tab...', 'fas fa-external-link-alt');
        });
    }
}

// Mobile-specific optimizations
function initializeMobileOptimizations() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouchDevice) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Optimize touch interactions
        initializeTouchOptimizations();
        
        // Improve mobile navigation
        initializeMobileNavigation();
        
        // Optimize forms for mobile
        initializeMobileFormOptimizations();
        
        // Handle mobile orientation changes
        initializeOrientationHandling();
        
        // Reduce particle count for better performance
        reduceMobileAnimations();
    }
    
    // Initialize responsive image loading
    initializeResponsiveImages();
    
    // Setup viewport-based optimizations
    setupViewportOptimizations();
}

function initializeTouchOptimizations() {
    // Improve touch feedback for buttons (excluding critical functionality buttons)
    const touchElements = document.querySelectorAll('.tech-card, .skill-card, a[href]:not([href^="#"]), .contact-form button');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.8';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.opacity = '';
        }, { passive: true });
    });
    
    // Separately handle theme toggle buttons with non-passive events
    const themeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    themeButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
            this.style.transform = '';
        });
    });
    
    // Separately handle modal close buttons with non-passive events
    const modalCloseButtons = document.querySelectorAll('#close-tech-modal-btn, #close-modal-btn, [id*="close"]');
    modalCloseButtons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
            this.style.transform = '';
        });
    });
}

function initializeMobileNavigation() {
    // Improve mobile menu closing
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // Close mobile menu on scroll
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            isScrolling = true;
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                isScrolling = false;
            }, 100);
        }
    }, { passive: true });
}

function initializeMobileFormOptimizations() {
    // Optimize form inputs for mobile
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Prevent zoom on focus for iOS
        if (input.type === 'email' || input.type === 'tel' || input.type === 'text') {
            input.style.fontSize = '16px';
        }
        
        // Add mobile-friendly attributes
        if (input.type === 'email') {
            input.setAttribute('autocomplete', 'email');
            input.setAttribute('inputmode', 'email');
        }
        
        if (input.type === 'tel') {
            input.setAttribute('autocomplete', 'tel');
            input.setAttribute('inputmode', 'tel');
        }
        
        if (input.name && input.name.includes('name')) {
            input.setAttribute('autocomplete', 'name');
        }
    });
}

function initializeOrientationHandling() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Recalculate layouts after orientation change
        setTimeout(() => {
            // Trigger resize event to recalculate animations
            window.dispatchEvent(new Event('resize'));
            
            // Recalculate particle positions if particles exist
            const particles = document.querySelectorAll('.particle');
            if (particles.length > 0) {
                initializeParticles();
            }
        }, 100);
    });
}

function reduceMobileAnimations() {
    // Reduce particle count on mobile
    const particleContainer = document.querySelector('.particle-container');
    if (particleContainer) {
        const particles = particleContainer.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) { // Keep only every other particle
                particle.remove();
            }
        });
    }
    
    // Disable complex hover animations on mobile
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    });
}

function initializeResponsiveImages() {
    // Lazy load images on mobile
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
}

function setupViewportOptimizations() {
    // Optimize based on viewport size
    function optimizeForViewport() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Adjust animations based on viewport
        if (width < 768) {
            // Mobile optimizations
            document.body.classList.add('mobile-viewport');
            
            // Reduce scroll progress bar height
            const scrollProgress = document.querySelector('.scroll-progress');
            if (scrollProgress) {
                scrollProgress.style.height = '2px';
            }
            
            // Simplify typing animation
            const typingElements = document.querySelectorAll('.typing-animation');
            typingElements.forEach(el => {
                el.style.animationDuration = '2s'; // Faster on mobile
            });
        } else {
            document.body.classList.remove('mobile-viewport');
        }
        
        // Handle landscape mobile specifically
        if (width < 768 && width > height) {
            document.body.classList.add('mobile-landscape');
        } else {
            document.body.classList.remove('mobile-landscape');
        }
    }
    
    // Run on load and resize
    optimizeForViewport();
    window.addEventListener('resize', optimizeForViewport, { passive: true });
}

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initializeTheme();
    initializeWelcomeScreen();
    
    // New enhanced features
    initializeTypingAnimation();
    initializeScrollProgress();
    initializeParticles();
    initializeSkillBars();
    initializePageTransitions();
    
    // Contact and interaction features
    initializeContactFeatures();
    initializeContactForm();
    initializeEasterEggs();
    
    // Analytics and performance
    initializeVisitorCounter();
    initializePerformanceMonitoring();
    
    // Accessibility features
    initializeKeyboardNavigation();
    initializeAriaLiveRegions();
    
    // PWA functionality
    initializeServiceWorker();
    
    // Mobile optimizations
    initializeMobileOptimizations();
    
    // Existing functionality
    initializeAnimations();
    initializeCopyToClipboard();
    initializeCounters();
    initializeBackToTop();
    initializeCVButtons();
});
