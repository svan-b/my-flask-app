import os
from flask import Flask, render_template, url_for, flash, redirect, request, jsonify
import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing.api_client import ApiClientError
import traceback
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mysqldb import MySQL
from forms import LoginForm, RegistrationForm, ComingSoonForm  # Import the new form
from flask import send_from_directory

app = Flask(__name__)

@app.before_request
def before_request():
    if not request.is_secure and not request.headers.get('X-Forwarded-Proto') == 'https':
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

# Configure Mailchimp
mailchimp = MailchimpMarketing.Client()
mailchimp.set_config({
    "api_key": "YOUR_MAILCHIMP_API_KEY",
    "server": "YOUR_MAILCHIMP_SERVER_PREFIX"
})

@app.route('/cookie-notice')
def cookie_notice():
    return render_template('cookie_notice.html')


# MySQL configurations
app.config['MYSQL_HOST'] = 'myfinancedb.cn4w40eu86mu.us-east-2.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'BenjiLouie'
app.config['MYSQL_DB'] = 'myfinancedb'
app.config['MYSQL_PORT'] = 3306

mysql = MySQL(app)

# SQLAlchemy configuration
app.config['SECRET_KEY'] = 'BenjiLouie'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# User authentication routes
@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/download/stemcell')
@login_required
def download_stemcell():
    try:
        directory = os.path.join(app.root_path, 'static', 'files')
        filename = 'STEMCELL_consolidated.xlsm'

        if not os.path.exists(os.path.join(directory, filename)):
            raise FileNotFoundError(f"File {filename} not found in directory {directory}")

        return send_from_directory(directory, filename, as_attachment=True)
    except Exception as e:
        app.logger.error(f"Error downloading file: {e}")
        return "Error downloading file", 500

@app.route('/client')
@login_required
def client():
    return render_template('client.html')

@app.route('/')
def coming_soon():
    form = ComingSoonForm()
    return render_template('coming_soon.html', form=form)

@app.route('/submit', methods=['POST'])
def submit():
    form = ComingSoonForm()
    if form.validate_on_submit():
        email = form.email.data
        suggestions = form.suggestions.data
        # Handle form submission (e.g., save to a database or send an email)
        print(f"Email: {email}")
        print(f"Suggestions: {suggestions}")
        flash('Thank you for your suggestions!', 'success')
        return redirect(url_for('coming_soon'))
    return render_template('coming_soon.html', form=form)

# Existing routes (commented out for now)
# @app.route('/services')
# def services():
#     return render_template('services.html')
#
# @app.route('/newsletter')
# def newsletter():
#     return render_template('newsletter.html')
#
# @app.route('/consultation')
# def consultation():
#     return render_template('consultation.html')
#
# @app.route('/about')
# def about():
#     return render_template('about.html')
#
# @app.route('/contact')
# def contact():
#     return render_template('contact.html')
#
# @app.route('/financial-consulting')
# def financial_consulting():
#     return render_template('financial-consulting.html')
#
# @app.route('/investment-advice')
# def investment_advice():
#     return render_template('investment-advice.html')
#
# @app.route('/market-analysis')
# def market_analysis():
#     return render_template('market-analysis.html')
#
# @app.route('/audio-services')
# def audio_services():
#     return render_template('audio-services.html')

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

@app.errorhandler(500)
def internal_error(error):
    trace = traceback.format_exc()
    app.logger.error('Server Error: %s', trace)
    return "500 Internal Server Error", 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)










