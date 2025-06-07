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
    }}