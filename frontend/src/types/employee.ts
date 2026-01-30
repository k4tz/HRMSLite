export interface Employee {
  id: number
  employee_id: string
  full_name: string
  email: string
  department: string
}

export interface EmployeeCreate {
  employee_id: string
  full_name: string
  email: string
  department: string
}
