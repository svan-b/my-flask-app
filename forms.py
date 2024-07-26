from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email

class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class ComingSoonForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    question1 = TextAreaField('What feature would you like to see?', validators=[DataRequired()])
    question2 = TextAreaField('What investment topics are you interested in?', validators=[DataRequired()])
    question3 = TextAreaField('Any other comments or suggestions?', validators=[DataRequired()])
    submit = SubmitField('Join our Exclusive Client List')

