from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("", response_model=AttendanceResponse, status_code=201)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == data.employee_id,
            Attendance.date == data.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Attendance for this employee on this date already exists. Update or delete the existing record first.",
        )
    attendance = Attendance(
        employee_id=data.employee_id,
        date=data.date,
        status=data.status.lower(),
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get("", response_model=list[AttendanceResponse])
def list_attendance(
    employee_id: int | None = Query(None, gt=0, description="Filter by employee ID"),
    db: Session = Depends(get_db),
):
    q = db.query(Attendance).order_by(Attendance.date.desc(), Attendance.id.desc())
    if employee_id is not None:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found.")
        q = q.filter(Attendance.employee_id == employee_id)
    return q.all()


@router.delete("/{attendance_pk}", status_code=204)
def delete_attendance(attendance_pk: int, db: Session = Depends(get_db)):
    attendance = db.query(Attendance).filter(Attendance.id == attendance_pk).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found.")
    db.delete(attendance)
    db.commit()
    return None
