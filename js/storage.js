// פונקציות כלליות לעבודה עם localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    const nameP = document.getElementById("userName");
  if (nameP) {
    nameP.textContent = currentUser.name;
  }
} else {
    window.location.href = "login.html";
}

const signOutBtn = document.getElementById("SignOut");
if (signOutBtn) {
  signOutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}