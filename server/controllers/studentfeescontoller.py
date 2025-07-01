from flask import Blueprint, jsonify, request
from models.database import db
from models.fee import Fee
from models.student import Student
import os
import sys

# Add server directory to Python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

students_fees_bp = Blueprint('students_fees', __name__, url_prefix='/students/fees')


@students_fees_bp.route('/')
def list_students_with_fees():
    students = Student.query.all()
    result = []
    for student in students:
        total_paid = sum(f.amount for f in student.fees)
        required = 10000  # assume fixed required fee
        overpayment = max(total_paid - required, 0)
        deficit = max(required - total_paid, 0)
        
        
        result.append({
            "id": student.id,
            "firstname": student.firstname,
            "middlename": student.middlename,
            "lastname": student.lastname,
            "admission_number": student.admission_number,
            "grade": student.grade,
            "amount": total_paid,
            "overpayment": overpayment,
            "deficit": deficit,
          
        })
    return jsonify(result)


@students_fees_bp.route('/<string:admission_number>')
def get_student_fees(admission_number):
    student = Student.query.filter_by(admission_number=admission_number).first_or_404()
    total_paid = sum(f.amount for f in student.fees)
    required = 10000
    overpayment = max(total_paid - required, 0)
    deficit = max(required - total_paid, 0)
  
    return jsonify({
         "id": student.id,  
        "firstname": student.firstname,
        "middlename": student.middlename,
        "lastname": student.lastname,
        "admission_number": student.admission_number,
        "grade": student.grade,
        "amount": total_paid,
        "overpayment": overpayment,
        "deficit": deficit,
      
    })


@students_fees_bp.route('/<string:admission_number>/update_payment', methods=['PATCH'])
def update_payment_status(admission_number):
    student = Student.query.filter_by(admission_number=admission_number).first_or_404()

    amount = request.json.get('amount')
    date_str = request.json.get('date')  # Expecting "YYYY-MM-DD"

    if not amount or not date_str:
        return jsonify({"error": "Amount and date are required"}), 400

    new_fee = Fee(
        student_id=student.id,
        amount=amount,
        date=date_str
    )

    db.session.add(new_fee)
    db.session.commit()

    # Refresh student to reflect new fee status
    db.session.refresh(student)

    return jsonify({
        "message": "Payment status updated successfully",
        "admission_number": admission_number,
        "amount": student.total_fee_paid,  
        "date": date_str
    }), 200


@students_fees_bp.route('/<string:admission_number>/fees', methods=['POST'])
def add_student_fee(admission_number):
    student = Student.query.filter_by(admission_number=admission_number).first_or_404()

    amount = request.json.get('amount')
    date = request.json.get('date')  # Assuming ISO format: "2025-06-27"

    if not amount or not date:
        return jsonify({"message": "Amount and date are required"}), 400

    new_fee = Fee(amount=amount, date=date, student_id=student.id)

    db.session.add(new_fee)
    db.session.commit()

    return jsonify({
        "message": "Fee added successfully",
        "admission_number": student.admission_number,
        "student_firstname": student.firstname,
        "student_middlename": student.middlename,
        "student_lastname": student.lastname,
        "amount": new_fee.amount,
        "date": new_fee.date.isoformat()
    })

@students_fees_bp.route('/delete_fee_by_student_id/<int:student_id>', methods=['DELETE'])
def delete_fee_by_student_id(student_id):
    fee = Fee.query.filter_by(student_id=student_id).first()
    if not fee:
        return jsonify({"message": "Fee record not found for this student"}), 404

    db.session.delete(fee)
    db.session.commit()

    return jsonify({"message": "Fee deleted successfully", "student_id": student_id, "fee_id": fee.id}), 200