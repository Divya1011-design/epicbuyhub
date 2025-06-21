// Get elements
const loginBtn = document.getElementById("login");
const loginPage = document.querySelector(".loginPage");
const logedBtn = document.getElementById("loged");

// Show login form or logout
loginBtn.addEventListener("click", () => {
  if (loginBtn.textContent === "Logout") {
    // Logging out
    localStorage.removeItem("loggedIn");
    loginBtn.textContent = "Log In";
    alert("Logged out successfully.");
  } else {
    // Toggle login box
    loginPage.style.display = loginPage.style.display === "block" ? "none" : "block";
  }
});

// Handle login
logedBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  if (email && pass) {
    localStorage.setItem("loggedIn", "true");
    loginPage.style.display = "none";
    loginBtn.textContent = "Logout";
    alert("Login successful!");
  } else {
    alert("Please fill in both fields.");
  }
});

// Auto set login state on page load
window.onload = () => {
  if (localStorage.getItem("loggedIn") === "true") {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Log In";
  }

  loginPage.style.display = "none"; // Hide login box on load
};


