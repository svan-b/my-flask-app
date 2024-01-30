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

    async function fetchStockData(symbol) {
        console.log(`Fetching data for ${symbol}`); // Debugging log
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QKTPR4VSJPW7QY6A`);
            const data = await response.json();
            console.log('API response:', data); // Debugging log
            if (data['Global Quote'] && data['Global Quote']['08. previous close']) {
                const closePrice = data['Global Quote']['08. previous close'];
                updateTicker(symbol, closePrice);
            } else {
                console.log("Incomplete or missing data for", symbol); // Log for missing data
            }
        } catch (error) {
            console.error('Error fetching stock data for', symbol, ':', error);
        }
    }

    function updateTicker(symbol, closePrice) {
        const listItem = document.createElement('li');
        listItem.textContent = `${symbol}: ${closePrice}`;
        stockList.appendChild(listItem);
    }

    // Test with a single stock symbol
    fetchStockData('AAPL');
});




