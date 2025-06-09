function toggelMenu() {
    const hamburgerBtn = document.querySelector("#hamburgerBtn");
    const icon = hamburgerBtn.querySelector("i");
    const navLinks = document.querySelector(".navLinks");

    navLinks.classList.toggle("show");

    if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
    }
}


// יציאה מהחשבון
const signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
})

// בדיקה אם המשתמש מחובר
const currentUserStr = localStorage.getItem("currentUser");
const usernameDisplay = document.getElementById("usernameDisplay");

if (!currentUserStr) {
    window.location.href = "login.html";
} else {
    const currentUser = JSON.parse(currentUserStr);
    usernameDisplay.textContent = `Hello, ${currentUser.username}`;
}


document.addEventListener("DOMContentLoaded", function() {
const filterBtn = document.getElementById("filterBtn");


    // נתוני הדירות לדוגמה (יש להחליף עם amsterdam.js)
    // const apartments = [
    //     { id: 1, name: "Luxury Apartment", price: 100, rating: 5, rooms: 2, img: "apartment1.jpg" },
    //     { id: 2, name: "Cozy Studio", price: 50, rating: 4, rooms: 1, img: "apartment2.jpg" }
    // ];

    // הצגת הדירות בדף
    function displayListings(listings) {
        const listingsContainer = document.getElementById("listings");

        listingsContainer.innerHTML = "";

        for (let i =0; i < listings.length; i++) {
        let apartment = listings[i];

        let card = document.createElement("div");
        card.className("Card-listing");

            card.innerHTML = 
                '<img src="${apartment.picture_url}" alt="apartmentImage">' +
                '<h2>${apartment.name}</h2>' +
                '<p>Id:${apartment.listing_id}</p>' +
                '<p>Price: ${apartment.price}</p>' +
                '<p>Rating:${apartment.rating}</p>' +
                '<p>Rooms:${apartment.rooms}</p>' +
                '<button class="favoriteBtn">Add to Favorites</button>' +
                '<button class="rentBtn">Rent</button>';
        
            listingsContainer.appendChild(card);
        }    
    }

    filterBtn.addEventListener("click", () => {
        const minRating = parseInt(document.getElementById("rating").value) || 0;
        const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
        const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
        const rooms = parseInt(document.getElementById("rooms").value) || 1;

        const filtered = apartments.filter(apartment => 
            apartment.rating >= minRating &&
            apartment.price >= minPrice &&
            apartment.price <= maxPrice &&
            apartment.rooms === rooms
        );

        displayListings(filtered);
    });

    displayListings(apartments);

})

document.addEventListener("DOMContentLoaded", () => {
    const roomsSelect = document.getElementById("rooms");


    const roomsSelect = document.getElementById("rooms");
    const minRooms = 1;
    const maxRooms = 10;

    for (let i = minRooms; i <= maxRooms; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i} Room${i > 1 ? 's' : ''}`;
        roomsSelect.appendChild(option);
    }

    if (window.amsterdam && Array.isArray(window.amsterdam)) {
        const total = window.amsterdam.length;
        const totalElement = document.createElement("h1");
        totalElement.textContent = `Total apartments in Amsterdam: ${total}`;
        totalElement.classList.add("total-info");


    section.insertBefore(totalElement , section.firstChild);
})


