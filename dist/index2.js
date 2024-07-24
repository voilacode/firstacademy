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
function showSection(section) {
    // Hide all sections and reset button styles
    document.querySelectorAll('.cards-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#navigation-links').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.text-blue-500').forEach(el => el.classList.remove('text-blue-500', 'font-bold'));
    document.querySelectorAll('.text-gray-500').forEach(el => el.classList.remove('text-gray-500'));

    // Show the relevant section
    if (section === 'combo') {
        document.querySelector(`#${section}`).classList.remove('hidden');
        document.querySelector('#navigation-links').classList.add('hidden');
    } else {
        document.querySelector(`#${section}-qbank`).classList.remove('hidden');
        document.querySelector('#navigation-links').classList.remove('hidden');
    }

    // Highlight the active button
    document.querySelector(`#${section}-btn`).classList.add('text-blue-500', 'font-bold');
}

function showContent(content) {
    const activeSectionId = document.querySelector('.cards-section:not(.hidden)').id;
    if (activeSectionId === 'combo') return; // Skip content change for COMBO section

    // Hide all content and update link styles
    document.querySelectorAll('.cards-section').forEach(el => el.classList.add('hidden'));

    if (activeSectionId.includes('digital-sa')) {
        document.querySelector(`#digital-sa-${content}`).classList.remove('hidden');
    } else if (activeSectionId.includes('act')) {
        document.querySelector(`#act-${content}`).classList.remove('hidden');
    }

    document.querySelectorAll('.text-blue-500').forEach(el => el.classList.remove('text-blue-500', 'font-bold'));
    document.querySelectorAll('.text-gray-500').forEach(el => el.classList.remove('text-gray-500'));
    document.querySelector(`#${content}-link`).classList.add('text-blue-500', 'font-bold');
}

// Initialize default view
document.addEventListener('DOMContentLoaded', () => {
    showSection('digital-sa');
    showContent('qbank');
});
// Initialize with the first section and content visible
document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
      const accordionContent = button.nextElementSibling;
      const accordionIcon = button.querySelector('svg');

      button.classList.toggle('active');

      if (button.classList.contains('active')) {
          accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
          accordionIcon.style.transform = 'rotate(180deg)';
      } else {
          accordionContent.style.maxHeight = 0;
          accordionIcon.style.transform = 'rotate(0deg)';
      }
  });
});
document.addEventListener('DOMContentLoaded', () => {
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const container = document.querySelector('.carousel-container');
const items = document.querySelectorAll('.testimonial-item');

const itemsToShow = {
    sm: 1,
    md: 2,
    lg: 3
};

let currentIndex = 0;

const updateCarousel = () => {
    const screenWidth = window.innerWidth;

    let itemsVisible = itemsToShow.lg;  // Default for large screens
    if (screenWidth < 768) itemsVisible = itemsToShow.sm; // Mobile
    else if (screenWidth < 1024) itemsVisible = itemsToShow.md; // Tablet

    // Update the container transform
    container.style.transform = `translateX(-${(100 / itemsVisible) * currentIndex}%)`;
};

prevBtn.addEventListener('click', () => {
    const screenWidth = window.innerWidth;
    let itemsVisible = itemsToShow.lg;  // Default for large screens
    if (screenWidth < 768) itemsVisible = itemsToShow.sm; // Mobile
    else if (screenWidth < 1024) itemsVisible = itemsToShow.md; // Tablet

    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    const screenWidth = window.innerWidth;
    let itemsVisible = itemsToShow.lg;  // Default for large screens
    if (screenWidth < 768) itemsVisible = itemsToShow.sm; // Mobile
    else if (screenWidth < 1024) itemsVisible = itemsToShow.md; // Tablet

    const maxIndex = items.length - itemsVisible;
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);
updateCarousel();  // Initialize carousel
});