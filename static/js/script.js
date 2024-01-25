// Inside script.js

document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submit action
    let email = document.getElementById('emailInput').value;

    // AJAX request to send email to Flask server
    fetch('/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show response message
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
