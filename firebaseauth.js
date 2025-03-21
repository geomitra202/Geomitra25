// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } 
 from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
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

// ✅ Function to check if email is nmamit.in domain
function isNmamitEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@nmamit\.in$/.test(email);
}

// ✅ Function to display messages
function showMessage(message, divId, color = "red") {
    var messageDiv = document.getElementById(divId);
    if (!messageDiv) return;
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.color = color;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// ✅ Register User Function
document.getElementById('submitSignUp')?.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPassword').value.trim();
    const firstName = document.getElementById('fName').value.trim();
    const lastName = document.getElementById('lName').value.trim();
    const usn = document.getElementById('usn').value.trim();

    if (!isNmamitEmail(email)) {
        showMessage('Only @nmamit.in email addresses are allowed.', 'signUpMessage');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return setDoc(doc(db, "users", user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                usn: usn
            });
        })
        .then(() => {
            showMessage('Registration successful! Please sign in.', 'signUpMessage', 'green');
            setTimeout(() => window.location.href = 'login.html', 2000); // Redirect after 2s
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'signUpMessage');
            }
        });
});

// ✅ Login Function
document.getElementById('submitSignIn')?.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!isNmamitEmail(email)) {
        showMessage('Only @nmamit.in email addresses are allowed.', 'signInMessage');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.setItem('loggedInUserId', userCredential.user.uid);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist: ' + error.message, 'signInMessage');
            }
        });
});

// ✅ Recover Password Function
function recoverPassword() {
    const emailInput = document.getElementById("recoverEmail");
    const message = document.getElementById("recoverMessage");

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!email) {
        message.textContent = "Please enter your email.";
        message.style.color = "red";
        return;
    }

    if (!isNmamitEmail(email)) {
        message.textContent = "Only @nmamit.in email addresses are allowed.";
        message.style.color = "red";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            message.textContent = "Password reset link sent! Check your email.";
            message.style.color = "green";
        })
        .catch((error) => {
            message.textContent = "Error: " + error.message;
            message.style.color = "red";
        });
}

// ✅ Password Visibility Toggle
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            let input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                this.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    // Attach recover password function to button
    document.getElementById("recoverBtn")?.addEventListener("click", recoverPassword);
});
