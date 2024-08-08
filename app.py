from flask import Flask, render_template, url_for, flash, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mysqldb import MySQL
from forms import LoginForm, RegistrationForm, ComingSoonForm
import logging
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)  # This should be before csrf.init_app(app)

csrf = CSRFProtect()
csrf.init_app(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Secure connection enforcement
@app.before_request
def before_request():
    if not request.is_secure and not request.headers.get('X-Forwarded-Proto') == 'https':
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

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

@app.route('/')
def coming_soon():
    form = ComingSoonForm()
    return render_template('coming_soon.html', form=form)

@app.route('/submit', methods=['POST'])
def submit():
    form = ComingSoonForm()
    if form.validate_on_submit():
        email = form.email.data
        question1 = form.question1.data
        question2 = form.question2.data
        question3 = form.question3.data
        
        app.logger.info(f"Form data received: Email={email}, Question1={question1}, Question2={question2}, Question3={question3}")
        
        # Add this to log the JSON payload
        app.logger.info(f"Request data: {request.get_json()}")
        
        try:
            # Insert into feedback table
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO feedback (suggestions, question1, question2, question3) VALUES (%s, %s, %s, %s)",
                        (email, question1, question2, question3))
            mysql.connection.commit()
            cur.close()
            app.logger.info("Data inserted into feedback table successfully.")
            flash('Thank you for your feedback!', 'success')
        except Exception as e:
            app.logger.error(f"Error inserting data: {e}")
            flash('An error occurred. Please try again.', 'danger')
        
        return redirect(url_for('coming_soon'))
    else:
        app.logger.error(f"Form validation failed: {form.errors}")
        flash('Form validation failed. Please check your input.', 'danger')
    return render_template('coming_soon.html', form=form)

@app.route('/cookie-notice')
def cookie_notice():
    return render_template('cookie_notice.html')

@app.route('/test_db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")
        cur.close()
        return "Database connection successful!"
    except Exception as e:
        return f"Error connecting to the database: {e}"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
