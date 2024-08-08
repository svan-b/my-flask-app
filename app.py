import os
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
app.config['SQLALCHEMY_DATABASE_URI']
