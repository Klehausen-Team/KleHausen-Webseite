function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.classList.add('no-transition');
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Force reflow
    void document.body.offsetHeight;
    
    document.body.classList.remove('no-transition');
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('no-transition');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 10);
    });
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});