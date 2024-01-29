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


// Ticker list
document.addEventListener('DOMContentLoaded', () => {
    const stockList = document.getElementById('stock-list');

    // Function to fetch stock data
    async function fetchStockData() {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY`);
            const data = await response.json();
            updateTicker(data);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    // Function to update the ticker with fetched data
    function updateTicker(data) {
        // Example processing, adapt based on actual API response
        for (const symbol in data['Global Quote']) {
            const listItem = document.createElement('li');
            listItem.textContent = `${symbol}: ${data['Global Quote'][symbol]['05. price']}`;
            stockList.appendChild(listItem);
        }
    }

    fetchStockData();
    setInterval(fetchStockData, 900000); // Fetch new data every 15 minutes
});
