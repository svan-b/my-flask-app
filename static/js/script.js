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
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'BRK.B', 'JPM', 'V', 'TSLA', 'JNJ'];

    async function fetchStockData(symbol) {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QKTPR4VSJPW7QY6A`);
            const data = await response.json();
            console.log(symbol, "response data:", data); // Debugging line
            const percentChange = data['Global Quote']['10. change percent'];
            console.log(symbol, "percent change:", percentChange); // Debugging line
            if (percentChange) {
                const isPositive = percentChange.includes('+');
                updateTicker(symbol, percentChange, isPositive);
            } else {
                console.log("No percent change for", symbol); // Debugging line
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
        stockList.innerHTML = '';
        stockSymbols.forEach(symbol => fetchStockData(symbol));
    }, 300000);
});
