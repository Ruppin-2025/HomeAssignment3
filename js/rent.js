//  ניהול תהליך השכרה של דירה אחת
document.addEventListener("DOMContentLoaded", function(){
let listingId = localStorage.getItem("selectListing");

if(!listingId)
{
    showPopupMessage("Invalid listing id.")
    return;
}

let apartment = null;

for(let i=0; i < amsterdam.length; i++)
{
    if(amsterdam[i].listing_id === listingId)
    {
        apartment = amsterdam[i];
        break;
    }
}

if (apartment !== null)
{
    let listingInfo = document.querySelector("#listing_info");
    listingInfo.innerHTML = "";

    listingInfo.innerHTML = 
    `<img src="${apartment.picture_url}" alt="apartmentImage">` +
    `<h3>${apartment.name}</h3>` +
    `<p><b>Rating:</b> ${apartment.review_scores_rating}</p>` +
    `<p><b>Price per night:</b> ${apartment.price}</p>` +
    `<p><b>Bedrooms:</b> ${apartment.bedrooms}</p>` +
    `<p><b>Beds:</b> ${apartment.beds}</p>` +
    `<p><b>Batrooms:</b> ${apartment.bathrooms_text}</p>` +
    `<p><b>Guests:</b> ${apartment.accommodates}</p>` +
    `<p><b>Neighborhood:</b> ${apartment.neighbourhood_cleansed}</p>`;
}
else{
    showPopupMessage("apartment not found.");
    return;
}


function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

function checkAvailability(listingId, startDate, endDate) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
      if (key.endsWith('_bookings')) {
        const bookingsString = localStorage.getItem(key);
        let bookings = [];

        try { bookings = JSON.parse(bookingsString);
            if (!Array.isArray(bookings)) {
                    bookings = [];} 
            } 
        catch(e){ 
            console.error("Error parsing bookings from localStorage for key:", key, e);
            continue; 
        } 
            for (const booking of bookings) {
                if (booking.listingId === listingId) {
                    if (isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
function saveBooking(currentUser, listingId, startDate, endDate){
    const userBookingsKey = `${currentUser.username}_bookings`;
    const userBookings = JSON.parse(localStorage.getItem(userBookingsKey)) || [];

    const newBooking = {
        listingId: listingId,
        startDate: startDate,
        endDate: endDate
    };

    userBookings.push(newBooking);
localStorage.setItem(userBookingsKey, JSON.stringify(userBookings));
}

let mapContainer = document.getElementById("map");
if (mapContainer) {
    let map = L.map('map').setView([apartment.latitude, apartment.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([apartment.latitude, apartment.longitude]).addTo(map)
        .bindPopup('Location of your apartment')
        .openPopup();
} else {
    console.error("Map container not found!");
}
})
