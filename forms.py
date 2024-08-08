from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Email, EqualTo

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField('Repeat Password')
    submit = SubmitField('Register')

class ComingSoonForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    question1 = TextAreaField('What feature would you like to see?', validators=[DataRequired()])
    question2 = TextAreaField('What investment topics are you interested in?', validators=[DataRequired()])
    question3 = TextAreaField('Any other comments or suggestions?', validators=[DataRequired()])
    submit = SubmitField('Submit')

