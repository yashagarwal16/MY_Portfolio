// Projects Page JavaScript
class ProjectsManager {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeAnimations();
    }

    bindEvents() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Add search functionality
        this.addSearchFunctionality();
    }

    handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        
        // Update active tab
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter projects
        this.filterProjects(filter);
        this.currentFilter = filter;
    }

    filterProjects(filter) {
        this.projects.forEach((project, index) => {
            const category = project.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                project.classList.remove('filtered-out');
                // Stagger animation
                setTimeout(() => {
                    project.classList.remove('hidden');
                }, index * 100);
            } else {
                project.classList.add('hidden');
                setTimeout(() => {
                    project.classList.add('filtered-out');
                }, 300);
            }
        });
    }

    addSearchFunctionality() {
        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" class="search-input" placeholder="Search projects...">
                <i class="fas fa-search search-icon"></i>
            </div>
        `;

        const filterTabs = document.querySelector('.filter-tabs');
        filterTabs.parentNode.insertBefore(searchContainer, filterTabs);

        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        this.projects.forEach(project => {
            const title = project.querySelector('.project-title').textContent.toLowerCase();
            const description = project.querySelector('.project-description').textContent.toLowerCase();
            const tags = Array.from(project.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (matches && (this.currentFilter === 'all' || project.dataset.category === this.currentFilter)) {
                project.classList.remove('hidden', 'filtered-out');
            } else {
                project.classList.add('hidden');
            }
        });
    }

    initializeAnimations() {
        // Animate project cards on load
        this.projects.forEach((project, index) => {
            project.style.animationDelay = `${index * 0.1}s`;
            project.classList.add('fade-in-up');
        });

        // Add intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        this.projects.forEach(project => observer.observe(project));
    }
}

// Enhanced Theme Manager for Projects Page
class ProjectsThemeManager extends ThemeManager {
    constructor() {
        super();
        this.updateProjectsTheme();
    }

    setTheme(theme) {
        super.setTheme(theme);
        this.updateProjectsTheme();
    }

    updateProjectsTheme() {
        const hero = document.querySelector('.hero');
        if (hero && this.theme === 'dark') {
            hero.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
        } else if (hero) {
            hero.style.background = 'var(--gradient-primary)';
        }
    }
}

// Project Analytics
class ProjectAnalytics {
    constructor() {
        this.views = new Map();
        this.init();
    }

    init() {
        this.trackProjectViews();
        this.trackFilterUsage();
    }

    trackProjectViews() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const projectTitle = e.target.closest('.project-card').querySelector('.project-title').textContent;
                this.recordView(projectTitle);
            });
        });
    }

    trackFilterUsage() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.recordFilterUsage(filter);
            });
        });
    }

    recordView(projectTitle) {
        const currentViews = this.views.get(projectTitle) || 0;
        this.views.set(projectTitle, currentViews + 1);
        
        // Store in localStorage for persistence
        localStorage.setItem('projectViews', JSON.stringify(Array.from(this.views.entries())));
        
        console.log(`Project viewed: ${projectTitle} (${currentViews + 1} times)`);
    }

    recordFilterUsage(filter) {
        const filterUsage = JSON.parse(localStorage.getItem('filterUsage') || '{}');
        filterUsage[filter] = (filterUsage[filter] || 0) + 1;
        localStorage.setItem('filterUsage', JSON.stringify(filterUsage));
        
        console.log(`Filter used: ${filter}`);
    }

    getPopularProjects() {
        return Array.from(this.views.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }
}

// Project Search Enhancement
class ProjectSearch {
    constructor() {
        this.searchIndex = new Map();
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.enhanceSearch();
    }

    buildSearchIndex() {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            const title = project.querySelector('.project-title').textContent;
            const description = project.querySelector('.project-description').textContent;
            const tags = Array.from(project.querySelectorAll('.tag')).map(tag => tag.textContent);
            
            const searchableText = [title, description, ...tags].join(' ').toLowerCase();
            this.searchIndex.set(project, searchableText);
        });
    }

    enhanceSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        // Add search suggestions
        this.addSearchSuggestions(searchInput);
        
        // Add search highlighting
        this.addSearchHighlighting();
    }

    addSearchSuggestions(searchInput) {
        const suggestions = ['Docker', 'AWS', 'Python', 'Machine Learning', 'Web Development', 'DevOps'];
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionsContainer);

        searchInput.addEventListener('focus', () => {
            suggestionsContainer.innerHTML = suggestions
                .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
                .join('');
            suggestionsContainer.style.display = 'block';
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsContainer.style.display = 'none';
            }, 200);
        });

        suggestionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                searchInput.value = e.target.textContent;
                searchInput.dispatchEvent(new Event('input'));
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    addSearchHighlighting() {
        // Implementation for highlighting search terms in results
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            this.searchIndex.forEach((searchText, project) => {
                const titleElement = project.querySelector('.project-title');
                const descriptionElement = project.querySelector('.project-description');
                
                if (query && searchText.includes(query)) {
                    this.highlightText(titleElement, query);
                    this.highlightText(descriptionElement, query);
                } else {
                    this.removeHighlight(titleElement);
                    this.removeHighlight(descriptionElement);
                }
            });
        });
    }

    highlightText(element, query) {
        const originalText = element.dataset.originalText || element.textContent;
        element.dataset.originalText = originalText;
        
        const regex = new RegExp(`(${query})`, 'gi');
        const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
        element.innerHTML = highlightedText;
    }

    removeHighlight(element) {
        if (element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
            delete element.dataset.originalText;
        }
    }
}

// Project Performance Metrics
class ProjectPerformanceMetrics {
    constructor() {
        this.metrics = {
            loadTime: 0,
            interactionTime: 0,
            filterTime: 0
        };
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.measureInteractionTime();
        this.measureFilterTime();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`Projects page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
    }

    measureInteractionTime() {
        const startTime = performance.now();
        
        document.addEventListener('click', () => {
            if (this.metrics.interactionTime === 0) {
                this.metrics.interactionTime = performance.now() - startTime;
                console.log(`First interaction after ${this.metrics.interactionTime.toFixed(2)}ms`);
            }
        });
    }

    measureFilterTime() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const startTime = performance.now();
                
                requestAnimationFrame(() => {
                    const endTime = performance.now();
                    console.log(`Filter applied in ${(endTime - startTime).toFixed(2)}ms`);
                });
            });
        });
    }
}

// Initialize Projects Page
class ProjectsApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        // Initialize all managers
        this.themeManager = new ProjectsThemeManager();
        this.navigationManager = new NavigationManager();
        this.projectsManager = new ProjectsManager();
        this.projectSearch = new ProjectSearch();
        this.analytics = new ProjectAnalytics();
        this.performanceMetrics = new ProjectPerformanceMetrics();

        // Add custom styles for search
        this.addSearchStyles();
        
        console.log('🎨 Projects page initialized successfully');
    }

    addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                display: flex;
                justify-content: center;
                margin-bottom: var(--space-xl);
            }
            
            .search-input-wrapper {
                position: relative;
                max-width: 400px;
                width: 100%;
            }
            
            .search-input {
                width: 100%;
                padding: var(--space-md) var(--space-xl) var(--space-md) var(--space-lg);
                border: 2px solid var(--border-color);
                border-radius: var(--radius-lg);
                background: var(--bg-primary);
                color: var(--text-primary);
                font-size: var(--font-size-base);
                transition: all var(--transition-base);
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--accent-primary);
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .search-icon {
                position: absolute;
                right: var(--space-md);
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-muted);
                pointer-events: none;
            }
            
            .search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                box-shadow: 0 8px 25px var(--shadow-medium);
                z-index: 100;
                display: none;
                margin-top: var(--space-xs);
            }
            
            .suggestion-item {
                padding: var(--space-md);
                cursor: pointer;
                transition: background-color var(--transition-fast);
                border-bottom: 1px solid var(--border-color);
            }
            
            .suggestion-item:last-child {
                border-bottom: none;
            }
            
            .suggestion-item:hover {
                background: var(--bg-secondary);
            }
            
            mark {
                background: var(--accent-primary);
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Start the projects application
new ProjectsApp();