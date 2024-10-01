// static/js/theme.js
document.addEventListener('DOMContentLoaded', () => {
    const getTheme = () => localStorage.getItem('theme') || 'light';
    const setTheme = (theme) => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    setTheme(getTheme());

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = getTheme() === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
});