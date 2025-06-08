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
}}