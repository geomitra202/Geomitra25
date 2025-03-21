import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5T5bGTl_yhX2He0vX87lp1_mpS82TRsg",
    authDomain: "login-form-98bfb.firebaseapp.com",
    projectId: "login-form-98bfb",
    storageBucket: "login-form-98bfb.firebasestorage.app",
    messagingSenderId: "83414592931",
    appId: "1:83414592931:web:f5aca4a8c4c2f63935fe16",
    measurementId: "G-QZ41Q89997"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        console.log("Auth State Changed: ", user); // Debugging

        if (!user) {
            alert("User not logged in. Redirecting...");
            window.location.href = "login.html";
            return;
        }

        try {
            console.log("Fetching Firestore data...");
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log("User data retrieved:", userData);

                document.getElementById("profileName").textContent = `${userData.firstName} `;
                document.getElementById("profileEmail").textContent = userData.email;
                document.getElementById("lastName").textContent = userData.lastName || "N/A";
                document.getElementById("profileLogo").textContent = userData.firstName.charAt(0).toUpperCase();
            } else {
                console.error("User data not found in Firestore");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });

    // Logout Functionality
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth).then(() => {
                localStorage.removeItem("loggedInUserId");
                window.location.href = "login.html";
            }).catch(error => {
                console.error("Logout Error:", error);
            });
        });
    }

    // Back Button Function
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "dashboard.html";
        });
    }
});
