document.addEventListener('DOMContentLoaded', function() {
    // Logout button functionality
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        // Clear authentication
        sessionStorage.removeItem('isAuthenticated');
        // Redirect to login page
        window.location.href = 'login.html';
    });

    // Navigation between sections
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Skip for logout button
                if (this.id === 'logout-btn') return;
                
                const targetSection = this.getAttribute('data-section');
                
                // Update active nav link
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show target section, hide others
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${targetSection}-section`).classList.add('active');
            });
        }
    });
    
    // Load data for all sections
    loadPeopleData();
    loadEventsData();
    loadBlogData();
    
    // Add event listeners for add buttons
    document.getElementById('add-person-btn').addEventListener('click', showAddPersonForm);
    document.getElementById('add-event-btn').addEventListener('click', showAddEventForm);
    document.getElementById('add-blog-btn').addEventListener('click', showAddBlogForm);
    
    // Add event listeners for cancel buttons
    document.getElementById('cancel-person-btn').addEventListener('click', hidePersonForm);
    document.getElementById('cancel-event-btn').addEventListener('click', hideEventForm);
    document.getElementById('cancel-blog-btn').addEventListener('click', hideBlogForm);
    
    // Add event listeners for form submissions
    document.getElementById('person-form').addEventListener('submit', handlePersonFormSubmit);
    document.getElementById('event-form').addEventListener('submit', handleEventFormSubmit);
    document.getElementById('blog-form').addEventListener('submit', handleBlogFormSubmit);
    
    // Image upload preview functionality
    setupImagePreview('person-image', 'person-image-preview');
    setupImagePreview('event-image', 'event-image-preview');
    
    // Function to set up image preview
    function setupImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    preview.innerHTML = `<img src="${this.result}" alt="Preview">`;
                });
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // PEOPLE SECTION FUNCTIONS
    
    // Function to load people data
    function loadPeopleData() {
        fetch('../data/people.json')
            .then(response => response.json())
            .then(data => {
                displayPeopleData(data);
            })
            .catch(error => {
                console.error('Error loading people data:', error);
                document.getElementById('people-admin-grid').innerHTML = 
                    '<div class="error">Kunne ikke laste inn data. Prøv igjen senere.</div>';
            });
    }
    
    // Function to display people data
    function displayPeopleData(people) {
        const grid = document.getElementById('people-admin-grid');
        
        if (people.length === 0) {
            grid.innerHTML = '<div class="no-data">Ingen personer lagt til ennå.</div>';
            return;
        }
        
        let html = '';
        
        people.forEach(person => {
            html += `
                <div class="admin-card" data-id="${person.id}">
                    <div class="admin-card-image">
                        ${person.image ? 
                            `<img src="../${person.image}" alt="${person.name}">` : 
                            `<div class="image-placeholder"><div class="placeholder-text">Ingen bilde</div></div>`
                        }
                    </div>
                    <div class="admin-card-content">
                        <h3 class="admin-card-title">${person.name}</h3>
                        <p class="admin-card-subtitle">${person.role}</p>
                        <p>${person.bio.substring(0, 100)}${person.bio.length > 100 ? '...' : ''}</p>
                        <div class="admin-card-actions">
                            <button class="edit-btn" data-id="${person.id}"><i class="fas fa-edit"></i> Rediger</button>
                            <button class="delete-btn" data-id="${person.id}"><i class="fas fa-trash"></i> Slett</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Add event listeners for edit and delete buttons
        grid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const personId = this.getAttribute('data-id');
                editPerson(personId, people);
            });
        });
        
        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const personId = this.getAttribute('data-id');
                deletePerson(personId);
            });
        });
    }
    
    // Function to show add person form
    function showAddPersonForm() {
        document.getElementById('person-form-title').textContent = 'Legg til ny person';
        document.getElementById('person-form').reset();
        document.getElementById('person-id').value = '';
        document.getElementById('person-image-preview').innerHTML = 
            '<div class="image-placeholder"><div class="placeholder-text">Ingen bilde valgt</div></div>';
        document.getElementById('person-form-container').classList.add('active');
    }
    
    // Function to hide person form
    function hidePersonForm() {
        document.getElementById('person-form-container').classList.remove('active');
    }
    
    // Function to edit person
    function editPerson(personId, people) {
        const person = people.find(p => p.id === personId);
        
        if (!person) {
            console.error('Person not found:', personId);
            return;
        }
        
        document.getElementById('person-form-title').textContent = 'Rediger person';
        document.getElementById('person-id').value = person.id;
        document.getElementById('person-name').value = person.name;
        document.getElementById('person-role').value = person.role;
        document.getElementById('person-bio').value = person.bio;
        
        if (person.social) {
            document.getElementById('person-instagram').value = person.social.instagram || '';
            document.getElementById('person-website').value = person.social.website || '';
        }
        
        const imagePreview = document.getElementById('person-image-preview');
        if (person.image) {
            imagePreview.innerHTML = `<img src="../${person.image}" alt="${person.name}">`;
        } else {
            imagePreview.innerHTML = '<div class="image-placeholder"><div class="placeholder-text">Ingen bilde</div></div>';
        }
        
        document.getElementById('person-form-container').classList.add('active');
    }
    
    // Function to handle person form submit
    function handlePersonFormSubmit(e) {
        e.preventDefault();
        
        // In a real application, you would send this data to a server
        // For this example, we'll just show an alert
        alert('I en faktisk implementasjon ville denne informasjonen bli lagret på serveren.');
        
        // Simulate successful save
        hidePersonForm();
        loadPeopleData(); // Reload data
    }
    
    // Function to delete person
    function deletePerson(personId) {
        if (confirm('Er du sikker på at du vil slette denne personen?')) {
            // In a real application, you would send a delete request to the server
            // For this example, we'll just show an alert
            alert('I en faktisk implementasjon ville denne personen bli slettet fra serveren.');
            
            // Simulate successful delete
            loadPeopleData(); // Reload data
        }
    }
    
    // EVENTS SECTION FUNCTIONS
    
    // Function to load events data
    function loadEventsData() {
        fetch('../data/events.json')
            .then(response => response.json())
            .then(data => {
                displayEventsData(data);
            })
            .catch(error => {
                console.error('Error loading events data:', error);
                document.getElementById('events-admin-grid').innerHTML = 
                    '<div class="error">Kunne ikke laste inn data. Prøv igjen senere.</div>';
            });
    }
    
    // Function to display events data
    function displayEventsData(events) {
        const grid = document.getElementById('events-admin-grid');
        
        if (events.length === 0) {
            grid.innerHTML = '<div class="no-data">Ingen hendelser lagt til ennå.</div>';
            return;
        }
        
        let html = '';
        
        events.forEach(event => {
            html += `
                <div class="admin-card" data-id="${event.id}">
                    <div class="admin-card-image">
                        ${event.image ? 
                            `<img src="../${event.image}" alt="${event.title}">` : 
                            `<div class="image-placeholder"><div class="placeholder-text">Ingen bilde</div></div>`
                        }
                    </div>
                    <div class="admin-card-content">
                        <h3 class="admin-card-title">${event.title}</h3>
                        <p class="admin-card-subtitle">${event.date.day} ${event.date.month} ${event.date.year} | ${event.location}</p>
                        <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                        <div class="admin-card-actions">
                            <button class="edit-btn" data-id="${event.id}"><i class="fas fa-edit"></i> Rediger</button>
                            <button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i> Slett</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Add event listeners for edit and delete buttons
        grid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                editEvent(eventId, events);
            });
        });
        
        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                deleteEvent(eventId);
            });
        });
    }
    
    // Function to show add event form
    function showAddEventForm() {
        document.getElementById('event-form-title').textContent = 'Legg til ny hendelse';
        document.getElementById('event-form').reset();
        document.getElementById('event-id').value = '';
        document.getElementById('event-image-preview').innerHTML = 
            '<div class="image-placeholder"><div class="placeholder-text">Ingen bilde valgt</div></div>';
        document.getElementById('event-form-container').classList.add('active');
    }
    
    // Function to hide event form
    function hideEventForm() {
        document.getElementById('event-form-container').classList.remove('active');
    }
    
    // Function to edit event
    function editEvent(eventId, events) {
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            console.error('Event not found:', eventId);
            return;
        }
        
        document.getElementById('event-form-title').textContent = 'Rediger hendelse';
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date.full;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-link').value = event.link || '';
        
        const imagePreview = document.getElementById('event-image-preview');
        if (event.image) {
            imagePreview.innerHTML = `<img src="../${event.image}" alt="${event.title}">`;
        } else {
            imagePreview.innerHTML = '<div class="image-placeholder"><div class="placeholder-text">Ingen bilde</div></div>';
        }
        
        document.getElementById('event-form-container').classList.add('active');
    }
    
    // Function to handle event form submit
    function handleEventFormSubmit(e) {
        e.preventDefault();
        
        // In a real application, you would send this data to a server
        // For this example, we'll just show an alert
        alert('I en faktisk implementasjon ville denne informasjonen bli lagret på serveren.');
        
        // Simulate successful save
        hideEventForm();
        loadEventsData(); // Reload data
    }
    
    // Function to delete event
    function deleteEvent(eventId) {
        if (confirm('Er du sikker på at du vil slette denne hendelsen?')) {
            // In a real application, you would send a delete request to the server
            // For this example, we'll just show an alert
            alert('I en faktisk implementasjon ville denne hendelsen bli slettet fra serveren.');
            
            // Simulate successful delete
            loadEventsData(); // Reload data
        }
    }
    
    // BLOG SECTION FUNCTIONS
    
    // Function to load blog data
    function loadBlogData() {
        Promise.all([
            fetch('../data/blog.json').then(response => response.json()),
            fetch('../data/people.json').then(response => response.json())
        ])
        .then(([blogData, peopleData]) => {
            displayBlogData(blogData);
            populateAuthorDropdown(peopleData);
        })
        .catch(error => {
            console.error('Error loading blog data:', error);
            document.getElementById('blog-admin-grid').innerHTML = 
                '<div class="error">Kunne ikke laste inn data. Prøv igjen senere.</div>';
        });
    }
    
    // Function to populate author dropdown
    function populateAuthorDropdown(people) {
        const authorSelect = document.getElementById('blog-author');
        
        // Clear existing options except the first one
        while (authorSelect.options.length > 1) {
            authorSelect.remove(1);
        }
        
        // Add author options
        people.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = person.name;
            authorSelect.appendChild(option);
        });
    }
    
    // Function to display blog data
    function displayBlogData(posts) {
        const grid = document.getElementById('blog-admin-grid');
        
        if (posts.length === 0) {
            grid.innerHTML = '<div class="no-data">Ingen innlegg lagt til ennå.</div>';
            return;
        }
        
        let html = '';
        
        posts.forEach(post => {
            // Get category display name
            let categoryDisplay = 'Annet';
            if (post.category === 'nyheter') categoryDisplay = 'Nyheter';
            if (post.category === 'kunst') categoryDisplay = 'Kunst';
            if (post.category === 'events') categoryDisplay = 'Events';
            
            html += `
                <div class="admin-card" data-id="${post.id}">
                    <div class="admin-card-content">
                        <h3 class="admin-card-title">${post.title}</h3>
                        <p class="admin-card-subtitle">${post.author} | ${post.displayDate} | ${categoryDisplay}</p>
                        <p>${post.excerpt.substring(0, 150)}${post.excerpt.length > 150 ? '...' : ''}</p>
                        <div class="admin-card-actions">
                            <button class="edit-btn" data-id="${post.id}"><i class="fas fa-edit"></i> Rediger</button>
                            <button class="delete-btn" data-id="${post.id}"><i class="fas fa-trash"></i> Slett</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Add event listeners for edit and delete buttons
        grid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.getAttribute('data-id');
                editBlogPost(postId, posts);
            });
        });
        
        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.getAttribute('data-id');
                deleteBlogPost(postId);
            });
        });
    }
    
    // Function to show add blog form
    function showAddBlogForm() {
        document.getElementById('blog-form-title').textContent = 'Legg til nytt innlegg';
        document.getElementById('blog-form').reset();
        document.getElementById('blog-id').value = '';
        document.getElementById('blog-category').value = 'nyheter'; // Default category
        document.getElementById('blog-form-container').classList.add('active');
    }
    
    // Function to hide blog form
    function hideBlogForm() {
        document.getElementById('blog-form-container').classList.remove('active');
    }
    
    // Function to edit blog post
    function editBlogPost(postId, posts) {
        const post = posts.find(p => p.id === postId);
        
        if (!post) {
            console.error('Blog post not found:', postId);
            return;
        }
        
        document.getElementById('blog-form-title').textContent = 'Rediger innlegg';
        document.getElementById('blog-id').value = post.id;
        document.getElementById('blog-title').value = post.title;
        document.getElementById('blog-author').value = post.authorId;
        document.getElementById('blog-date').value = post.date;
        document.getElementById('blog-category').value = post.category || 'annet';
        document.getElementById('blog-excerpt').value = post.excerpt;
        document.getElementById('blog-content').value = post.content;
        document.getElementById('blog-tags').value = post.tags ? post.tags.join(', ') : '';
        
        document.getElementById('blog-form-container').classList.add('active');
    }
    
    // Function to handle blog form submit
    function handleBlogFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('blog-title').value;
        const authorId = document.getElementById('blog-author').value;
        const date = document.getElementById('blog-date').value;
        const category = document.getElementById('blog-category').value;
        const excerpt = document.getElementById('blog-excerpt').value;
        const content = document.getElementById('blog-content').value;
        const tags = document.getElementById('blog-tags').value;
        
        // In a real application, you would send this data to a server
        console.log('Blog post data:', { title, authorId, date, category, excerpt, content, tags });
        alert('I en faktisk implementasjon ville denne informasjonen bli lagret på serveren.');
        
        // Simulate successful save
        hideBlogForm();
        loadBlogData(); // Reload data
    }
    
    // Function to delete blog post
    function deleteBlogPost(postId) {
        if (confirm('Er du sikker på at du vil slette dette innlegget?')) {
            // In a real application, you would send a delete request to the server
            // For this example, we'll just show an alert
            alert('I en faktisk implementasjon ville dette innlegget bli slettet fra serveren.');
            
            // Simulate successful delete
            loadBlogData(); // Reload data
        }
    }
});
