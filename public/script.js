document.addEventListener('DOMContentLoaded', () => {
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const removeCommentsBtn = document.getElementById('remove-comments');
    const detectedLanguageSpan = document.getElementById('detected-language');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Check for saved theme preference or use the system preference
    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
    }

    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        
        // Update localStorage
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('color-theme', 'dark');
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            localStorage.setItem('color-theme', 'light');
            themeToggleLightIcon.classList.add('hidden');
            themeToggleDarkIcon.classList.remove('hidden');
        }
    });

    function detectLanguage() {
        const code = inputCode.value.trim();
        let detectedLanguage = 'Unknown';

        if (code.startsWith('<?php') || code.includes('<?php')) {
            detectedLanguage = 'PHP';
        } else if (code.includes('class') && code.includes('public') && code.includes('{')) {
            detectedLanguage = 'Java';
        } else if (code.includes('def ') && code.includes(':')) {
            detectedLanguage = 'Python';
        } else if (code.includes('#include') && code.includes('int main()')) {
            detectedLanguage = 'C++';
        } else if (code.startsWith('<!DOCTYPE html>') || code.includes('<html>')) {
            detectedLanguage = 'HTML';
        } else if (code.includes('{') && code.includes('}') && code.includes(':')) {
            detectedLanguage = 'CSS';
        } else if (code.includes('function') || code.includes('const') || code.includes('let')) {
            detectedLanguage = 'JavaScript';
        }

        detectedLanguageSpan.textContent = detectedLanguage;
        return detectedLanguage;
    }

    function removeComments() {
        let code = inputCode.value;
        const language = detectLanguage();

        switch (language) {
            case 'JavaScript':
            case 'Java':
            case 'C++':
            case 'PHP':
                code = code.replace(/\/\/.*$/gm, '');
                code = code.replace(/\/\*[\s\S]*?\*\//g, '');
                break;
            case 'Python':
                code = code.replace(/#.*$/gm, '');
                code = code.replace(/'''[\s\S]*?'''/g, '');
                code = code.replace(/"""[\s\S]*?"""/g, '');
                break;
            case 'HTML':
                code = code.replace(/<!--[\s\S]*?-->/g, '');
                break;
            case 'CSS':
                code = code.replace(/\/\*[\s\S]*?\*\//g, '');
                break;
        }

        outputCode.value = code.replace(/^\s*[\r\n]/gm, '');
    }

    // Event listeners
    inputCode.addEventListener('input', detectLanguage);
    removeCommentsBtn.addEventListener('click', removeComments);
});