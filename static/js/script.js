document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Submit Survey button clicked");

    const email = document.querySelector('input[name="email"]').value;
    const csrfToken = document.querySelector('input[name="csrf_token"]').value;

    console.log("Submitting survey with data:", { email });

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            email: email
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
            document.getElementById('thankYouMessage').classList.remove('hidden');
            document.getElementById('emailForm').classList.add('hidden');
        } else {
            alert('There was an error submitting your feedback. Please try again.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your feedback. Please try again.');
    });
});
