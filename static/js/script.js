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
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            question1: feature,
            question2: topics,
            question3: comments
        })
    }).then(response => {
        if (response.ok) {
            document.getElementById('survey').classList.add('hidden');
            document.getElementById('thankYouMessage').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('thankYouMessage').classList.add('hidden');
                document.getElementById('emailForm').reset();
                document.getElementById('emailForm').classList.remove('hidden');
            }, 3000);
        } else {
            alert('There was an error submitting your feedback. Please try again.');
        }
    });
}

