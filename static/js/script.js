document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Submit Survey button clicked");

    const email = document.querySelector('input[name="email"]').value;
    const feature = document.querySelector('textarea[name="question1"]').value;
    const topics = document.querySelector('textarea[name="question2"]').value;
    const comments = document.querySelector('textarea[name="question3"]').value;
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
            // Display a success message or proceed further
            alert('Thank you for your submission!');
        } else {
            alert('There was an error submitting your feedback. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your feedback. Please try again.');
    });
});
