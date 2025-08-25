// Header JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize header functionality
    initializeHeader();
});

function initializeHeader() {
    // iOS Style Menu functionality
    let isMenuOpen = false;
    const iosMenuBtn = document.getElementById('iosMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const menuContainer = document.getElementById('menuContainer');

    // Haptic feedback function
    function triggerHapticFeedback() {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        document.body.classList.add('haptic-feedback');
        setTimeout(() => {
            document.body.classList.remove('haptic-feedback');
        }, 100);
    }

    // Open menu function
    function openMenu() {
        if (isMenuOpen) return;
        
        triggerHapticFeedback();
        isMenuOpen = true;
        sideMenu.classList.add('open');
        document.body.classList.add('menu-open');
        iosMenuBtn.classList.add('active');
        
        setTimeout(() => {
            sideMenu.style.pointerEvents = 'all';
        }, 50);
    }

    // Close menu function
    function closeMenu() {
        if (!isMenuOpen) return;
        
        triggerHapticFeedback();
        isMenuOpen = false;
        sideMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        iosMenuBtn.classList.remove('active');
        sideMenu.style.pointerEvents = 'none';
    }

    // Event listeners
    if (iosMenuBtn) {
        iosMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Menu item click handlers
    function setupMenuHandlers() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerHapticFeedback();
                
                // Add bubble animation
                item.classList.add('bubble-animation');
                setTimeout(() => {
                    item.classList.remove('bubble-animation');
                }, 400);
                
                // Get the href and navigate
                const href = item.getAttribute('href');
                if (href) {
                    // Close menu immediately
                    closeMenu();
                    
                    // Navigate after a short delay for haptic feedback
                    setTimeout(() => {
                        if (href.startsWith('#')) {
                            // Smooth scroll to section
                            const target = document.querySelector(href);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            // Navigate to page
                            window.location.href = href;
                        }
                    }, 200);
                }
            });
        });
    }

    // Setup menu handlers
    setupMenuHandlers();

    // Handle Escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Handle window resize to close menu on mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            closeMenu();
        }
    });

    // Set active navigation link based on current page
    setActiveNavigationLink();
}

// Function to set active navigation link
function setActiveNavigationLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Remove active class from all links
            link.classList.remove('text-pink-600', 'font-semibold');
            link.classList.add('text-gray-700');
            
            // Check if this link matches current page
            if (href.includes(currentPath) || 
                (currentPath === '/index.html' && href.includes('#home')) ||
                (currentPath === '/' && href.includes('#home'))) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-pink-600', 'font-semibold');
            }
        }
    });
}

// Function to load header dynamically
function loadHeader() {
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        fetch('/partials/header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                // Initialize header functionality after loading
                initializeHeader();
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }
}

// Export functions for use in other scripts
window.HeaderModule = {
    initializeHeader,
    setActiveNavigationLink,
    loadHeader
};
