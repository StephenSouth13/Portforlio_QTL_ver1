// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for section animations (optional - will add more complex animations later)
    // This can be used to trigger animations when sections come into view
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Add a class when section is visible
            } else {
                entry.target.classList.remove('is-visible'); // Remove class when not visible
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Initial check for sections already in view on load
    sections.forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('is-visible');
        }
    });

    // --- QR Code Generation (requires qrcode.js library) ---
    // You'll need to include qrcode.min.js in your index.html
    // <script src="https://cdn.jsdelivr.net/npm/qrcode.js/qrcode.min.js"></script>

    const qrCodeDiv = document.getElementById('qrCode');
    if (qrCodeDiv) {
        // Link to your main CV website
        const cvLink = "https://stephensouth13.github.io/cv-qtl/";
        
        // Ensure qrcode.js is loaded before trying to use QRCode
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrCodeDiv, {
                text: cvLink,
                width: 128,
                height: 128,
                colorDark : "#00e6ff", // Primary neon color
                colorLight : "#080a1c", // Background color
                correctLevel : QRCode.CorrectLevel.H
            });
        } else {
            console.warn("qrcode.js not loaded. QR Code will not be generated.");
            // Optionally, display a message or alternative content
            qrCodeDiv.innerHTML = "<p>QR Code (loading...)</p>";
        }
    }
});