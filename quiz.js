let currentQuestion = 0;
const totalQuestions = 10;
let answers = JSON.parse(localStorage.getItem("quizAnswers")) || new Array(totalQuestions).fill("");
let timerDuration = 2 * 60 * 60; // 2 hours in seconds
let timerInterval;
let tabSwitchCount = 0;
let originalWidth = window.screen.width;
let originalHeight = window.screen.height;
let resizeCount = 0;
const minWidth = 800;  // Minimum width allowed for the quiz
const minHeight = 600; // Minimum height allowed
let violationCount = 0; // Unified counter for tab switch + resize
const maxViolations = 1; 
const maxResizeWarnings = 3;// Max allowed violations before auto-submission
// Questions & Notes Data

const questions = [
    {
        question: "What is the capital of France?",
        image: "earth.png",
    },
    {
        question: "Which is the largest ocean on Earth?",
        image: "images/ocean.png",
    },
    {
        question: "At what temperature does water boil?",
        image: "images/boiling.png",
    },
    {
        question: "Which planet is closest to the Sun?",
        image: "images/mercury.png",
    },
    {
        question: "What is the Pythagorean theorem used for?",
        image: "images/pythagoras.png",
    },
    {
        question: "Which element has the symbol 'O'?",
        image: "images/oxygen.png",
    },
    {
        question: "What is Einstein's famous equation?",
        image: "images/einstein.png",
    },
    {
        question: "What is the square root of 64?",
        image: "images/square_root.png",
    },
    {
        question: "How many continents are there on Earth?",
        image: "images/continents.png",
    },
    {
        question: "Who discovered gravity?",
        image: "images/gravity.png",
    }
];


const notes = [
    "The capital city of France is famous for the Eiffel Tower.",
    "Think about the largest body of saltwater on the planet.",
    "Water turns into steam at this temperature under normal conditions.",
    "It is the first planet in the solar system.",
    "It helps calculate the sides of a right triangle.",
    "This element is essential for breathing.",
    "A famous equation by Albert Einstein explains energy and mass.",
    "Multiply the number by itself to get 64.",
    "There are several large landmasses on Earth.",
    "An apple supposedly helped in this scientific discovery."
];

// Save Answer Before Moving
function saveAnswer() {
    const answerBox = document.getElementById("answer-box");
    if (answerBox) {
        answers[currentQuestion] = answerBox.value.trim();
        localStorage.setItem("quizAnswers", JSON.stringify(answers));
    }
}

// Update UI Correctly
function updateQuestionUI() {
    document.getElementById("question-text").innerText = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;

    // ✅ Dynamically update the question image
    const questionImage = document.getElementById("question-image");
    questionImage.src = questions[currentQuestion].image;
    questionImage.alt = "Question Image";

    document.getElementById("answer-box").value = answers[currentQuestion] || "";
    document.getElementById("notes-box").innerText = notes[currentQuestion];

    document.getElementById("prev-btn").disabled = currentQuestion === 0;

    if (currentQuestion === totalQuestions - 1) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("submit-btn").style.display = "inline-block";
    } else {
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("submit-btn").style.display = "none";
    }
}


// Move to Next Question
function nextQuestion() {
    saveAnswer();
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        updateQuestionUI();
    }
}

// Move to Previous Question
function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        updateQuestionUI();
    }
}

// Timer Function
function startTimer(duration) {
    let timeLeft = duration;

    function updateTimerDisplay() {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay(); // Update display initially

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            alert("Time's up! Submitting your quiz...");
            submitQuiz(); // Auto-submit when time runs out
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

// Submit Quiz
function submitQuiz() {
    saveAnswer();
    clearInterval(timerInterval); // Stop timer when submitting

    if (answers.includes("")) {
        alert("Please answer all questions before submitting!");
        return;
    }

    console.log("Submit button function called!"); // Debugging

    if (confirm("Are you sure you want to submit the quiz?")) {
        console.log("User confirmed submission");

        localStorage.setItem("quizSubmitted", "true");
        localStorage.removeItem("quizAnswers");

        setTimeout(() => {
            console.log("Redirecting to score.html");
            window.location.href = "score.html";  // Ensure correct path
        }, 500);
    } else {
        console.log("User canceled submission");
    }
}

// **Tab Change Detection**
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        tabSwitchCount++;
        alert(`Warning! You have switched tabs ${tabSwitchCount} times. Further violations may lead to automatic submission.`);

        if (tabSwitchCount >= 3) {
            alert("You have switched tabs too many times. Your quiz is being submitted.");
            submitQuiz();
        }
    }
});

// **Prevent Right Click to Avoid Copying**
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the quiz.");
});

// **Prevent Copy & Paste**
document.addEventListener("copy", (event) => {
    event.preventDefault();
    alert("Copying content is disabled during the quiz.");
});

document.addEventListener("paste", (event) => {
    event.preventDefault();
    alert("Pasting content is disabled during the quiz.");
});

// **Prevent DevTools Usage**
document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        alert("Developer tools are disabled during the quiz.");
    }
});

// **Detect Split Screen or Window Resize**
window.addEventListener("resize", () => {
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;

    // Check if screen size is reduced below 70% of the original
    if (currentWidth < originalWidth * 0.7 || currentHeight < originalHeight * 0.7) {
        resizeCount++;
        alert(`Warning! Your screen size is too small (${resizeCount}/${maxResizeWarnings} warnings).`);

        if (resizeCount >= maxResizeWarnings) {
            alert("You have resized the window too many times. Your quiz is being submitted.");
            submitQuiz();
        }
    }
});

// **Attach Event Listeners**
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
    document.getElementById("prev-btn").addEventListener("click", prevQuestion);
    document.getElementById("submit-btn").addEventListener("click", submitQuiz);
    updateQuestionUI();
    startTimer(timerDuration); // Start Timer with 2 hours
});
const resumePassword = "123"; // Change this to your desired password

function handleViolation() {
    violationCount++;

    if (violationCount >= maxViolations) {
        document.getElementById("resume-modal").style.display = "block";
    } else {
        alert(`Warning! You have violated the quiz rules ${violationCount}/${maxViolations} times.`);
        
    }
    document.getElementById("resumePassword").value = "";
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        handleViolation();
    }
});
window.addEventListener("resize", () => {
    if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
        handleViolation();
    }
});
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    alert("Right-click is disabled during the quiz.");
});
document.addEventListener("copy", (event) => {
    event.preventDefault();
    alert("Copying content is disabled during the quiz.");
});

document.addEventListener("paste", (event) => {
    event.preventDefault();
    alert("Pasting content is disabled during the quiz.");
});
document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        alert("Developer tools are disabled during the quiz.");
    }
});

function verifyResumePassword() {
    const passwordField = document.getElementById("resume-password");
    const enteredPassword = passwordField.value.trim();

    if (enteredPassword === resumePassword) {
        document.getElementById("resume-modal").style.display = "none";
        violationCount = 0; // Reset violation count after successful resume
    } else {
        alert("Incorrect password. You cannot resume the quiz.");
    }

    // Always clear the password field after an attempt
    passwordField.value = "";
}

