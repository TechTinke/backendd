from flask import Flask
from flask_migrate import Migrate
from server.models import Activity, Fee, Student, StudentActivity, User
from server.models.database import db
from server.controllers import students_activities_bp, students_fees_bp, add_student_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Load environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///data.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(students_fees_bp)
    app.register_blueprint(students_activities_bp)
    app.register_blueprint(add_student_bp)

    return app