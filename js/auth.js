//  הרשמה והתחברות (usersList, currentUser)

const Auth = {
  usersListKey: "usersList",
  currentUserKey: "currentUser",

  init() {
    if (!Storage.get(this.usersListKey)) {
      Storage.set(this.usersListKey, []);
    }
  },

  register(username, password) {
    this.init(); 
    const users = Storage.get(this.usersListKey) || []; 

    if (users.find((user) => user.username === username)) {
      return { success: false, message: "Username already exists." }; 
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.", 
      };
    }

    users.push({ username, password });
    Storage.set(this.usersListKey, users); 
    return { success: true, message: "Registration successful!" };
  },

  login(username, password) {
    this.init(); 
    const users = Storage.get(this.usersListKey) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      Storage.set(this.currentUserKey, user.username); 
      return { success: true, message: "Login successful!" };
    } else {
      return {
        success: false,
        message: "Invalid username or password.", 
      };
    }
  },

  logout() {
    Storage.remove(this.currentUserKey);
    
  },

  getCurrentUser() {
    return Storage.get(this.currentUserKey);
  },

  checkAuthentication() {
    
    
    const onAuthPage =
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("register.html");

    if (!this.getCurrentUser() && !onAuthPage) {
      window.location.href = "login.html"; 
    }
  },
};

Auth.init(); 