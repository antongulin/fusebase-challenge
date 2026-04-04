function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function getFeatureToken(): string {
  const token = getCookie('fbsfeaturetoken')
  if (token) return token
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).FBS_FEATURE_TOKEN) {
    return (window as unknown as Record<string, unknown>).FBS_FEATURE_TOKEN as string
  }
  return ''
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 401) {
    const body = await res.json().catch(() => null)
    if (body?.error === 'AppTokenValidationError' || res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth-expired'))
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || `HTTP ${res.status}`)
  }

  return res.json()
}
