document.addEventListener('DOMContentLoaded', function() {
    let savedEmail = '';

    // Handle Email Form Submission
    document.getElementById('emailForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Submit Survey button clicked");

        const email = document.getElementById('email').value;
        const csrfToken = document.querySelector('input[name="csrf_token"]').value;

        const data = {
            email: email,
            question1: '',
            question2: '',
            question3: ''
        };

        console.log("Submitting survey with data:", data);

        // Disable the submit button to prevent duplicate submissions
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("Response status:", response.status);
            return response.json().then(data => ({status: response.status, body: data}));
        }).then(data => {
            if (data.status === 200 && data.body.success) {
                console.log("Survey submitted successfully");
                savedEmail = email;
                const emailForm = document.getElementById('emailForm');
                const questionSection = document.getElementById('questionSection');

                if (emailForm) {
                    emailForm.style.display = 'none';
                }
                if (questionSection) {
                    questionSection.classList.remove('hidden');
                }
            } else {
                console.error("Error in response:", data);
                alert('There was an error submitting your feedback. Please try again.');
                submitButton.disabled = false; // Re-enable if submission fails
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your feedback. Please try again.');
            submitButton.disabled = false; // Re-enable if submission fails
        });
    });

    // Handle Survey Form Submission
    document.getElementById('surveyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Submit Feedback button clicked");

        const feature = document.getElementById('feature').value;
        const topics = document.getElementById('topics').value;
        const comments = document.getElementById('comments').value;
        const csrfToken = document.querySelector('input[name="csrf_token"]').value;

        const data = {
            email: savedEmail,
            question1: feature,
            question2: topics,
            question3: comments
        };

        console.log("Submitting feedback with data:", data);

        // Disable the submit button to prevent duplicate submissions
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("Response status:", response.status);
            return response.json().then(data => ({status: response.status, body: data}));
        }).then(data => {
            if (data.status === 200 && data.body.success) {
                console.log("Feedback submitted successfully");

                // Show the Thank You message and refresh the page after a delay
                const surveyForm = document.getElementById('surveyForm');
                const thankYouMessage = document.getElementById('thankYouMessage');

                if (surveyForm) {
                    surveyForm.style.display = 'none';
                }
                if (thankYouMessage) {
                    thankYouMessage.classList.remove('hidden');
                }

                setTimeout(function() {
                    location.reload(); // Refreshes the page
                }, 3000); // 3-second delay
            } else {
                console.error("Error in response:", data);
                alert('There was an error submitting your feedback. Please try again.');
                submitButton.disabled = false; // Re-enable if submission fails
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your feedback. Please try again.');
            submitButton.disabled = false; // Re-enable if submission fails
        });
    });
});
