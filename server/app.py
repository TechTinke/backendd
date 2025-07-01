from flask import Flask
from flask_migrate import Migrate
from models import Activity, Fee, Student, StudentActivity, User
from dotenv import load_dotenv
from models.database import db
from controllers import students_activities_bp, students_fees_bp, add_student_bp
from flask_cors import CORS
import os
import sys

# Add the server directory to the Python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

load_dotenv()

app = Flask(__name__)

# Load environment variables
app.config.from_prefixed_env()

# Use DATABASE_URL from environment, ensuring postgresql:// scheme for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://bazar:OkzpRGFmSTFhbWhDjlmAucqaIuBfVbX9@dpg-d1f4haje5dus73fhr05g-a/ledger_v58i').replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(students_fees_bp)
app.register_blueprint(students_activities_bp)
app.register_blueprint(add_student_bp)

if __name__ == '__main__':
    app.run()