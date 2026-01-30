import { apiFetch, apiDelete } from './api'
import type { Employee, EmployeeCreate } from '../types/employee'

export function fetchEmployees(): Promise<Employee[]> {
  return apiFetch<Employee[]>('/employees')
}

export function fetchEmployee(id: number): Promise<Employee> {
  return apiFetch<Employee>(`/employees/${id}`)
}

export function createEmployee(data: EmployeeCreate): Promise<Employee> {
  return apiFetch<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteEmployee(id: number): Promise<void> {
  return apiDelete(`/employees/${id}`)
}
