from models.database import db
from models.student import Student
from flask import Blueprint, jsonify, request




add_student_bp = Blueprint('add_student', __name__, url_prefix='/students')
@add_student_bp.route('/add', methods=['POST'])

def add_student():
    data = request.json
    firstname = data.get('firstname')
    middlename = data.get('middlename')
    lastname = data.get('lastname')
    admission_number = data.get('admission_number')
    grade = data.get('grade')

    if not firstname or not middlename or not lastname or not admission_number or not grade:
        return jsonify({"error": "Missing required fields"}), 400

    existing_student = Student.query.filter_by(admission_number=admission_number).first()
    if existing_student:
        return jsonify({"error": "Student with this admission number already exists"}), 400

    new_student = Student(firstname=firstname,middlename=middlename,lastname=lastname, admission_number=admission_number, grade=grade)
    db.session.add(new_student)
    db.session.commit()

    return jsonify({"message": "Student added successfully", "student_id": new_student.id}), 201