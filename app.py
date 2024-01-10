from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# Add routes for other pages here
@app.route('/market-insights')
def market_insights():
    return render_template('market-insights.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/trade-ideas')
def trade_ideas():
    return render_template('trade-ideas.html')

# Main execution
if __name__ == '__main__':
    app.run(debug=True, port=5001)
