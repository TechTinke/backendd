from .database import db
from sqlalchemy.ext.hybrid import hybrid_property
import re

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)  # Still using this field

    @hybrid_property
    def password(self):
        raise AttributeError("Password is not accessible directly")

    @password.setter
    def password(self, plain_text):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(pattern, plain_text):
            raise ValueError(
                "Password must be at least 8 characters long, contain at least one uppercase letter, "
                "one lowercase letter, one digit, and one special character."
            )
        self.password_hash = plain_text  # 🔓 store plaintext directly

    def check_password(self, plain_text):
        return self.password_hash == plain_text  # 🔓 compare as-is

    def __repr__(self):
        return f'<User {self.role}, {self.email}>'
