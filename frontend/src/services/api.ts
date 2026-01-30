const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string | Record<string, unknown> | unknown[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseErrorResponse(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    const detail = data.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0 && detail[0].msg != null) {
      return String(detail[0].msg)
    }
    if (typeof detail === 'object' && detail != null && 'msg' in detail) {
      return String((detail as { msg: unknown }).msg)
    }
  } catch {
    // ignore
  }
  return res.statusText || `Request failed (${res.status})`
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const message = await parseErrorResponse(res)
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch(path, { method: 'DELETE' })
}
