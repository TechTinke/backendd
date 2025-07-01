from flask import Flask
from flask_migrate import Migrate
from models import Activity, Fee, Student, StudentActivity, User
from dotenv import load_dotenv
from models.database import db
from controllers import  students_activities_bp, students_fees_bp, add_student_bp
from flask_cors import CORS






load_dotenv()

app = Flask(__name__)

app.config.from_prefixed_env()

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)






app.register_blueprint(students_fees_bp)
app.register_blueprint(students_activities_bp)
app.register_blueprint(add_student_bp)



