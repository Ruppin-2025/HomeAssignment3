// פונקציות כלליות לעבודה עם localStorage

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

//מעבר לעמוד
function RentClick(listingId){
    localStorage.setItem("selectListing" , listingId);
    window.location.href = "rent.html";
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
