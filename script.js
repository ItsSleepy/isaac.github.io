// Wait for the entire page to load before running the script
window.onload = function() {

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


    // --- Welcome Screen Logic (Only for index.html) ---
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        // If welcome screen exists, page is index.html. Keep scrolling locked.
        document.body.style.overflow = 'hidden';

        const enterBtn = document.getElementById('enter-btn');
        const homepage = document.getElementById('homepage');
        
        enterBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('fade-out');
            // Check for homepage element before trying to modify it
            if(homepage) {
                homepage.classList.add('visible', 'fade-in');
            }
            document.body.style.overflow = 'auto'; // Re-enable scrolling after enter
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 1000); 
        });
    } else {
        // If it's not the homepage (e.g., about.html), ensure scrolling is enabled from the start
        document.body.style.overflow = 'auto';
    }


    // --- Modal Logic ---
    const contactModal = document.getElementById('contact-modal');
    if(contactModal) {
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalText = document.getElementById('modal-text');
        const phoneBtn = document.getElementById('phone-btn');
        const emailBtn = document.getElementById('email-btn');

        const openModal = (text) => {
            modalText.textContent = text;
            contactModal.classList.remove('hidden');
        };

        const closeModal = () => {
            contactModal.classList.add('hidden');
        };
        
        if (phoneBtn && emailBtn && closeModalBtn) {
            phoneBtn.addEventListener('click', () => openModal('(356) 79808585'));
            emailBtn.addEventListener('click', () => openModal('isaacclaudec@gmail.com'));
            closeModalBtn.addEventListener('click', closeModal);
            contactModal.addEventListener('click', (event) => {
                if (event.target === contactModal) {
                    closeModal();
                }
            });
        }
    }
};
