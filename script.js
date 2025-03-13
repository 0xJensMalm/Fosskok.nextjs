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
            
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                mobileMenuToggle.classList.remove('active');
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
    
    // Load data from JSON files
    loadPeopleData();
    loadBlogData();
    
    // Function to load people data from JSON
    function loadPeopleData() {
        fetch('data/people.json')
            .then(response => response.json())
            .then(data => {
                const peopleGrid = document.querySelector('.people-grid');
                if (peopleGrid) {
                    // Clear existing content
                    peopleGrid.innerHTML = '';
                    
                    // Add each person
                    data.forEach(person => {
                        const personCard = createPersonCard(person);
                        peopleGrid.appendChild(personCard);
                    });
                }
            })
            .catch(error => console.error('Error loading people data:', error));
    }
    
    // Function to load blog data from JSON
    function loadBlogData() {
        fetch('data/blog.json')
            .then(response => response.json())
            .then(data => {
                const blogPosts = document.querySelector('.blog-posts');
                if (blogPosts) {
                    // Clear existing content
                    blogPosts.innerHTML = '';
                    
                    // Add each blog post
                    data.forEach(post => {
                        const blogPost = createBlogPost(post);
                        blogPosts.appendChild(blogPost);
                    });
                }
            })
            .catch(error => console.error('Error loading blog data:', error));
    }
    
    // Function to create a person card (reverted to original design)
    function createPersonCard(person) {
        const personElement = document.createElement('div');
        personElement.className = 'person-card';
        
        // Check if image exists, otherwise use placeholder
        const imageHtml = person.image ? 
            `<img src="${person.image}" alt="${person.name}" onerror="this.src='images/people/placeholder.png'">` : 
            `<div class="image-placeholder person-placeholder"><div class="placeholder-text">Foto</div></div>`;
        
        personElement.innerHTML = `
            <div class="person-image">
                ${imageHtml}
            </div>
            <div class="person-details">
                <h3>${person.name}</h3>
                <p class="person-role">${person.role}</p>
                <p class="person-bio">${person.bio}</p>
            </div>
        `;
        
        return personElement;
    }
    
    // Function to create a blog post
    function createBlogPost(post) {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post fade-in';
        
        // Check if image exists, otherwise use placeholder
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="${post.title}">` : 
            `<div class="image-placeholder blog-placeholder"><div class="placeholder-text">Bilde</div></div>`;
        
        postElement.innerHTML = `
            <div class="blog-image">
                ${imageHtml}
            </div>
            <div class="blog-content">
                <h3>${post.title}</h3>
                <div class="blog-meta">
                    <span class="blog-author">${post.author}</span>
                    <span class="blog-date">${post.displayDate}</span>
                </div>
                <p>${post.excerpt}</p>
                <a href="#gryta/${post.id}" class="read-more">Les mer</a>
            </div>
        `;
        
        return postElement;
    }
    
    // Image upload preview functionality
    const imageInputs = document.querySelectorAll('.image-upload');
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                const preview = this.nextElementSibling;
                
                reader.addEventListener('load', function() {
                    preview.innerHTML = `<img src="${this.result}" alt="Preview">`;
                });
                
                reader.readAsDataURL(file);
            }
        });
    });

    // Function to show admin modal
    function showAdminModal(title, message, redirectUrl) {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'admin-modal-container';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'admin-modal-content fade-in';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'admin-modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'admin-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);
        
        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'admin-modal-body';
        
        const modalMessage = document.createElement('p');
        modalMessage.textContent = message;
        
        modalBody.appendChild(modalMessage);
        
        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'admin-modal-footer';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'admin-modal-btn admin-modal-cancel';
        cancelBtn.textContent = 'Avbryt';
        cancelBtn.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'admin-modal-btn admin-modal-confirm';
        confirmBtn.textContent = 'Gå til admin';
        confirmBtn.addEventListener('click', function() {
            window.location.href = redirectUrl;
        });
        
        modalFooter.appendChild(cancelBtn);
        modalFooter.appendChild(confirmBtn);
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        
        modalContainer.appendChild(modalContent);
        
        // Add modal to body
        document.body.appendChild(modalContainer);
        
        // Close modal when clicking outside
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
    }
});
