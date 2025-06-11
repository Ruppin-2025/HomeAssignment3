function startJumbotronSlideshow() {
    const images = document.querySelectorAll('.jumbotron-img');

    if (images.length === 0) {
        return;
    }

    let currentImageIndex = 0;

    setInterval(function () {
        images[currentImageIndex].classList.remove('active');

        currentImageIndex = currentImageIndex + 1;
        if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }

        images[currentImageIndex].classList.add('active');

    }, 12000);
}

const darkModeToggle = () => {

    const toggleButtons = document.querySelectorAll('.dark-mode-button');
    const body = document.body;
    
    if (toggleButtons.length === 0) {
        console.error("Dark mode toggle buttons not found.");
        return; 
    }

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }


        toggleButtons.forEach(button => {
            const sunIcon = button.querySelector('.fa-sun');
            const moonIcon = button.querySelector('.fa-moon');
            if (sunIcon && moonIcon) {
                if (theme === 'dark') {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'inline';
                } else {
                    sunIcon.style.display = 'inline';
                    moonIcon.style.display = 'none';
                }
            }
        });
    };
    
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme || 'light'); 
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });
};