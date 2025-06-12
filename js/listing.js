// הצגת רשימת דירות (כרטיסים, סינון וכו')

const Listing = {
  apartmentsData: [],
  currentUser: null,
  favoritesKey: null,

  init() {
    this.currentUser = Auth.getCurrentUser();
    if (!this.currentUser) {
      Auth.checkAuthentication();
      return;
    }
    this.favoritesKey = `${this.currentUser}_favorites`;
    this.apartmentsData = window.amsterdam || [];

    this.calculateAndDisplayStats();
    this.populateRoomFilter();
    this.populatePriceFilter();
    this.displayListings(this.apartmentsData);

    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
      filterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFilter();
      });
    }
  },

  calculateAndDisplayStats() {
    const totalApartmentsEl = document.getElementById('totalApartments');
    const averageRatingEl = document.getElementById('averageRating');
    const averagePriceEl = document.getElementById('averagePrice');
    const apartments = this.apartmentsData;
    const totalCount = apartments.length;

    if (!totalApartmentsEl || !averageRatingEl || !averagePriceEl) {
      console.error("One or more statistics display elements were not found in the HTML.");
      return;
    }
    if (totalCount === 0) {
      totalApartmentsEl.textContent = '0';
      averageRatingEl.textContent = 'N/A';
      averagePriceEl.textContent = 'N/A';
      return;
    }
    totalApartmentsEl.textContent = totalCount;
    let ratingSum = 0;
    let ratingsCount = 0;
    apartments.forEach(apt => {
      const rating = parseFloat(apt.review_scores_rating);
      if (!isNaN(rating)) {
        ratingSum += rating;
        ratingsCount++;
      }
    });
    const avgRating = ratingsCount > 0 ? (ratingSum / ratingsCount).toFixed(2) : 'N/A';
    averageRatingEl.textContent = avgRating !== 'N/A' ? `${avgRating} / 5.0` : 'N/A';
    let priceSum = 0;
    let pricesCount = 0;
    apartments.forEach(apt => {
      if (apt.price) {
        const price = parseFloat(apt.price.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(price)) {
          priceSum += price;
          pricesCount++;
        }
      }
    });
    const avgPrice = pricesCount > 0 ? (priceSum / pricesCount).toFixed(2) : 'N/A';
    averagePriceEl.textContent = avgPrice !== 'N/A' ? `$${avgPrice}` : 'N/A';
  },

  populateRoomFilter() {
    const roomSelect = document.getElementById("numRooms");
    if (!roomSelect) return;
    const uniqueRoomCounts = [
      ...new Set(
        this.apartmentsData
          .map((apt) => parseInt(apt.bedrooms))
          .filter((count) => !isNaN(count))
      ),
    ].sort((a, b) => a - b);
    uniqueRoomCounts.forEach((count) => {
      const option = document.createElement("option");
      option.value = count;
      option.textContent = count;
      roomSelect.appendChild(option);
    });
  },

  populatePriceFilter() {
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (!minPriceInput || !maxPriceInput) {
      return;
    }
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    this.apartmentsData.forEach(apt => {
      if (apt.price) {
        const price = parseFloat(apt.price.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(price)) {
          if (price < minPrice) minPrice = price;
          if (price > maxPrice) maxPrice = price;
        }
      }
    });
    if (minPrice !== Infinity && maxPrice !== -Infinity) {
      minPriceInput.placeholder = `From $${Math.floor(minPrice)}`;
      maxPriceInput.placeholder = `Up to $${Math.ceil(maxPrice)}`;
    }
  },

  getFavorites() {
    return Storage.get(this.favoritesKey) || [];
  },

  isFavorite(listingId) {
    const favorites = this.getFavorites();
    return favorites.includes(listingId.toString());
  },

  toggleFavorite(listingId) {
    let favorites = this.getFavorites();
    const listingIdStr = listingId.toString();
    const favButton = document.querySelector(
      `.favorite-btn[data-id='${listingIdStr}']`
    );
    if (favorites.includes(listingIdStr)) {
      favorites = favorites.filter((id) => id !== listingIdStr);
      if (favButton) favButton.textContent = "Add To Favorites";
    } else {
      favorites.push(listingIdStr);
      if (favButton) favButton.textContent = "Remove From Favorites";
    }
    Storage.set(this.favoritesKey, favorites);
  },

  displayListings(apartmentsToDisplay) {
    const listingsContainer = document.getElementById("listingsContainer");
    const countElement = document.getElementById("apartmentCount");

    if (countElement) {
      countElement.textContent = apartmentsToDisplay.length;
    }

    if (!listingsContainer) return;
    listingsContainer.innerHTML = "";

    if (apartmentsToDisplay.length === 0) {
      listingsContainer.innerHTML =
        "<p class='col-12'>No apartments match your criteria.</p>";
      return;
    }

    apartmentsToDisplay.forEach((apt) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      const shortDescription = apt.description
        ? apt.description.split("<br />")[0].substring(0, 100) + "..."
        : "No description available.";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${apt.picture_url || "images/default-apartment.jpg"}" class="card-img-top" alt="${apt.name || "Apartment Image"}" onerror="this.onerror=null;this.src='images/default-apartment.jpg';">
          <div class="card-body">
            <h5 class="card-title">${apt.name || "N/A"}</h5>
            <p class="card-text">${shortDescription}</p>
            <p class="card-text"><small class="text-muted">ID: ${apt.listing_id}</small></p>
            <p class="card-text">Price: ${apt.price || "N/A"}</p>
            <p class="card-text">Rating: ${apt.review_scores_rating ? apt.review_scores_rating + "/5" : "N/A"}</p>
            <p class="card-text">Rooms: ${apt.bedrooms || "N/A"}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <a href="${apt.listing_url}" target="_blank" class="btn btn-sm btn-outline-info mr-2">View Details</a>
            <a href="rent.html?listing_id=${apt.listing_id}" class="btn btn-sm btn-success mr-2 rent-btn">Rent</a>
            <button class="btn btn-sm btn-warning favorite-btn" data-id="${apt.listing_id}">
              ${this.isFavorite(apt.listing_id) ? "Remove From Favorites" : "Add To Favorites"}
            </button>
          </div>
        </div>
      `;
      listingsContainer.appendChild(card);
    });

    document.querySelectorAll(".favorite-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const listingId = event.target.dataset.id;
        this.toggleFavorite(listingId);
      });
    });
  },

  handleFilter() {
    const minRating = parseFloat(document.getElementById("minRating").value) || 0;
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const numRooms = document.getElementById("numRooms").value
      ? parseInt(document.getElementById("numRooms").value)
      : null;

    const filteredApartments = this.apartmentsData.filter((apt) => {
      const rating = apt.review_scores_rating ? parseFloat(apt.review_scores_rating) : 0;
      const rooms = apt.bedrooms ? parseInt(apt.bedrooms) : 0;

      let price = null;
      if (apt.price) {
        const parsedPrice = parseFloat(apt.price.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(parsedPrice)) {
          price = parsedPrice;
        }
      }

      if (price === null && (minPrice > 0 || maxPrice !== Infinity)) {
        return false;
      }

      const ratingMatch = rating >= minRating;
      const priceMatch = price >= minPrice && price <= maxPrice;
      const roomsMatch = (numRooms === null || rooms === numRooms);

      return ratingMatch && priceMatch && roomsMatch;
    });

    this.displayListings(filteredApartments);
  },
};