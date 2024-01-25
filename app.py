from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/newsletter')
def newsletter():
    return render_template('newsletter.html')

@app.route('/consultation')
def consultation():
    return render_template('consultation.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/financial-consulting')
def financial_consulting():
    return render_template('financial-consulting.html')

@app.route('/investment-advice')
def investment_advice():
    return render_template('investment-advice.html')

@app.route('/market-analysis')
def market_analysis():
    return render_template('market-analysis.html')

@app.route('/audio-services')
def audio_services():
    return render_template('audio-services.html')

@app.route('/test')
def test():
    return 'Flask is working!'

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Runs the application on port 5001






