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