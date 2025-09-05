const questions = [
    {
        question: "What is HTML used for?",
        options: ["Styling web pages", "Creating website structure", "Adding interactivity"],
        answer: 1, // Index of the correct answer
        timer: 15 // Time limit in seconds
    },
    {
        question: "Which programming language adds interactivity to a website?",
        options: ["HTML", "CSS", "JavaScript"],
        answer: 2,
        timer: 15
    },
    {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax"],
        answer: 1,
        timer: 15
    },
    {
        question: "Which tag is used to create an unordered list in HTML?",
        options: ["<ol>", "<li>", "<ul>"],
        answer: 2,
        timer: 15
    },
    {
        question: "What is the purpose of the <title> tag?",
        options: ["Defines a heading", "Specifies the page's title in the browser tab", "Creates a link"],
        answer: 1,
        timer: 15
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;

const quizContainer = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const resultsEl = document.getElementById('results');
const timerEl = document.getElementById('time');

function startTimer(time) {
    timerEl.textContent = time;
    timer = setInterval(() => {
        time--;
        timerEl.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            handleAnswer(null); // No answer submitted, mark as incorrect
        }
    }, 1000);
}

function displayQuestion() {
    clearInterval(timer);
    const questionData = questions[currentQuestionIndex];
    quizContainer.innerHTML = `
        <div class="question">${questionData.question}</div>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <button class="option-btn" data-index="${index}">${option}</button>
            `).join('')}
        </div>
    `;
    startTimer(questionData.timer);
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', () => handleAnswer(parseInt(button.dataset.index)));
    });
    nextBtn.style.display = 'none';
    resultsEl.style.display = 'none';
}

function handleAnswer(selectedIndex) {
    clearInterval(timer);
    const questionData = questions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option-btn');

    if (selectedIndex === questionData.answer) {
        score++;
        optionButtons[selectedIndex].classList.add('correct');
    } else {
        if (selectedIndex !== null) {
            optionButtons[selectedIndex].classList.add('incorrect');
        }
        // Show the correct answer
        optionButtons[questionData.answer].classList.add('correct');
    }

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    quizContainer.innerHTML = '';
    nextBtn.style.display = 'none';
    resultsEl.style.display = 'block';
    resultsEl.innerHTML = `Quiz Complete! You scored ${score} out of ${questions.length}.`;
    saveResultsToLocalStorage(score);
}

// Function to save results (can be improved)
function saveResultsToLocalStorage(finalScore) {
    let results = JSON.parse(localStorage.getItem('quizResults')) || [];
    results.push({ score: finalScore, timestamp: new Date().toLocaleString() });
    localStorage.setItem('quizResults', JSON.stringify(results));
}

displayQuestion();