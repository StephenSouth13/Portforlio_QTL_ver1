// lang.js

document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.language-switcher button');
    let translations = {}; // Object to store loaded translations

    // Function to fetch translations
    async function fetchTranslations(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translations for ${lang}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching translations:", error);
            return {}; // Return empty object on error
        }
    }

    // Function to apply translations
    function applyTranslations(langData) {
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });
    }

    // Initialize with default language (e.g., Vietnamese)
    async function initializeLanguage() {
        const defaultLang = localStorage.getItem('lang') || 'vi';
        translations[defaultLang] = await fetchTranslations(defaultLang);
        applyTranslations(translations[defaultLang]);
        // Highlight active button
        langButtons.forEach(button => {
            if (button.getAttribute('data-lang') === defaultLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Event listener for language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const newLang = button.getAttribute('data-lang');

            // Load translations if not already loaded
            if (!translations[newLang]) {
                translations[newLang] = await fetchTranslations(newLang);
            }

            applyTranslations(translations[newLang]);
            localStorage.setItem('lang', newLang); // Save preference

            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    initializeLanguage();
});
