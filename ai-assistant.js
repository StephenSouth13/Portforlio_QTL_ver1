// ai-assistant.js

document.addEventListener('DOMContentLoaded', () => {
    const aiAvatar = document.querySelector('#ai-assistant .ai-avatar');
    const aiChatBubble = document.querySelector('#ai-assistant .ai-chat-bubble');
    const aiChatBubbleText = aiChatBubble.querySelector('p');
    const languageSwitcher = document.querySelector('#ai-assistant .language-switcher');

    let isChatBubbleVisible = false;

    // Function to toggle chat bubble visibility
    function toggleChatBubble() {
        isChatBubbleVisible = !isChatBubbleVisible;
        if (isChatBubbleVisible) {
            aiChatBubble.classList.add('visible');
            languageSwitcher.classList.add('visible'); // Show language switcher with bubble
        } else {
            aiChatBubble.classList.remove('visible');
            languageSwitcher.classList.remove('visible');
        }
    }

    // Event listener for AI avatar click
    aiAvatar.addEventListener('click', toggleChatBubble);

    // Initial greeting or message (can be updated later by lang.js)
    // This will be handled by lang.js for dynamic content based on language
    // aiChatBubbleText.textContent = "Chào mừng, Quách Thành Long đang chờ bạn khám phá hồ sơ!";

    // --- Basic AI Response Logic (will be expanded) ---
    // For now, it just toggles the bubble. Later, we can add input fields
    // and more complex conversational logic.

    // Add CSS for language switcher visibility (if not already in futuristic.css)
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-assistant .language-switcher {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            visibility: hidden;
        }
        #ai-assistant .language-switcher.visible {
            opacity: 1;
            transform: translateY(0);
            visibility: visible;
        }
    `;
    document.head.appendChild(style);
});