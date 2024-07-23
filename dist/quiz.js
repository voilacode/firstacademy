let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

// Function to show the selected question
function showQuestion(index) {
    currentQuestionIndex = index;
    document.querySelectorAll('.question-buttons button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-container').innerHTML = `Q${currentQuestionIndex + 1}: ${question.question}`;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    if (question.type === 'mcq') {
        for (const [key, value] of Object.entries(question)) {
            if (['a', 'b', 'c', 'd'].includes(key)) {
                const optionWrapper = document.createElement('div');
                optionWrapper.classList.add('flex', 'items-center', 'mb-2');
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = 'option';
                optionInput.value = key;
                optionInput.onclick = () => selectOption(key);
                if (userAnswers[currentQuestionIndex] === key) {
                    optionInput.checked = true;
                }
                const optionLabel = document.createElement('label');
                optionLabel.innerHTML = value;
                optionLabel.classList.add('ml-2', 'option');
                optionWrapper.appendChild(optionInput);
                optionWrapper.appendChild(optionLabel);
                optionsContainer.appendChild(optionWrapper);
            }
        }
    } else if (question.type === 'fill-in-the-blank') {
        question.blanks.forEach((_, index) => {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('mb-2');
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.classList.add('input-field');
            inputField.value = userAnswers[currentQuestionIndex] ? userAnswers[currentQuestionIndex][index] : '';
            inputField.oninput = () => {
                if (!userAnswers[currentQuestionIndex]) userAnswers[currentQuestionIndex] = [];
                userAnswers[currentQuestionIndex][index] = inputField.value;
            };
            inputWrapper.appendChild(inputField);
            optionsContainer.appendChild(inputWrapper);
        });
    }

    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('submit-btn').innerText = 'Submit';
    document.getElementById('quiz-container').classList.remove('hidden');
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
}

function showAnswer() {
    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answer.split(',').map(ans => ans.trim().toLowerCase());
    const optionsContainer = document.getElementById('options-container');
    const explanation = document.getElementById('explanation');
    const inputs = optionsContainer.querySelectorAll('input');

    if (question.type === 'mcq') {
        inputs.forEach(input => {
            const optionValue = input.value.toLowerCase();
            const label = input.nextElementSibling;

            if (correctAnswers.includes(optionValue)) {
                label.classList.add('correct');
                label.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>';
            } else {
                label.classList.remove('correct');
            }
        });
    } else if (question.type === 'fill-in-the-blank') {
        inputs.forEach((input, index) => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = correctAnswers[index];
            
            if (userAnswer === correctAnswer) {
                input.classList.add('correct');
            } else {
                input.classList.add('incorrect');
            }
        });
    }

    explanation.innerHTML = `<h3 class="font-medium ">Explanation</h3>${question.explanation || 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed doloremque eligendi reiciendis dicta inventore cupiditate dolores perferendis saepe, ad non eveniet itaque reprehenderit. Eveniet, laborum libero labore quas sunt expedita?'}`;
    explanation.classList.remove('hidden');
}

function submitAnswer() {
    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answer.split(',').map(ans => ans.trim().toLowerCase());
    
    if (question.type === 'mcq') {
        const selectedAnswer = document.querySelector('input[name="option"]:checked');
        
        if (selectedAnswer) {
            const selectedAnswerValue = selectedAnswer.value.toLowerCase();
            if (correctAnswers.includes(selectedAnswerValue)) {
                showAnswer();
            } else {
                showAnswer();
            }
            
            document.getElementById('submit-btn').innerText = 'Next Question';
            document.getElementById('submit-btn').onclick = moveToNextQuestion;
        } else {
            alert('Please select an answer!');
        }
    } else if (question.type === 'fill-in-the-blank') {
        const userAnswersForQuestion = userAnswers[currentQuestionIndex] || [];
        if (userAnswersForQuestion.length === correctAnswers.length) {
            let allCorrect = true;
            
            userAnswersForQuestion.forEach((userAnswer, index) => {
                if (userAnswer.trim().toLowerCase() !== correctAnswers[index]) {
                    allCorrect = false;
                }
            });
            
            if (allCorrect) {
                showAnswer();
            } else {
                showAnswer();
            }
            
            document.getElementById('submit-btn').innerText = 'Next Question';
            document.getElementById('submit-btn').onclick = moveToNextQuestion;
        } else {
            alert('Please fill in all blanks!');
        }
    }
}

function moveToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        document.getElementById('quiz-container').classList.add('hidden');
        alert('End of Quiz');
    }

    // Reset button and explanation
    document.getElementById('submit-btn').innerText = 'Submit';
    document.getElementById('submit-btn').onclick = submitAnswer;
    document.getElementById('explanation').classList.add('hidden');
}

// Initialization function
function initQuiz() {
    const url = "https://live-ai.s3.ap-south-1.amazonaws.com/test/vc/vcgtwa9b63/vcgtwa9b63_questionbank.json";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            questions = data.questions.slice(0, 5).map(q => JSON.parse(q.qdata)[0]);
            userAnswers = new Array(questions.length).fill(null);
            showQuestion(0);  // Show the first question by default
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Initialize the quiz when the page loads
window.onload = initQuiz;