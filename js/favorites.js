function loadFavorites() {
    var container = document.getElementById('favorites-container');
    container.innerHTML = '';

    var favorites = JSON.parse(localStorage.getItem('favorites'));
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<p>No favorites added yet.</p>';
        return;}

    for (var i = 0; i < favorites.length; i++) {
        var id = favorites[i];
        for (var j = 0; j < listings.length; j++) {
            if (listings[j].id === id) {
                var item = listings[j];

                var card = document.createElement('div');
                card.className = 'card';

                var img = document.createElement('img');
                img.src = item.picture_url;
                img.alt = item.name;

                var title = document.createElement('h3');
                title.textContent = item.name;

                var desc = document.createElement('p');
                desc.textContent = item.description;

                var btn = document.createElement('button');
                btn.textContent = 'Remove';
                btn.onclick = (function(id) {
                    return function() {
                        removeFavorite(id);
                    };
                })(item.id);

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(desc);
                card.appendChild(btn);

                container.appendChild(card);
                break;}}}}

function removeFavorite(id) {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var newFavorites = [];

    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] !== id) {
            newFavorites.push(favorites[i]);}}

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    loadFavorites();}

window.onload = function() {
    var currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';} 
    else {
        loadFavorites();}};


