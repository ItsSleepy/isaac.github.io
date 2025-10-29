// Admin Panel - Supabase Manager

// ===== SUPABASE INITIALIZATION =====
let supabase = null;

async function initSupabase() {
    if (supabase) return supabase;
    
    try {
        if (!window.supabase) {
            throw new Error('Supabase library not loaded');
        }
        
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('✅ Admin panel connected to Supabase!');
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// ===== PASSWORD PROTECTION =====
const ADMIN_PASSWORD = 'your_secure_password_here'; // Change this to your desired password
const SESSION_KEY = 'adminLoggedIn';
const SESSION_DURATION = 3600000; // 1 hour in milliseconds

// Check if user is logged in
async function checkAuth() {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        // Check if session is still valid
        if (now - sessionData.timestamp < SESSION_DURATION) {
            await showAdminPanel();
            return true;
        } else {
            // Session expired
            localStorage.removeItem(SESSION_KEY);
        }
    }
    showLoginScreen();
    return false;
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    console.log('Login function called');
    
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('loginError');
    const password = passwordInput.value;
    
    console.log('Password entered:', password ? 'Yes' : 'No');
    
    if (password === ADMIN_PASSWORD) {
        console.log('Password correct, logging in...');
        // Store session
        const sessionData = {
            timestamp: Date.now(),
            authenticated: true
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        
        // Hide error if shown
        errorDiv.classList.remove('show');
        
        // Show admin panel
        console.log('Calling showAdminPanel...');
        await showAdminPanel();
        console.log('showAdminPanel completed');
        
        // Clear password field
        passwordInput.value = '';
    } else {
        // Show error
        errorDiv.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Shake animation
        const loginBox = document.querySelector('.login-box');
        loginBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginBox.style.animation = '';
        }, 500);
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminContent').classList.remove('show');
}

// Show admin panel
async function showAdminPanel() {
    console.log('showAdminPanel called');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminContent').classList.add('show');
    
    console.log('Calling initializeProjects...');
    // Initialize admin panel
    await initializeProjects();
    console.log('initializeProjects completed');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(SESSION_KEY);
        showLoginScreen();
    }
}

// Add shake animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ===== PROJECTS MANAGEMENT =====

// Initialize projects from Supabase
async function initializeProjects() {
    try {
        await initSupabase();
        await loadProjects();
    } catch (error) {
        console.error('Error initializing projects:', error);
        showToast('Error loading projects from database', 'error');
    }
}

// Get all projects from Supabase
async function getProjects() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        // Convert snake_case to camelCase
        return data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            githubUrl: project.github_url,
            liveUrl: project.live_url,
            technologies: project.technologies,
            iconClass: project.icon_class,
            gradientColors: project.gradient_colors,
            displayOrder: project.display_order
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        showToast('Error loading projects from database', 'error');
        return [];
    }
}

// This function is no longer needed with Supabase
// Projects are saved individually via saveProject function
function saveProjects(projects) {
    console.warn('saveProjects() is deprecated with Supabase. Use saveProject() instead.');
}

// Load and display projects
async function loadProjects() {
    const projects = await getProjects();
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No projects yet</h3>
                <p>Click "Add New Project" to get started!</p>
            </div>
        `;
    } else {
        projectsList.innerHTML = projects
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(project => `
                <div class="project-card">
                    <div style="font-size: 2rem; color: #6366f1;">
                        <i class="${project.iconClass}"></i>
                    </div>
                    <div class="project-info">
                        <h3>${escapeHtml(project.title)}</h3>
                        <p>${escapeHtml(project.description)}</p>
                        <div class="tech-tags">
                            ${project.technologies.split(',').map(tech => 
                                `<span class="tech-tag">${escapeHtml(tech.trim())}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="action-btns">
                        <button onclick="editProject(${project.id})" class="btn btn-edit btn-sm">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteProject(${project.id})" class="btn btn-delete btn-sm">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
    }
    
    updateStats();
}

// Update statistics
async function updateStats() {
    const projects = await getProjects();
    const allTech = new Set();
    
    projects.forEach(project => {
        project.technologies.split(',').forEach(tech => {
            allTech.add(tech.trim());
        });
    });
    
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('activeProjects').textContent = projects.length;
    document.getElementById('totalTech').textContent = allTech.size;
}

// Open add modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectModal').classList.add('active');
}

// Edit project
async function editProject(id) {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);
    
    if (project) {
        document.getElementById('modalTitle').textContent = 'Edit Project';
        document.getElementById('projectId').value = project.id;
        document.getElementById('title').value = project.title;
        document.getElementById('description').value = project.description;
        document.getElementById('githubUrl').value = project.githubUrl;
        document.getElementById('liveUrl').value = project.liveUrl || '';
        document.getElementById('technologies').value = project.technologies;
        document.getElementById('iconClass').value = project.iconClass;
        document.getElementById('gradientColors').value = project.gradientColors;
        document.getElementById('displayOrder').value = project.displayOrder;
        document.getElementById('projectModal').classList.add('active');
    }
}

// Delete project
// Delete project from Supabase
async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const client = await initSupabase();
            if (!client) throw new Error('Supabase not initialized');
            
            const { error } = await client
                .from('projects')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            await loadProjects();
            showToast('Project deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting project:', error);
            showToast('Error deleting project: ' + error.message, 'error');
        }
    }
}

// Save project to Supabase
async function saveProject(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const project = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        github_url: document.getElementById('githubUrl').value,
        live_url: document.getElementById('liveUrl').value,
        technologies: document.getElementById('technologies').value,
        icon_class: document.getElementById('iconClass').value,
        gradient_colors: document.getElementById('gradientColors').value,
        display_order: parseInt(document.getElementById('displayOrder').value)
    };
    
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        let error;
        
        if (projectId) {
            // Update existing project
            const result = await client
                .from('projects')
                .update(project)
                .eq('id', parseInt(projectId));
            error = result.error;
        } else {
            // Insert new project
            const result = await client
                .from('projects')
                .insert([project]);
            error = result.error;
        }
        
        if (error) throw error;
        
        closeModal();
        await loadProjects();
        showToast('Project saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving project:', error);
        showToast('Error saving project: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
}

// Update main site - No longer needed with Supabase (real-time sync)
function updateMainSite() {
    console.log('Projects synced to Supabase database');
}

// Export projects as JSON file
// Export projects as JSON file (downloads from Supabase database)
async function exportProjects() {
    const projects = await getProjects();
    
    if (!projects || projects.length === 0) {
        showToast('No projects to export', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-projects-backup-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast(`${projects.length} projects exported successfully!`, 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// Import projects (can be called from console or added as button)
function importProjects(jsonData) {
    try {
        const projects = JSON.parse(jsonData);
        saveProjects(projects);
        loadProjects();
        alert('Projects imported successfully!');
    } catch (e) {
        alert('Error importing projects: ' + e.message);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set up login form event listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check authentication first
    checkAuth();
});

// Close modal when clicking outside (only if logged in)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') {
                closeModal();
            }
        });
    }
    
    // Load theme customizer values
    loadThemeCustomizer();
    
    // Load about info
    loadAboutInfo();
    
    // Load social links
    loadSocialLinks();
    
    // Load categories
    loadCategories();
});

// ===== THEME CUSTOMIZER =====
function loadThemeCustomizer() {
    const themeColors = JSON.parse(localStorage.getItem('themeColors')) || {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa'
    };
    
    document.getElementById('primaryColor').value = themeColors.primary;
    document.getElementById('secondaryColor').value = themeColors.secondary;
    document.getElementById('accentColor').value = themeColors.accent;
}

function updateThemeColor(colorType, value) {
    const themeColors = JSON.parse(localStorage.getItem('themeColors')) || {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa'
    };
    
    themeColors[colorType] = value;
    localStorage.setItem('themeColors', JSON.stringify(themeColors));
    
    // Show success message
    showSuccessMessage('Theme color updated! Refresh your portfolio to see changes.');
}

function resetThemeColors() {
    if (confirm('Reset all theme colors to default?')) {
        localStorage.removeItem('themeColors');
        loadThemeCustomizer();
        showSuccessMessage('Theme colors reset to default!');
    }
}

// ===== ABOUT ME EDITOR =====
function loadAboutInfo() {
    const aboutInfo = JSON.parse(localStorage.getItem('aboutInfo')) || {
        tagline: 'Student & Developer Portfolio',
        bio: 'Hi! I\'m a passionate software developer and second-year student. I love building projects that solve real-world problems and continuously learning new technologies.',
        email: 'your.email@example.com',
        phone: '+1234567890'
    };
    
    document.getElementById('heroTagline').value = aboutInfo.tagline;
    document.getElementById('aboutBio').value = aboutInfo.bio;
    document.getElementById('contactEmail').value = aboutInfo.email;
    document.getElementById('contactPhone').value = aboutInfo.phone;
}

function saveAboutInfo() {
    const aboutInfo = {
        tagline: document.getElementById('heroTagline').value,
        bio: document.getElementById('aboutBio').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value
    };
    
    localStorage.setItem('aboutInfo', JSON.stringify(aboutInfo));
    showSuccessMessage('About info saved! Refresh your portfolio to see changes.');
}

// ===== SOCIAL LINKS MANAGER =====
function loadSocialLinks() {
    const socialLinks = JSON.parse(localStorage.getItem('socialLinks')) || {
        github: 'https://github.com/yourusername',
        instagram: '',
        steam: '',
        discord: ''
    };
    
    document.getElementById('githubUrl').value = socialLinks.github;
    document.getElementById('instagramUrl').value = socialLinks.instagram || '';
    document.getElementById('steamUrl').value = socialLinks.steam || '';
    document.getElementById('discordTag').value = socialLinks.discord || '';
}

function saveSocialLinks() {
    const socialLinks = {
        github: document.getElementById('githubUrl').value,
        instagram: document.getElementById('instagramUrl').value,
        steam: document.getElementById('steamUrl').value,
        discord: document.getElementById('discordTag').value
    };
    
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
    showSuccessMessage('Social links saved! Refresh your portfolio to see changes.');
}

// ===== PROJECT CATEGORIES =====
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('projectCategories')) || [
        { id: 1, name: 'Web Development', icon: 'fas fa-globe', color: '#6366f1' },
        { id: 2, name: 'Mobile Apps', icon: 'fas fa-mobile-alt', color: '#10b981' },
        { id: 3, name: 'Games', icon: 'fas fa-gamepad', color: '#f59e0b' },
        { id: 4, name: 'Tools & Utilities', icon: 'fas fa-tools', color: '#8b5cf6' }
    ];
    
    const categoriesList = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        categoriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <p>No categories yet. Click "Add Category" to create one.</p>
            </div>
        `;
        return;
    }
    
    categoriesList.innerHTML = categories.map(category => `
        <div class="project-card">
            <i class="${category.icon}" style="font-size: 2rem; color: ${category.color};"></i>
            <div class="project-info">
                <h3>${escapeHtml(category.name)}</h3>
                <div class="tech-tag" style="background: ${category.color}20; color: ${category.color};">
                    ${category.icon.split(' ')[1]}
                </div>
            </div>
            <div class="action-btns">
                <button onclick="editCategory(${category.id})" class="btn btn-sm btn-edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteCategory(${category.id})" class="btn btn-sm btn-delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryColor').value = '#6366f1';
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
}

function editCategory(id) {
    const categories = JSON.parse(localStorage.getItem('projectCategories')) || [];
    const category = categories.find(c => c.id === id);
    
    if (category) {
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryIcon').value = category.icon;
        document.getElementById('categoryColor').value = category.color;
        document.getElementById('categoryId').value = category.id;
        openCategoryModal();
    }
}

function saveCategory(event) {
    event.preventDefault();
    
    const categories = JSON.parse(localStorage.getItem('projectCategories')) || [];
    const categoryId = document.getElementById('categoryId').value;
    
    const categoryData = {
        id: categoryId ? parseInt(categoryId) : Date.now(),
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value || 'fas fa-folder',
        color: document.getElementById('categoryColor').value
    };
    
    if (categoryId) {
        // Edit existing
        const index = categories.findIndex(c => c.id === parseInt(categoryId));
        categories[index] = categoryData;
    } else {
        // Add new
        categories.push(categoryData);
    }
    
    localStorage.setItem('projectCategories', JSON.stringify(categories));
    closeCategoryModal();
    loadCategories();
    showSuccessMessage(categoryId ? 'Category updated!' : 'Category added!');
}

function deleteCategory(id) {
    if (confirm('Delete this category?')) {
        let categories = JSON.parse(localStorage.getItem('projectCategories')) || [];
        categories = categories.filter(c => c.id !== id);
        localStorage.setItem('projectCategories', JSON.stringify(categories));
        loadCategories();
        showSuccessMessage('Category deleted!');
    }
}

// ===== UTILITY FUNCTIONS =====
function showSuccessMessage(message) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
