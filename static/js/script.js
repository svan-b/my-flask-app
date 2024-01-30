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
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'BRK.B', 'JPM', 'V', 'TSLA', 'JNJ']; // Add other stock symbols as needed

    async function fetchStockData(symbol) {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QKTPR4VSJPW7QY6A`);
            const data = await response.json();
            if (data['Global Quote'] && data['Global Quote']['10. change percent']) {
                const percentChange = data['Global Quote']['10. change percent'];
                const isPositive = percentChange.includes('+');
                updateTicker(symbol, percentChange, isPositive);
            } else {
                console.log("Incomplete or missing data for", symbol); // Log for missing data
            }
        } catch (error) {
            console.error('Error fetching stock data for', symbol, ':', error);
        }
    }

    function updateTicker(symbol, percentChange, isPositive) {
        const listItem = document.createElement('li');
        listItem.textContent = `${symbol}: ${percentChange}`;
        listItem.className = isPositive ? 'positive-change' : 'negative-change';
        stockList.appendChild(listItem);
    }

    stockSymbols.forEach(symbol => fetchStockData(symbol));
    setInterval(() => {
        stockList.innerHTML = ''; // Clear existing items
        stockSymbols.forEach(symbol => fetchStockData(symbol)); // Refresh data
    }, 300000); // Refresh interval: 5 minutes
});



