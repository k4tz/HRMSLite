from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        from_attributes = True
