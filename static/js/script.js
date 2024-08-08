document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = 1;

    function startSurvey() {
        console.log("Starting survey...");
        document.getElementById('emailForm').classList.add('hidden');
        document.getElementById('survey').classList.remove('hidden');
        document.getElementById('question1').classList.remove('hidden');
        document.getElementById('nextQuestion').classList.remove('hidden');
    }

    function nextQuestion() {
        console.log("Moving to next question...");
        document.getElementById('question' + currentQuestion).classList.add('hidden');
        currentQuestion++;
        if (currentQuestion <= 3) {
            document.getElementById('question' + currentQuestion).classList.remove('hidden');
            if (currentQuestion === 3) {
                document.getElementById('nextQuestion').classList.add('hidden');
                document.getElementById('submitSurvey').classList.remove('hidden');
            }
        }
    }

    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);

    document.getElementById('surveyForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Submitting survey...");
        const email = document.getElementById('email').value;
        const feature = document.getElementById('feature').value;
        const topics = document.getElementById('topics').value;
        const comments = document.getElementById('comments').value;
        const csrfToken = document.querySelector('input[name="csrf_token"]').value;

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
                document.getElementById('survey').classList.add('hidden');
                document.getElementById('thankYouMessage').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('thankYouMessage').classList.add('hidden');
                    document.getElementById('emailForm').reset();
                    document.getElementById('emailForm').classList.remove('hidden');
                }, 3000);
            } else {
                alert('There was an error submitting your feedback. Please try again.');
            }
        });
    });

    document.getElementById('subscribeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Submitting email...");
        let email = document.getElementById('emailInput').value;

        fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    const stockList = document.getElementById('stock-list');
    const marketSymbols = ['OIL', 'MSFT', 'GOLD', 'GOOGL', 'AAPL', 'V', 'FB', 'AMZN', 'JNJ', 'BTCUSD', 'JPM', 'TSLA', 'BRK.B'];

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
