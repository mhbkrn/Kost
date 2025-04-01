// Theme switching functionality

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
        updateThemeColors('dark');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
        updateThemeColors('light');
    }
    
    // Toggle theme when switch is clicked
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            updateThemeColors('dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            updateThemeColors('light');
        }
    });
    
    // Update theme-related colors and elements
    function updateThemeColors(theme) {
        // Update meta theme-color for browser UI
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#FFFFFF');
        
        // Update background animation theme if function exists
        if (window.updateBackgroundTheme) {
            window.updateBackgroundTheme(theme);
        }
    }
});