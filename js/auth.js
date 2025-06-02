//  הרשמה והתחברות (usersList, currentUser)

function Registration(){
    window.location.href = "register.html";
}

function SignUp(){
    const userName = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if(!userName || !password){
    alert("Please fill in both username and password.");
    return;}

    if (password.length < 8){
        alert ("The password must have a minimum of 8 characters.");
        return;
    }

    let usersList = localStorage.getItem("usersList");
    if (usersList){
    usersList = JSON.parse(usersList);
    }
    else{
    usersList = []; }


    for (let i =0; i < usersList.length; i++)
    {
        if(usersList[i].username === userName)
        {
            alert ("The username already exists in the system. Please try again.");
            return;
        }
    }

usersList.push({username: userName, password: password});
localStorage.setItem("usersList" , JSON.stringify(usersList));


alert("Registration successful! You can now log in.");
window.location.href = "login.html";
}

function LogIn(){
const userName = document.querySelector("#username").value;
const password = document.querySelector("#password").value;

let usersList = localStorage.getItem("usersList");

if (usersList){
    usersList = JSON.parse(usersList);
}
else{
    usersList = [];
}

if(!userName || !password){
 alert("Please fill in both username and password.");
 return;
}

let user = null;
for (let i=0 ; i< usersList.length; i++)
{
    if(usersList[i].username === userName && usersList[i].password === password)
    {
        user = usersList[i];
        break;
    }
}

if (user === null) {
    alert("Incorrect username or password, or the user is not registered.");
    return;
}

localStorage.setItem("currentUser", JSON.stringify(user));
window.location.href = "index.html";
}