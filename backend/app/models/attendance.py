from datetime import date

from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class AttendanceStatus:
    PRESENT = "present"
    ABSENT = "absent"


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)  # present | absent

    employee = relationship("Employee", back_populates="attendance")
