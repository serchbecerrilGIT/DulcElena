const questions = [
    {
        question: "¿Para qué se utiliza HTML?",
        options: ["Para estilizar páginas web", "Para crear la estructura del sitio web", "Para agregar interactividad"],
        answer: 1, // Índice de la respuesta correcta
        timer: 15 // Límite de tiempo en segundos
    },
    {
        question: "¿Qué lenguaje de programación agrega interactividad a un sitio web?",
        options: ["HTML", "CSS", "JavaScript"],
        answer: 2,
        timer: 15
    },
    {
        question: "¿Qué significa CSS?",
        options: ["Hojas de estilo creativas", "Hojas de estilo en cascada", "Sintaxis de estilo de computadora"],
        answer: 1,
        timer: 15
    },
    {
        question: "¿Qué etiqueta se utiliza para crear una lista desordenada en HTML?",
        options: ["<ol>", "<li>", "<ul>"],
        answer: 2,
        timer: 15
    },
    {
        question: "¿Cuál es el propósito de la etiqueta <title>?",
        options: ["Define un encabezado", "Especifica el título de la página en la pestaña del navegador", "Crea un enlace"],
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
            handleAnswer(null); // No se envió respuesta, marcar como incorrecta
        }
    }, 1000);
}

function displayQuestion() {
    clearInterval(timer);
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

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
        if (selectedIndex !== null) {
            optionButtons[selectedIndex].classList.add('correct');
        }
    } else {
        if (selectedIndex !== null) {
            optionButtons[selectedIndex].classList.add('incorrect');
        }
        optionButtons[questionData.answer].classList.add('correct');
    }

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    displayQuestion();
});

function endQuiz() {
    quizContainer.innerHTML = '';
    nextBtn.style.display = 'none';
    resultsEl.style.display = 'block';
    resultsEl.innerHTML = `¡Quiz Completado! Tu puntaje es de ${score} de ${questions.length}.`;
    saveResultsToLocalStorage(score);
}

function saveResultsToLocalStorage(finalScore) {
    let results = JSON.parse(localStorage.getItem('quizResults')) || [];
    results.push({ score: finalScore, timestamp: new Date().toLocaleString() });
    localStorage.setItem('quizResults', JSON.stringify(results));
}

displayQuestion();