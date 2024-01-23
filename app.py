from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/insights')
def insights():
    return render_template('insights.html')

@app.route('/consultation')
def consultation():
    return render_template('consultation.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/test')
def test():
    return 'Flask is working!'

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Runs the application on port 5001





    





