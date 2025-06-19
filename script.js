// Wait for the entire page to load before running the script
window.onload = function() {
    // --- Welcome Screen Logic ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const homepage = document.getElementById('homepage');
    const body = document.body;

    if (welcomeScreen && enterBtn && homepage && body) {
        enterBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('fade-out');
            homepage.classList.add('visible', 'fade-in');
            body.style.overflow = 'auto';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 1000); 
        });
    } else {
        console.error("Welcome screen elements not found in the DOM.");
    }

    // --- Modal Logic ---
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalText = document.getElementById('modal-text');
    const phoneBtn = document.getElementById('phone-btn');
    const emailBtn = document.getElementById('email-btn');

    // Check if all modal elements exist
    if (contactModal && closeModalBtn && modalText && phoneBtn && emailBtn) {
        
        // Function to open the modal
        const openModal = (text) => {
            modalText.textContent = text;
            contactModal.classList.remove('hidden');
        };

        // Function to close the modal
        const closeModal = () => {
            contactModal.classList.add('hidden');
        };

        // Event listeners for the buttons
        phoneBtn.addEventListener('click', () => {
            openModal('(356) 79808585');
        });

        emailBtn.addEventListener('click', () => {
            openModal('isaacclaudec@gmail.com');
        });

        // Event listener for the close button
        closeModalBtn.addEventListener('click', closeModal);

        // Event listener to close the modal by clicking on the overlay
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                closeModal();
            }
        });

    } else {
        console.error("Modal elements not found in the DOM.");
    }
};
