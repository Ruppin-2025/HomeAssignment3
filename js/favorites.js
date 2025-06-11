// ניהול מועדפים לפי currentUser

const FavoritesPage = {
  currentUser: null,
  favoritesKey: null,
  allApartments: [], 

  init() {
    this.currentUser = Auth.getCurrentUser();
    if (!this.currentUser) {
      Auth.checkAuthentication();
      return;
    }
    this.favoritesKey = `${this.currentUser}_favorites`; 
    this.allApartments = window.amsterdam || [];
    this.displayFavorites();
  },

  getFavoriteIds() {
    const favoriteIds = Storage.get(this.favoritesKey);
    return Array.isArray(favoriteIds) ? favoriteIds : [];
  },

  displayFavorites() {
    const favoritesListContainer = document.getElementById(
      "favoritesListContainer"
    );
    if (!favoritesListContainer) return;

    const favoriteIds = this.getFavoriteIds();
    favoritesListContainer.innerHTML = ""; 

    if (favoriteIds.length === 0) {
      favoritesListContainer.innerHTML =
        "<p class='col-12'>You have no favorite apartments yet.</p>";
      return;
    }

    const favoriteApartments = this.allApartments.filter((apt) =>
      favoriteIds.includes(apt.listing_id.toString())
    );

    favoriteApartments.forEach((apt) => {
      const shortDescription = apt.description
        ? apt.description.split("<br />")[0].substring(0, 100) + "..."
        : "No description available.";

      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${apt.picture_url || "images/default-apartment.jpg"}" class="card-img-top" alt="${apt.name || "Apartment Image"}" onerror="this.onerror=null;this.src='images/default-apartment.jpg';">
          <div class="card-body">
            <h5 class="card-title">${apt.name || "N/A"}</h5>
             <p class="card-text">${shortDescription}</p>
            <p class="card-text"><small class="text-muted">ID: ${apt.listing_id}</small></p>
            <p class="card-text">Price: ${apt.price || "N/A"}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="rent.html?listing_id=${apt.listing_id}" class="btn btn-sm btn-success mr-2">Rent</a>
            <button class="btn btn-sm btn-danger remove-favorite-btn" data-id="${apt.listing_id}">Remove from Favorites</button> 
          </div>
        </div>
      `;
      favoritesListContainer.appendChild(card);
    });

    
    document.querySelectorAll(".remove-favorite-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const listingId = event.target.dataset.id;
        this.removeFromFavorites(listingId);
      });
    });
  },

  removeFromFavorites(listingId) { 
    let favoriteIds = this.getFavoriteIds();
    const listingIdStr = listingId.toString();

    if (
      confirm(
        `Are you sure you want to remove apartment ID ${listingIdStr} from your favorites?`
      )
    ) {
      favoriteIds = favoriteIds.filter((id) => id !== listingIdStr);
      Storage.set(this.favoritesKey, favoriteIds); 
      this.displayFavorites(); 
      alert("Removed from favorites.");
    }
  },
};
