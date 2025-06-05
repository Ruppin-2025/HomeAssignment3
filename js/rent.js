//  ניהול תהליך השכרה של דירה אחת


/**
 * פונקציית עזר לבדיקת חפיפה בין שני טווחי תאריכים.
 * מחזירה true אם יש חפיפה, false אם אין.
 * @param {string} start1 - תאריך התחלה של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} end1 - תאריך סיום של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} start2 - תאריך התחלה של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @param {string} end2 - תאריך סיום של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @returns {boolean} - האם יש חפיפה בין הטווחים
 */
function isDateRangeOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return !(e1 < s2 || s1 > e2);
}

/**
 * בודק האם הטווח שהתבקש פנוי להשכרה בדירה מסוימת.
 * @param {string} listingId - מזהה הדירה
 * @param {string} startDate - תאריך התחלה שנבחר להשכרה
 * @param {string} endDate - תאריך סיום שנבחר להשכרה
 * @returns {boolean} - true אם הזמנים פנויים, false אם יש חפיפה
 */
function checkAvailability(listingId, startDate, endDate) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_bookings")) { 
      const userBookings = Storage.get(key); 
      if (Array.isArray(userBookings)) {
        for (const booking of userBookings) {
          if (
            booking.listingId === listingId && 
            isDateRangeOverlap( 
              startDate,
              endDate,
              booking.startDate,
              booking.endDate
            )
          ) {
            return false; 
          }
        }
      }
    }
  }
  return true; 
}

const RentPage = {
  apartmentData: null,
  listingId: null,
  currentUser: null,

  init() {
    this.currentUser = Auth.getCurrentUser();
    if (!this.currentUser) {
      Auth.checkAuthentication();
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    this.listingId = urlParams.get("listing_id");

    if (!this.listingId) {
      document.getElementById("apartmentDetailsContainer").innerHTML =
        "<p class='col-12'>Apartment ID not found.</p>";
      return;
    }

    this.apartmentData = window.amsterdam.find(
      (apt) => apt.listing_id === this.listingId
    );

    if (!this.apartmentData) {
      document.getElementById("apartmentDetailsContainer").innerHTML =
        "<p class='col-12'>Apartment details not found.</p>";
      return;
    }

    this.displayApartmentDetails();
    this.setupBookingForm();
    this.setMinDates();
  },

  setMinDates() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("startDate").setAttribute("min", today);
    document.getElementById("endDate").setAttribute("min", today);

    document.getElementById("startDate").addEventListener("change", function() {
        const startDateValue = this.value;
        document.getElementById("endDate").setAttribute("min", startDateValue);
        if (document.getElementById("endDate").value < startDateValue) {
            document.getElementById("endDate").value = startDateValue;
        }
    });
  },

  displayApartmentDetails() {
    const container = document.getElementById("apartmentDetailsContainer");
    const apt = this.apartmentData;
    
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${apt.picture_url || "images/default-apartment.jpg"}" class="img-fluid rounded" alt="${apt.name}" onerror="this.onerror=null;this.src='images/default-apartment.jpg';">
      </div>
      <div class="col-md-6">
        <h2>${apt.name || "N/A"}</h2>
        <p><strong>Price:</strong> ${apt.price || "N/A"}</p>
        <p><strong>Rating:</strong> ${apt.review_scores_rating ? apt.review_scores_rating + "/5" : "N/A"}</p>
        <p><strong>Type:</strong> ${apt.property_type || "N/A"} - ${apt.room_type || "N/A"}</p>
        <p><strong>Accommodates:</strong> ${apt.accommodates || "N/A"}</p>
        <p><strong>Bedrooms:</strong> ${apt.bedrooms || "N/A"}, <strong>Beds:</strong> ${apt.beds || "N/A"}</p>
        <p><strong>Bathrooms:</strong> ${apt.bathrooms_text || "N/A"}</p>
        <p><strong>Description:</strong></p>
        <div>${apt.description ? apt.description.replace(/<br\s*\/?>/gi, '\n') : "No detailed description available."}</div>
        <p class="mt-3"><a href="${apt.listing_url}" target="_blank" class="btn btn-info">View on Airbnb</a></p>
      </div>
    `;
  },

  setupBookingForm() {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
      bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleBooking();
      });
    }
  },

  handleBooking() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const messageElement = document.getElementById("bookingMessage");

    if (!startDate || !endDate) {
      messageElement.textContent = "Please select both start and end dates.";
      messageElement.className = "mt-3 text-danger";
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        messageElement.textContent = "End date must be after start date.";
        messageElement.className = "mt-3 text-danger";
        return;
    }


    const isAvailable = checkAvailability(this.listingId, startDate, endDate);

    if (isAvailable) {
      const bookingsKey = `${this.currentUser}_bookings`;
      let userBookings = Storage.get(bookingsKey) || [];
      if (!Array.isArray(userBookings)) {
          userBookings = [];
      }
      
      const newBooking = {
        listingId: this.listingId, 
        startDate: startDate, 
        endDate: endDate, 
        apartmentName: this.apartmentData.name, 
        apartmentPicture: this.apartmentData.picture_url, 
      };
      userBookings.push(newBooking);
      Storage.set(bookingsKey, userBookings); 

      messageElement.textContent =
        "Booking successful! You will be redirected shortly.";
      messageElement.className = "mt-3 text-success";
      setTimeout(() => {
        window.location.href = "mybookings.html";
      }, 2000);
    } else {
      messageElement.textContent =
        "Selected dates are not available for this apartment. Please choose different dates.";
      messageElement.className = "mt-3 text-danger";
    }
  },
};