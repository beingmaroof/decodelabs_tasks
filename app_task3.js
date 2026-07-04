/**
 * DecodeLabs - Task 3: Interactive Web Elements
 * Pure Vanilla JavaScript implementation of State Management and DOM Manipulation
 * following strict engineering standards (decoupling and safe mutation).
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // STATE DEFINITION
    // ==========================================================================
    let state = {
        modules: [],
        currentFilter: 'all' // Options: 'all', 'pending', 'completed'
    };

    // Load initial data from localStorage if available
    const savedModules = localStorage.getItem('decodelabs_modules');
    if (savedModules) {
        try {
            state.modules = JSON.parse(savedModules);
        } catch (e) {
            state.modules = [];
        }
    } else {
        // Starter mock modules for visual demonstration on first load
        state.modules = [
            { id: 1, title: 'Learn HTML structure and tags', category: 'HTML', completed: true },
            { id: 2, title: 'Understand CSS custom properties', category: 'CSS', completed: false },
            { id: 3, title: 'Wire event listeners in JavaScript', category: 'JS', completed: false }
        ];
    }

    // ==========================================================================
    // DOM REFERENCES (Using strict js- prefix naming convention)
    // ==========================================================================
    const body = document.body;
    const themeToggleBtn = document.querySelector('.js-theme-toggle');
    
    const addForm = document.querySelector('.js-add-form');
    const inputTitle = document.querySelector('.js-input-title');
    const inputCategory = document.querySelector('.js-input-category');
    
    const totalCountEl = document.querySelector('.js-total-count');
    const completedCountEl = document.querySelector('.js-completed-count');
    const completionRateEl = document.querySelector('.js-completion-rate');
    
    const emptyStateEl = document.querySelector('.js-empty-state');
    const moduleListEl = document.querySelector('.js-module-list');
    
    const filterAllBtn = document.querySelector('.js-filter-all');
    const filterPendingBtn = document.querySelector('.js-filter-pending');
    const filterCompletedBtn = document.querySelector('.js-filter-completed');

    // ==========================================================================
    // THEME MANAGEMENT (Dark Mode Toggle Case Study)
    // ==========================================================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('decodelabs_theme');
        if (savedTheme === 'dark') {
            body.classList.add('is-dark-mode');
        } else {
            body.classList.remove('is-dark-mode');
        }
    };

    const toggleTheme = () => {
        // Toggle the visual state class (is- prefix)
        body.classList.toggle('is-dark-mode');
        
        // Persist theme state in localStorage
        if (body.classList.contains('is-dark-mode')) {
            localStorage.setItem('decodelabs_theme', 'dark');
        } else {
            localStorage.setItem('decodelabs_theme', 'light');
        }
    };

    // Attach event listener for theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // ==========================================================================
    // APP BUSINESS LOGIC (IPO: Input -> Process -> Output)
    // ==========================================================================
    
    // Save current modules list to localStorage
    const saveState = () => {
        localStorage.setItem('decodelabs_modules', JSON.stringify(state.modules));
    };

    // INPUT: Handle form submission to add new study modules
    if (addForm) {
        addForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const titleValue = inputTitle.value.trim();
            const categoryValue = inputCategory.value;
            
            if (titleValue === '') return;
            
            // PROCESS: Mutate state (Add object with unique ID)
            const newModule = {
                id: Date.now(),
                title: titleValue,
                category: categoryValue,
                completed: false
            };
            
            state.modules.push(newModule);
            saveState();
            
            // Clear inputs
            inputTitle.value = '';
            inputTitle.focus();
            
            // OUTPUT: Re-render UI to display updates
            renderApp();
        });
    }

    // PROCESS: Toggle completed status of a module
    const toggleModuleComplete = (id) => {
        state.modules = state.modules.map(module => {
            if (module.id === id) {
                return { ...module, completed: !module.completed };
            }
            return module;
        });
        saveState();
        renderApp();
    };

    // PROCESS: Delete a module from list
    const deleteModule = (id) => {
        state.modules = state.modules.filter(module => module.id !== id);
        saveState();
        renderApp();
    };

    // PROCESS: Set filter state
    const setFilter = (filterName, activeBtn) => {
        state.currentFilter = filterName;
        
        // Update visual states of filter buttons
        [filterAllBtn, filterPendingBtn, filterCompletedBtn].forEach(btn => {
            if (btn) btn.classList.remove('is-active');
        });
        if (activeBtn) {
            activeBtn.classList.add('is-active');
        }
        
        renderApp();
    };

    // Attach event listeners to filter buttons
    if (filterAllBtn) {
        filterAllBtn.addEventListener('click', () => setFilter('all', filterAllBtn));
    }
    if (filterPendingBtn) {
        filterPendingBtn.addEventListener('click', () => setFilter('pending', filterPendingBtn));
    }
    if (filterCompletedBtn) {
        filterCompletedBtn.addEventListener('click', () => setFilter('completed', filterCompletedBtn));
    }

    // ==========================================================================
    // OUTPUT: DOM MUTATION (Safe Node Creation & Text Injection)
    // ==========================================================================
    const renderApp = () => {
        // Clear list contents to redraw
        moduleListEl.textContent = '';
        
        // Filter the modules based on selected filter state
        const filteredModules = state.modules.filter(module => {
            if (state.currentFilter === 'pending') return !module.completed;
            if (state.currentFilter === 'completed') return module.completed;
            return true; // 'all'
        });

        // Show/hide empty state visual placeholder
        if (filteredModules.length === 0) {
            emptyStateEl.classList.remove('is-hidden');
            // Safe text injection based on filter state
            if (state.currentFilter === 'all') {
                emptyStateEl.firstElementChild.textContent = 'No modules added yet. Start by adding one above!';
            } else {
                emptyStateEl.firstElementChild.textContent = `No ${state.currentFilter} modules found.`;
            }
        } else {
            emptyStateEl.classList.add('is-hidden');
        }

        // Dynamically build list items using document.createElement()
        filteredModules.forEach(module => {
            const li = document.createElement('li');
            li.classList.add('module-item');
            
            // Set completed visual state (is- prefix)
            if (module.completed) {
                li.classList.add('is-completed');
            }

            // Info container
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('module-info');

            const h4 = document.createElement('h4');
            h4.classList.add('module-title');
            // SAFE TEXT MUTATION (Prevents XSS Injection)
            h4.textContent = module.title;

            const badge = document.createElement('span');
            badge.classList.add('module-badge');
            // Set category specific visual classes
            badge.classList.add(`badge-${module.category.toLowerCase()}`);
            badge.textContent = module.category === 'JS' ? 'JavaScript' : module.category;

            infoDiv.appendChild(h4);
            infoDiv.appendChild(badge);

            // Action buttons container
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('module-actions');

            const toggleBtn = document.createElement('button');
            toggleBtn.classList.add('action-btn', 'btn-toggle');
            toggleBtn.textContent = module.completed ? 'Mark Pending' : 'Mark Complete';
            toggleBtn.addEventListener('click', () => toggleModuleComplete(module.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('action-btn', 'btn-delete');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteModule(module.id));

            actionsDiv.appendChild(toggleBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(infoDiv);
            li.appendChild(actionsDiv);
            
            moduleListEl.appendChild(li);
        });

        // Update stats summary using safe textContent updates
        const total = state.modules.length;
        const completed = state.modules.filter(m => m.completed).length;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        totalCountEl.textContent = total.toString();
        completedCountEl.textContent = completed.toString();
        completionRateEl.textContent = `${rate}%`;
    };

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    initTheme();
    renderApp();
});
