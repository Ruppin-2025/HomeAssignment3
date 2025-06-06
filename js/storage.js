// פונקציות כלליות לעבודה עם localStorage
const keyCurrentUser = "currentUser";
const currentUser = JSON.parse(localStorage.getItem(keyCurrentUser));

if (currentUser) {
    const nameP = document.getElementById("userName");
    //העפתי את ה if כי אין בו צורך ברגע שראיתי שיש currentUser זה מספיק כדי לדעת שהמשתמש מחובר
    nameP.textContent = currentUser.name;
} 
else {
    window.location.href = "login.html";
}

const signOutBtn = document.getElementById("SignOut");
if (signOutBtn) {
  signOutBtn.addEventListener("click", function () {
    localStorage.removeItem(keyCurrentUser);
    window.location.href = "login.html";
  });
}