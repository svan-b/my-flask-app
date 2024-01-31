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
    const marketSymbols = ['OIL', 'MSFT', 'GOLD', 'GOOGL', 'AAPL', 'V', 'FB', 'AMZN', 'JNJ', 'BTCUSD', 'JPM', 'TSLA', 'BRK.B']; // Updated list

    async function fetchMarketData(symbol) {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=QKTPR4VSJPW7QY6A`);
            const data = await response.json();
            if (data['Global Quote'] && data['Global Quote']['05. price']) {
                const price = data['Global Quote']['05. price'];
                updateTicker(symbol, price);
            } else {
                console.log(`Data unavailable or incomplete for ${symbol}`);
            }
        } catch (error) {
            console.error(`Error fetching market data for ${symbol}:`, error);
        }
    }

    function updateTicker(symbol, price) {
        const listItem = document.createElement('li');
        listItem.textContent = `${symbol}: ${price} `;
        listItem.classList.add('market-item');
        stockList.appendChild(listItem);
    }

    marketSymbols.forEach(symbol => fetchMarketData(symbol));
});









