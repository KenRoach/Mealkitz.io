document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser_mealkitz'));

    // Adjust paths based on where this script is relative to the HTML files
    // Assuming HTML files are at root, or one level down and js/ is at root.
    // This might need more sophisticated path handling for complex structures.
    const basePath = (window.location.pathname.split('/').length - 2) > 0 ? '../' : './';
    const loginPageUrl = basePath + 'iniciar.html';
    const profilePageUrl = basePath + 'perfil.html';

    const profileImageLogo = document.getElementById('profileImageLogo');
    const defaultProfileIcon = document.getElementById('defaultProfileIcon');
    const profileDropdownName = document.getElementById('profileDropdownName');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');

    if (!profileDropdownMenu) {
        // console.warn('auth-navbar.js: Profile dropdown menu not found on this page.');
        return; 
    }

    // Attempt to find links regardless of current href, then set them.
    let viewProfileLink = profileDropdownMenu.querySelector('a[href*="perfil.html"], li:first-child a'); 
    let loginOrLogoutLink = profileDropdownMenu.querySelector('a[href*="iniciar.html"], li:last-child a');

    if (!viewProfileLink && profileDropdownMenu.children.length > 0) {
        viewProfileLink = profileDropdownMenu.children[0].querySelector('a');
    }
    if (!loginOrLogoutLink && profileDropdownMenu.children.length > 1) {
        loginOrLogoutLink = profileDropdownMenu.children[1].querySelector('a');
    }
    
    if (currentUser) {
        // User IS logged in
        let mealkitzConfig = {};
        try {
            const storedConfig = localStorage.getItem('mealkitzConfig');
            if (storedConfig) {
                mealkitzConfig = JSON.parse(storedConfig);
            } else {
                mealkitzConfig = { business: {} };
            }
        } catch (e) {
            console.error('auth-navbar.js: Error loading/parsing mealkitzConfig:', e);
            mealkitzConfig = { business: {} };
        }
        mealkitzConfig.business = mealkitzConfig.business || {};

        if (profileImageLogo && defaultProfileIcon) {
            if (mealkitzConfig.business.logoUrl) {
                profileImageLogo.src = mealkitzConfig.business.logoUrl;
                profileImageLogo.alt = (mealkitzConfig.business.name || "Profile") + " Logo";
                profileImageLogo.style.display = 'inline';
                defaultProfileIcon.style.display = 'none';
            } else {
                profileImageLogo.style.display = 'none';
                defaultProfileIcon.style.display = 'inline';
            }
        }

        if (profileDropdownName) {
            profileDropdownName.textContent = currentUser.name || 'Usuario';
        }

        if (viewProfileLink) {
            viewProfileLink.textContent = 'Ver Perfil';
            viewProfileLink.href = profilePageUrl;
        }

        if (loginOrLogoutLink) {
            loginOrLogoutLink.textContent = 'Cerrar Sesión';
            loginOrLogoutLink.href = '#'; // Important for click listener
            
            // Clone and replace to remove old listeners
            const newLogoutLink = loginOrLogoutLink.cloneNode(true);
            loginOrLogoutLink.parentNode.replaceChild(newLogoutLink, loginOrLogoutLink);
            
            newLogoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser_mealkitz');
                // Optionally, remove other user-specific data from localStorage
                // localStorage.removeItem('mealkitzConfig'); // If config is user-specific
                alert('Has cerrado sesión.');
                window.location.href = loginPageUrl;
            });
        }

    } else {
        // User IS NOT logged in
        if (profileImageLogo && defaultProfileIcon) {
            profileImageLogo.style.display = 'none';
            defaultProfileIcon.style.display = 'inline';
        }

        if (profileDropdownName) {
            profileDropdownName.textContent = 'Perfil';
        }

        if (viewProfileLink) {
            // This link could be 'Crear Cuenta' or 'Registrarse'
            // For now, let's assume it's 'Crear Perfil' which might lead to a page that includes login/signup
            viewProfileLink.textContent = 'Crear Perfil'; 
            viewProfileLink.href = profilePageUrl; // Or a dedicated signup page
        }
        if (loginOrLogoutLink) {
            loginOrLogoutLink.textContent = 'Iniciar Sesión';
            loginOrLogoutLink.href = loginPageUrl;
            // Clone and replace to remove potential old (logout) listeners
            const newLoginLink = loginOrLogoutLink.cloneNode(true);
            loginOrLogoutLink.parentNode.replaceChild(newLoginLink, loginOrLogoutLink);
        }
    }
}); 