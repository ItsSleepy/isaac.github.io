// ================================================
// SUPABASE CLIENT INITIALIZATION
// ================================================
let supabase = null;
let supabasePromise = null;

async function initSupabase() {
    if (supabase) return supabase;
    if (supabasePromise) return supabasePromise;
    
    supabasePromise = (async () => {
        try {
            // Load Supabase from CDN
            if (!window.supabase) {
                throw new Error('Supabase library not loaded. Make sure the script tag is in index.html');
            }
            
            const { createClient } = window.supabase;
            supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase connected successfully!');
            return supabase;
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            supabasePromise = null;
            return null;
        }
    })();
    
    return supabasePromise;
}

// ================================================
// FETCH FUNCTIONS - Get data from Supabase
// ================================================

export async function getProjects() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        // Convert snake_case from database to camelCase for JavaScript
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
        // Fallback to localStorage
        return getProjectsFromLocalStorage();
    }
}

export async function getAboutInfo() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('about_info')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        
        return {
            tagline: data.tagline,
            bio: data.bio,
            email: data.email,
            phone: data.phone
        };
    } catch (error) {
        console.error('Error fetching about info:', error);
        return JSON.parse(localStorage.getItem('aboutInfo')) || {};
    }
}

export async function getSocialLinks() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('social_links')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        
        return {
            github: data.github,
            instagram: data.instagram,
            steam: data.steam,
            discord: data.discord
        };
    } catch (error) {
        console.error('Error fetching social links:', error);
        return JSON.parse(localStorage.getItem('socialLinks')) || {};
    }
}

export async function getThemeColors() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('theme_colors')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        
        return {
            primary: data.primary_color,
            secondary: data.secondary_color,
            accent: data.accent_color
        };
    } catch (error) {
        console.error('Error fetching theme colors:', error);
        return JSON.parse(localStorage.getItem('themeColors')) || {};
    }
}

export async function getCategories() {
    try {
        const client = await initSupabase();
        if (!client) throw new Error('Supabase not initialized');
        
        const { data, error } = await client
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return JSON.parse(localStorage.getItem('projectCategories')) || [];
    }
}

// ================================================
// FALLBACK FUNCTIONS - LocalStorage backup
// ================================================

function getProjectsFromLocalStorage() {
    const stored = localStorage.getItem('portfolioProjects');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Return default projects
    return [
        {
            id: 1,
            title: 'File Organiser',
            description: 'An automated file organization tool that sorts and categorizes files based on type, helping keep your directories clean and organized.',
            githubUrl: 'https://github.com/yourusername/File-Organiser',
            liveUrl: '',
            technologies: 'Python',
            iconClass: 'fas fa-folder-open',
            gradientColors: 'linear-gradient(135deg, #4A90E2, #357ABD)',
            displayOrder: 1
        }
        // ... other default projects
    ];
}

// ================================================
// REAL-TIME SUBSCRIPTIONS (Optional)
// ================================================
// Subscribe to database changes for real-time updates

async function subscribeToProjects(callback) {
    const client = await initSupabase();
    if (!client) return;
    
    client
        .channel('projects-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'projects' },
            (payload) => {
                console.log('Projects updated:', payload);
                callback();
            }
        )
        .subscribe();
}

async function subscribeToAboutInfo(callback) {
    const client = await initSupabase();
    if (!client) return;
    
    client
        .channel('about-info-changes')
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'about_info' },
            (payload) => {
                console.log('About info updated:', payload);
                callback();
            }
        )
        .subscribe();
}
