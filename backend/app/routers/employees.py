from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).order_by(Employee.employee_id).all()
    return employees


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(Employee).filter(
        (Employee.employee_id == data.employee_id) | (Employee.email == data.email)
    ).first()
    if existing:
        if existing.employee_id == data.employee_id:
            raise HTTPException(
                status_code=409,
                detail="An employee with this Employee ID already exists.",
            )
        raise HTTPException(
            status_code=409,
            detail="An employee with this email address already exists.",
        )
    employee = Employee(
        employee_id=data.employee_id.strip(),
        full_name=data.full_name.strip(),
        email=data.email.strip().lower(),
        department=data.department.strip(),
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/{employee_pk}", response_model=EmployeeResponse)
def get_employee(employee_pk: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_pk).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return employee


@router.delete("/{employee_pk}", status_code=204)
def delete_employee(employee_pk: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_pk).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
    db.delete(employee)
    db.commit()
    return None
