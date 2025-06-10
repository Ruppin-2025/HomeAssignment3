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
    usernameDisplay.textContent = `Welcome, ${currentUser.username}`;
}

document.addEventListener("DOMContentLoaded", function() {


    if (window.amsterdam && Array.isArray(window.amsterdam)) {
        displayListings(amsterdam);
    } else {
        console.error("Amsterdam data not found!");
    }

    // הצגת הדירות בדף
    function displayListings(listings) {
        const listingsContainer = document.getElementById('listings');

        listingsContainer.innerHTML = "";

        for (let i =0; i < listings.length; i++) {
        let apartment = listings[i];

        let card = document.createElement("div");
        card.className="Card-listings";

            card.innerHTML = 
                `<img src="${apartment.picture_url}" alt="apartmentImage">` +
                `<h3>${apartment.name}</h3>` +
                `<p><b>Id:</b> ${apartment.listing_id}</p>` +
                `<p><b>Description:</b> <br> ${apartment.description}</p>` +
                `<a href="${apartment.listing_url}" target="_blank" class="card_link" >View Apartment </a>` +
                `<button class="favoriteBtn">Add to favorites <i class="fa-solid fa-heart"></i></button>` +
                `<button class="rentBtn">Rent <i class="fa-solid fa-house"></i></button>`;

            listingsContainer.appendChild(card);
        }    
    }
 displayListings(amsterdam);

    const filterBtn = document.getElementById("filterBtn");
    filterBtn.addEventListener("click" , function(event){
        event.preventDefault();
    })

    filterBtn.addEventListener("click", function() {
        let minRating = parseFloat(document.getElementById("rating").value);
        if(isNaN(minRating)){
            minRating = 0;
        }
        let minPrice = parseFloat(document.getElementById("minPrice").value);
        if(isNaN(minPrice)){
            minPrice = 0;
        }
        let maxPrice = parseFloat(document.getElementById("maxPrice").value);
        if(isNaN(maxPrice)){
            maxPrice =Infinity;
        }
        let rooms = Number(document.getElementById("rooms").value);
        if (isNaN(rooms)){
            rooms = 1; 
        }

        const filtered = [];

        for (let i = 0; i <amsterdam.length; i++)
        {
            const apartment = amsterdam[i];
            const cleanPrice = parseFloat(apartment.price.replace(/[^0-9.]/g, ""));

            if(parseFloat(apartment.review_scores_rating) >= minRating &&
            cleanPrice >= minPrice && 
            cleanPrice <= maxPrice &&
            Number(apartment.bedrooms) === Number(rooms))
            {
                filtered.push(apartment);
            }
        }
        displayListings(filtered);
    })
})

document.addEventListener("DOMContentLoaded", function() {
    const roomsSelect = document.getElementById("rooms");
    const minRooms = 1;
    const maxRooms = 10;

    for (let i = minRooms; i <= maxRooms; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        roomsSelect.appendChild(option);
    }

    if (window.amsterdam && Array.isArray(window.amsterdam)) {
        const totalElement = document.createElement("h1");
        totalElement.textContent = `Total apartments in Amsterdam: ${window.amsterdam.length}`;
        totalElement.classList.add("total-info");

       const section = document.querySelector("section");
       section.insertBefore(totalElement , section.firstChild);
}})


