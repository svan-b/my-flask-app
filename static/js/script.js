// static/js/script.js

let currentQuestion = 1;

function startSurvey() {
    document.getElementById('emailForm').classList.add('hidden');
    document.getElementById('survey').classList.remove('hidden');
    document.getElementById('question1').classList.remove('hidden');
    document.getElementById('nextQuestion').classList.remove('hidden');
}

function nextQuestion() {
    document.getElementById('question' + currentQuestion).classList.add('hidden');
    currentQuestion++;
    if (currentQuestion <= 3) {
        document.getElementById('question' + currentQuestion).classList.remove('hidden');
        if (currentQuestion === 3) {
            document.getElementById('nextQuestion').classList.add('hidden');
            document.getElementById('submitSurvey').classList.remove('hidden');
        }
    }
}

document.getElementById('surveyForm').onsubmit = function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const feature = document.getElementById('feature').value;
    const topics = document.getElementById('topics').value;
    const comments = document.getElementById('comments').value;

    // AJAX request to submit form data
    fetch('{{ url_for("submit") }}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
       











