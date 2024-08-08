// CSRF token handling and form submission for survey
document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Submit Survey button clicked");
    const email = document.getElementById('email').value;
    const feature = document.getElementById('feature').value;
    const topics = document.getElementById('topics').value;
    const comments = document.getElementById('comments').value;
    const csrfToken = document.querySelector('input[name="csrf_token"]').value;

    console.log("Submitting survey with data:", { email, feature, topics, comments });

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            email: email,
            question1: feature,
            question2: topics,
            question3: comments
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Server returned an error');
        }
    })
    .then(data => {
        if (data.success) {
            console.log("Survey submitted successfully");
            // Proceed to the next question or display a success message
            nextQuestion();
        } else {
            alert('There was an error submitting your feedback. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your feedback. Please try again.');
    });
});