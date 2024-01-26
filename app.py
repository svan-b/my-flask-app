from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'myfinancedb.cn4w40eu86mu.us-east-2.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'BenjiLouie'  # Use environment variables in production
app.config['MYSQL_DB'] = 'myfinancedb'  # Set to your DB identifier
app.config['MYSQL_PORT'] = 3306

mysql = MySQL(app)


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

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.json.get('email')
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO subscribers(email) VALUES (%s)", [email])
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Thank you for subscribing!'})


if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Runs the application on port 5001






