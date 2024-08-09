from flask import Flask, render_template, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mysqldb import MySQL
from forms import ComingSoonForm
import logging
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

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
        return check_password_hash(password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def coming_soon():
    form = ComingSoonForm()
    return render_template('coming_soon.html', form=form)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    email = data.get('email')
    question1 = data.get('question1')
    question2 = data.get('question2')
    question3 = data.get('question3')

    if not email or not question1 or not question2 or not question3:
        app.logger.error("Missing form data")
        return jsonify({'success': False, 'error': 'Missing form data'})

    app.logger.info(f"Form data received: Email={email}, Question1={question1}, Question2={question2}, Question3={question3}")

    try:
        # Insert into feedback table
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO feedback (email, question1, question2, question3) VALUES (%s, %s, %s, %s)",
                    (email, question1, question2, question3))
        mysql.connection.commit()
        cur.close()
        app.logger.info("Data inserted into feedback table successfully.")
        return jsonify({'success': True})
    except Exception as e:
        app.logger.error(f"Error inserting data: {e}")
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
