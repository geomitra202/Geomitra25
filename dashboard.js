function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px"; // Hide Sidebar
    } else {
        sidebar.style.right = "0px"; // Show Sidebar
    }
}

// Redirect to Login Page without Logging Out
window.redirectToLogin = function () {
    window.location.href = "login.html"; // Redirect to Login Page
    
};
window.redirectToProfile = function () {
    window.location.href = "profile.html"; // Redirect to profile Page
    
};


document.addEventListener("DOMContentLoaded", function () {
    const profileLink = document.querySelector('a[href="profile.html"]');
    
    if (profileLink) {
        profileLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "profile.html";
        });
    }
  
});
document.addEventListener("DOMContentLoaded", function () {
    // Assigning the click event to the Start Quiz button
    document.getElementById("startQuizBtn").addEventListener("click", function () {
        // Store quiz started status in localStorage
        localStorage.setItem("quizStarted", "true");

        // Redirect to the quiz page
        window.location.href = "start-quiz.html";
    });
});

