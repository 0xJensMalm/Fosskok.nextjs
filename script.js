document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navItems = document.querySelectorAll('.nav-items');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-container');
    
    // Show the first section by default and hide others
    showSection('om');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navItems.forEach(item => {
                item.classList.toggle('active');
            });
            
            // Toggle social icons visibility on mobile
            const socialIcons = document.querySelector('.social-icons');
            if (socialIcons) {
                socialIcons.classList.toggle('active');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });
    
    // Section switching for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1); // Remove the # character
            showSection(targetId);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);
            
            // Update active link
            updateActiveLink(targetId);
        });
    });
    
    // Function to show a specific section and hide others
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    }
    
    // Function to update the active link in the navigation
    function updateActiveLink(sectionId) {
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === sectionId) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'om';
        showSection(hash);
        updateActiveLink(hash);
    });
    
    // Check URL hash on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        showSection(hash);
        updateActiveLink(hash);
    }
    
    // Future functionality placeholders
    
    // Gryta (Blog) functionality
    // This will be expanded when implementing the blog feature
    const blogContainer = document.querySelector('.blog-posts');
    
    // Folka (People) grid functionality
    // This will be expanded when implementing the people grid feature
    const peopleGrid = document.querySelector('.people-grid');
    
    // Example of how to dynamically add content (can be expanded later)
    function createBlogPost(title, author, date, excerpt, imageUrl) {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post fade-in';
        
        postElement.innerHTML = `
            <div class="blog-image">
                ${imageUrl ? `<img src="${imageUrl}" alt="${title}">` : ''}
            </div>
            <div class="blog-content">
                <h3>${title}</h3>
                <div class="blog-meta">
                    <span class="blog-author">${author}</span>
                    <span class="blog-date">${date}</span>
                </div>
                <p>${excerpt}</p>
                <a href="#" class="read-more">Les mer</a>
            </div>
        `;
        
        return postElement;
    }
    
    function createPersonCard(name, role, imageUrl, bio) {
        const personElement = document.createElement('div');
        personElement.className = 'person-card fade-in';
        
        personElement.innerHTML = `
            <div class="person-image">
                ${imageUrl ? `<img src="${imageUrl}" alt="${name}">` : ''}
            </div>
            <div class="person-details">
                <h3>${name}</h3>
                <p class="person-role">${role}</p>
                <p class="person-bio">${bio}</p>
            </div>
        `;
        
        return personElement;
    }
    
    // These functions can be used later when implementing the actual features
});
