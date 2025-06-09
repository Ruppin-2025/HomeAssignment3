//  הוספה/ביטול השכרות, לפי currentUser


const BookingsPage = {
  currentUser: null,
  bookingsKey: null,

  init() {
    this.currentUser = Auth.getCurrentUser();
    if (!this.currentUser) {
      Auth.checkAuthentication();
      return;
    }
    this.bookingsKey = ${this.currentUser}_bookings;
    this.displayBookings();
  },

  getBookings() {
    const bookings = Storage.get(this.bookingsKey);
    return Array.isArray(bookings) ? bookings : [];
  },

  displayBookings() {
    const bookingsListContainer = document.getElementById(
      "bookingsListContainer"
    );
    if (!bookingsListContainer) return;

    const bookings = this.getBookings();
    bookingsListContainer.innerHTML = ""; 

    if (bookings.length === 0) {
      bookingsListContainer.innerHTML =
        "<p class='col-12'>You have no bookings.</p>";
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    bookings.forEach((booking, index) => {
      const bookingStartDate = new Date(booking.startDate);
      const bookingEndDate = new Date(booking.endDate); 

      let status = "";
      let statusClass = "";
      
      if (bookingEndDate < today) {
        status = "Past";
        statusClass = "text-muted";
      } else if (bookingStartDate > today) {
        status = "Future";
        statusClass = "text-success";
      } else {
        status = "Ongoing";
        statusClass = "text-primary";
      }


      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
        <div class="card h-100 booking-card">
          <img src="${booking.apartmentPicture || "images/default-apartment.jpg"}" class="card-img-top" alt="${booking.apartmentName || "Apartment"}" onerror="this.onerror=null;this.src='images/default-apartment.jpg';">
          <div class="card-body">
            <h5 class="card-title">${booking.apartmentName || "Apartment ID: " + booking.listingId}</h5>
            <p class="card-text"><strong>Dates:</strong> ${booking.startDate} to ${booking.endDate}</p>
            <p class="card-text"><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
            ${
              (status === "Future" || status === "Ongoing") 
                ? <button class="btn btn-danger btn-sm cancel-booking-btn" data-booking-index="${index}">Cancel Booking</button> 
                : ""
            }
          </div>
        </div>
      `;
      bookingsListContainer.appendChild(card);
    });

    
    document.querySelectorAll(".cancel-booking-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const bookingIndex = parseInt(event.target.dataset.bookingIndex);
        this.cancelBooking(bookingIndex);
      });
    });
  },

  cancelBooking(index) { 
    let bookings = this.getBookings();
    const bookingToCancel = bookings[index];
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const bookingStartDate = new Date(bookingToCancel.startDate);

    
    if (bookingStartDate < today) { 
        alert("Cannot cancel past bookings.");
        return;
    }

    if (
      confirm(
        Are you sure you want to cancel your booking for "${bookingToCancel.apartmentName || bookingToCancel.listingId}" from ${bookingToCancel.startDate} to ${bookingToCancel.endDate}?
      )
    ) {
      bookings.splice(index, 1);
      Storage.set(this.bookingsKey, bookings);
      this.displayBookings(); 
      alert("Booking cancelled successfully.");
    }
  }
};